#!/usr/bin/env bash
# Dev workflow for macOS 26 Tahoe.
# Tauri CLI can't run the .app bundle directly in dev mode, so we:
#   1. Start the Vite dev server (provides hot reload at localhost:5173)
#   2. Build the Rust binary (linker-wrapper.sh auto-creates PoseFix.app)
#   3. Open PoseFix.app — it connects to the running Vite server
#
# Usage: ./src-tauri/macos/dev-macos.sh
# Run from PoseWebApp/ root.

set -e
cd "$(dirname "$0")/../.." # PoseWebApp/

BUNDLE="src-tauri/target/debug/PoseFix.app"

echo "[dev-macos] Starting Vite dev server..."
bun run dev &
VITE_PID=$!

cleanup() {
    echo ""
    echo "[dev-macos] Stopping Vite (PID $VITE_PID)..."
    kill "$VITE_PID" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

echo "[dev-macos] Waiting for Vite to be ready..."
until curl -s http://localhost:5173 > /dev/null 2>&1; do sleep 0.5; done
echo "[dev-macos] Vite ready."

echo "[dev-macos] Building Rust binary..."
cd src-tauri
cargo build 2>&1
cd ..

if [[ ! -d "$BUNDLE" ]]; then
    echo "[dev-macos] ERROR: Bundle not found at $BUNDLE"
    echo "  Did the linker-wrapper.sh run? Check src-tauri/target/debug/"
    exit 1
fi

echo "[dev-macos] Opening $BUNDLE ..."
echo "[dev-macos] (Vite hot-reload still running — edit frontend files normally)"
open "$BUNDLE"

echo "[dev-macos] App launched. Press Ctrl+C to stop Vite."
wait "$VITE_PID"
