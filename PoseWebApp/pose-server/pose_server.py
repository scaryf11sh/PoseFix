#!/usr/bin/env python3
"""
PoseFix Pose Server — YOLOv8-pose WebSocket server.
One CameraWorker thread per active camera, each with its own YOLO instance
so inference runs truly in parallel.

Config via env vars (or defaults):
  POSE_WS_HOST  default: localhost
  POSE_WS_PORT  default: 8765
"""

import asyncio
import json
import logging
import os
import threading
import time

import cv2
import numpy as np
import websockets
from ultralytics import YOLO

# ─── Config ──────────────────────────────────────────────────────────────────

WS_HOST      = os.getenv("POSE_WS_HOST", "localhost")
WS_PORT      = int(os.getenv("POSE_WS_PORT", "8765"))
CAMERA_WIDTH  = 640
CAMERA_HEIGHT = 480
CAMERA_FPS    = 30

# Precision → YOLO confidence threshold + frame skip interval
PRECISION_CONF  = {"High": 0.25, "Balanced": 0.35, "Low": 0.50}
PRECISION_SKIP  = {"High": 1,    "Balanced": 1,    "Low": 2}

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
log = logging.getLogger(__name__)

# ─── Camera worker ────────────────────────────────────────────────────────────


class CameraWorker(threading.Thread):
    """Background thread: loads YOLO, captures frames, sends landmarks via WS."""

    def __init__(
        self,
        camera_index: int,
        send_coro,                       # async def send(msg: str)
        loop: asyncio.AbstractEventLoop,
        precision: str = "Balanced",
    ):
        super().__init__(name=f"cam-{camera_index}", daemon=True)
        self.camera_index = camera_index
        self._send       = send_coro
        self._loop       = loop
        self._paused     = False
        self._stopped    = False
        self._lock       = threading.Lock()
        self._model      = None  # loaded in run() — keeps asyncio event loop free
        self._conf       = PRECISION_CONF.get(precision, 0.35)
        self._frame_skip = PRECISION_SKIP.get(precision, 1)
        self._frame_count = 0

    # ── Thread-safe control ──────────────────────────────────────────────────

    def pause(self):
        with self._lock:
            self._paused = True

    def resume(self):
        with self._lock:
            self._paused = False

    def stop(self):
        with self._lock:
            self._stopped = True

    def set_precision(self, level: str):
        with self._lock:
            self._conf       = PRECISION_CONF.get(level, 0.35)
            self._frame_skip = PRECISION_SKIP.get(level, 1)

    # ── Internal helpers ─────────────────────────────────────────────────────

    def _emit(self, data: dict):
        """Schedule an async WS send from this thread."""
        asyncio.run_coroutine_threadsafe(
            self._send(json.dumps(data)), self._loop
        )

    def _is_stopped(self) -> bool:
        with self._lock:
            return self._stopped

    def _is_paused(self) -> bool:
        with self._lock:
            return self._paused

    # ── Main loop ────────────────────────────────────────────────────────────

    def run(self):
        # 1. Notify client: model is loading (takes 5-30s)
        self._emit({"type": "loading", "camera_index": self.camera_index})

        log.info(f"[CAM-{self.camera_index}] Loading YOLOv8-pose model…")
        self._model = YOLO("yolov8n-pose.pt")
        # Warmup pass so first real frame isn't slow
        _dummy = np.zeros((CAMERA_HEIGHT, CAMERA_WIDTH, 3), dtype=np.uint8)
        self._model.predict(_dummy, verbose=False)
        log.info(f"[CAM-{self.camera_index}] Model ready ✓")

        # 2. Open camera
        log.info(f"[CAM-{self.camera_index}] Opening camera…")
        cap = cv2.VideoCapture(self.camera_index)
        if not cap.isOpened():
            msg = f"Could not open camera {self.camera_index}"
            log.error(f"[CAM-{self.camera_index}] {msg}")
            self._emit({"type": "error", "camera_index": self.camera_index, "message": msg})
            return

        cap.set(cv2.CAP_PROP_FRAME_WIDTH,  CAMERA_WIDTH)
        cap.set(cv2.CAP_PROP_FRAME_HEIGHT, CAMERA_HEIGHT)
        cap.set(cv2.CAP_PROP_FPS,          CAMERA_FPS)
        cap.set(cv2.CAP_PROP_BUFFERSIZE,   1)  # low latency

        log.info(f"[CAM-{self.camera_index}] Streaming started")
        self._emit({"type": "status", "camera_index": self.camera_index, "status": "started"})

        try:
            while not self._is_stopped():
                if self._is_paused():
                    time.sleep(0.1)
                    continue

                ret, frame = cap.read()
                if not ret:
                    time.sleep(0.05)
                    continue

                # ── Frame skipping (Low precision) ────────────────────────────
                self._frame_count += 1
                with self._lock:
                    skip = self._frame_skip
                    conf = self._conf
                if skip > 1 and (self._frame_count % skip) != 0:
                    continue

                # ── YOLO inference ───────────────────────────────────────────
                results = self._model.predict(frame, conf=conf, verbose=False, stream=False)

                if not results or results[0].keypoints is None:
                    continue

                kpts = results[0].keypoints
                if len(kpts) == 0:
                    continue

                # Use first detected person only
                xyn  = kpts.xyn[0]  if kpts.xyn  is not None else None
                conf = kpts.conf[0] if kpts.conf is not None else None
                if xyn is None:
                    continue

                landmarks = [
                    {
                        "x":          float(xyn[i][0]),
                        "y":          float(xyn[i][1]),
                        "z":          0.0,
                        "visibility": float(conf[i]) if conf is not None else 1.0,
                    }
                    for i in range(len(xyn))
                ]

                self._emit({
                    "camera_index": self.camera_index,
                    "landmarks":    landmarks,
                    "timestamp":    time.time(),
                })

        finally:
            cap.release()
            self._emit({"type": "status", "camera_index": self.camera_index, "status": "stopped"})
            log.info(f"[CAM-{self.camera_index}] Stopped")


# ─── WebSocket handler ────────────────────────────────────────────────────────


async def handler(websocket):
    log.info(f"Client connected: {websocket.remote_address}")
    loop    = asyncio.get_event_loop()
    workers: dict[int, CameraWorker] = {}

    async def send(msg: str):
        try:
            await websocket.send(msg)
        except Exception:
            pass

    try:
        async for raw in websocket:
            try:
                msg     = json.loads(raw)
                cmd     = msg.get("cmd")
                cam_idx = int(msg.get("camera_index", 0))

                if cmd == "start_camera":
                    if cam_idx not in workers or not workers[cam_idx].is_alive():
                        w = CameraWorker(cam_idx, send, loop)
                        workers[cam_idx] = w
                        w.start()

                elif cmd == "pause_camera":
                    if cam_idx in workers:
                        workers[cam_idx].pause()

                elif cmd == "resume_camera":
                    if cam_idx in workers:
                        workers[cam_idx].resume()

                elif cmd == "stop_camera":
                    if cam_idx in workers:
                        workers[cam_idx].stop()
                        del workers[cam_idx]

                elif cmd == "stop_all":
                    for w in workers.values():
                        w.stop()
                    workers.clear()

                elif cmd == "set_precision":
                    level = msg.get("level", "Balanced")
                    for w in workers.values():
                        w.set_precision(level)
                    log.info(f"Precision set to {level}")

            except (json.JSONDecodeError, ValueError):
                pass

    except Exception as e:
        log.info(f"Client disconnected: {e}")
    finally:
        for w in workers.values():
            w.stop()
        workers.clear()
        log.info("All workers cleaned up")


# ─── Entry point ──────────────────────────────────────────────────────────────


async def main():
    log.info(f"PoseFix pose server starting on ws://{WS_HOST}:{WS_PORT}")
    async with websockets.serve(handler, WS_HOST, WS_PORT):
        await asyncio.Future()  # run forever


if __name__ == "__main__":
    asyncio.run(main())
