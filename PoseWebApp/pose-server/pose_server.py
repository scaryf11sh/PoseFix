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
import mediapipe as mp
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

# ─── Face Tracking Constants ─────────────────────────────────────────────────────

FACE_OVAL  = [10,338,297,332,284,251,389,356,454,323,361,288,397,365,379,378,400,377,152,148,176,149,150,136,172,58,132,93,234,127,162,21,54,103,67,109]
EYE_LEFT   = [33,246,161,160,159,158,157,173,133,155,154,153,145,144,163,7]
EYE_RIGHT  = [362,398,384,385,386,387,388,466,263,249,390,373,374,380,381,382]
LIPS_OUTER = [61,185,40,39,37,0,267,269,270,409,291,375,321,405,314,17,84,181,91,146]
NOSE       = [1,2,98,327,168,6]

class FaceCoordinator:
    """Manages which camera is the 'best' for face tracking to avoid redundant MediaPipe load."""
    def __init__(self):
        self.workers = {}
        self.best_cam_idx = None
        self.last_eval_time = 0

    def register_worker(self, cam_idx, worker):
        self.workers[cam_idx] = worker
        if self.best_cam_idx is None:
            self.best_cam_idx = cam_idx

    def unregister_worker(self, cam_idx):
        if cam_idx in self.workers:
            del self.workers[cam_idx]
        if self.best_cam_idx == cam_idx:
            self.best_cam_idx = self._find_best_camera()

    def _find_best_camera(self):
        best_idx = None
        max_vis = -1
        for idx, worker in self.workers.items():
            vis = getattr(worker, 'last_visibility', 0)
            if vis > max_vis:
                max_vis = vis
                best_idx = idx
        return best_idx

    def get_best_camera(self):
        now = time.time()
        if now - self.last_eval_time > 1.0:
            self.best_cam_idx = self._find_best_camera()
            self.last_eval_time = now
        return self.best_cam_idx

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
        coordinator: FaceCoordinator = None,
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
        self.coordinator  = coordinator
        self.last_visibility = 0
        self._face_mesh   = None
        self._blink_buffer = []
        self._last_blink_time = 0

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

    def _calculate_ear(self, landmarks, eye_indices):
        """Compute Eye Aspect Ratio (EAR) using numpy."""
        # Vertical 1: indices 4, 12; Vertical 2: indices 5, 13; Horizontal: 0, 8
        p = [landmarks[i] for i in eye_indices]
        v1 = np.linalg.norm(np.array(p[4]) - np.array(p[12]))
        v2 = np.linalg.norm(np.array(p[5]) - np.array(p[13]))
        h  = np.linalg.norm(np.array(p[0]) - np.array(p[8]))
        return (v1 + v2) / (2.0 * h) if h > 0 else 0.0

    def _process_face(self, frame):
        """Run MediaPipe Face Mesh and compute eye/face data."""
        if self._face_mesh is None:
            self._face_mesh = mp.solutions.face_mesh.FaceMesh(
                static_image_mode=False, max_num_faces=1, refine_landmarks=True
            )

        img_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        res = self._face_mesh.process(img_rgb)
        if not res.multi_face_landmarks:
            return None, None

        face = res.multi_face_landmarks[0]
        h, w, _ = frame.shape
        lms = np.array([[lm.x * w, lm.y * h, lm.z] for lm in face.landmark])

        # 1. Eye Data (EAR)
        ear_l = self._calculate_ear(lms, EYE_LEFT)
        ear_r = self._calculate_ear(lms, EYE_RIGHT)
        ear = (ear_l + ear_r) / 2.0

        # Blink detection
        now = time.time()
        blink_detected = False
        if ear < 0.2: # Threshold
            if self._last_blink_time == 0 or (now - self._last_blink_time > 0.1):
                self._last_blink_time = now
                blink_detected = True

        self._blink_buffer.append((now, ear))
        # Keep 5s of data
        self._blink_buffer = [b for b in self._blink_buffer if now - b[0] < 5.0]

        # blink_rate_bpm = blinks in 5s * 12
        blinks = 0
        # To count blinks, we look for transitions from open to closed.
        # For simplicity, we'll count how many times EAR dropped below 0.2 in the last 5s.
        # (Better way is to detect the actual blink event)
        # Since I'm implementing this now, I'll use a simple count of "blink events".
        # I'll actually track blink events in the buffer.
        
        # Let's refine the buffer to store events.
        # I'll just use a simple counter for now.
        
        # Re-computing blinks from buffer:
        count = 0
        for i in range(1, len(self._blink_buffer)):
            if self._blink_buffer[i-1][1] >= 0.2 and self._blink_buffer[i][1] < 0.2:
                count += 1
        
        blink_rate = count * 12
        irritation = 1.0 - (np.mean([b[1] for b in self._blink_buffer]) / 0.3) if self._blink_buffer else 0.0
        irritation = max(0.0, min(1.0, irritation))

        eye_data = {"blink_rate_bpm": float(blink_rate), "irritation_level": float(irritation)}

        # 2. Face Landmarks (Groups)
        face_lms = {
            "eye_left": [[float(lms[i][0]), float(lms[i][1]), float(lms[i][2])] for i in EYE_LEFT],
            "eye_right": [[float(lms[i][0]), float(lms[i][1]), float(lms[i][2])] for i in EYE_RIGHT],
            "oval": [[float(lms[i][0]), float(lms[i][1]), float(lms[i][2])] for i in FACE_OVAL],
            "lips": [[float(lms[i][0]), float(lms[i][1]), float(lms[i][2])] for i in LIPS_OUTER],
            "nose": [[float(lms[i][0]), float(lms[i][1]), float(lms[i][2])] for i in NOSE],
        }

        return eye_data, face_lms

    # ── Main loop ────────────────────────────────────────────────────────────

    def run(self):
        # 0. Register with coordinator
        if self.coordinator:
            self.coordinator.register_worker(self.camera_index, self)

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

        # Do NOT constrain WIDTH/HEIGHT here — forcing 640×480 via cap.set() downgrades
        # the shared AVFoundation capture session on macOS, which also degrades the
        # browser's getUserMedia stream (blurry display). Capture at native resolution
        # and downscale in software before YOLO inference instead.
        cap.set(cv2.CAP_PROP_FPS,        CAMERA_FPS)
        cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)  # low latency

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

                # Require at least 2 of the 4 core keypoints (shoulders + hips)
                # to be above confidence threshold before emitting.
                # Prevents ghost detections when nobody is in frame.
                KEY_KPTS = [5, 6, 11, 12]  # left_shoulder, right_shoulder, left_hip, right_hip
                MIN_CONF = 0.35
                MIN_VISIBLE = 2
                n_visible = sum(
                    1 for i in KEY_KPTS
                    if i < len(xyn) and (float(conf[i]) if conf is not None else 1.0) >= MIN_CONF
                )
                if n_visible < MIN_VISIBLE:
                    self.last_visibility = 0
                    continue
                
                self.last_visibility = n_visible / len(KEY_KPTS)

                landmarks = [
                    {
                        "x":          float(xyn[i][0]),
                        "y":          float(xyn[i][1]),
                        "z":          0.0,
                        "visibility": float(conf[i]) if conf is not None else 1.0,
                    }
                    for i in range(len(xyn))
                ]

                payload = {
                    "camera_index": self.camera_index,
                    "landmarks":    landmarks,
                    "timestamp":    time.time(),
                }

                # ── Face Mesh (Only if this worker is the designated best) ─────────────────
                if self.coordinator and self.coordinator.get_best_camera() == self.camera_index:
                    eye_data, face_lms = self._process_face(frame)
                    if eye_data:
                        payload["eye_data"] = eye_data
                    if face_lms:
                        payload["face_landmarks"] = face_lms

                self._emit(payload)

        finally:
            cap.release()
            self._emit({"type": "status", "camera_index": self.camera_index, "status": "stopped"})
            log.info(f"[CAM-{self.camera_index}] Stopped")


# ─── WebSocket handler ────────────────────────────────────────────────────────


async def handler(websocket):
    log.info(f"Client connected: {websocket.remote_address}")
    loop    = asyncio.get_event_loop()
    coordinator = FaceCoordinator()
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
                        w = CameraWorker(cam_idx, send, loop, coordinator=coordinator)
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
