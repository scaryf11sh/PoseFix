#!/bin/bash
# Run this after 'cargo build' if bun tauri dev doesn't auto-sign the binary.
# Required for macOS permission dialogs (Bluetooth, Camera) to appear in dev mode.
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BINARY="$SCRIPT_DIR/../target/debug/app"
ENTITLEMENTS="$SCRIPT_DIR/entitlements.plist"

if [ ! -f "$BINARY" ]; then
  echo "Binary not found at $BINARY — run 'cargo build' first from src-tauri/"
  exit 1
fi

codesign --force --sign - \
  --identifier "com.posefix.dev" \
  --entitlements "$ENTITLEMENTS" \
  "$BINARY"

echo "Signed: $(codesign -dv "$BINARY" 2>&1 | grep 'Identifier=')"
