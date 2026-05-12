#!/usr/bin/env bash
# Linker wrapper: calls cc, re-signs the binary, then builds a .app bundle.
# Required on macOS 26 Tahoe: TCC crashes raw binaries that access privacy APIs
# (Bluetooth, Camera) without a proper .app bundle + Info.plist. Running from
# the bundle makes TCC show the permission dialog instead of crashing the app.

cc "$@"
EXIT=$?
[[ $EXIT -ne 0 ]] && exit $EXIT

# Parse -o <output> from linker args
while [[ $# -gt 0 ]]; do
    [[ "$1" == "-o" ]] && { OUT="$2"; break; }
    shift
done

# Only process the main app binary — skip build scripts, dylibs, rlibs, etc.
# Cargo names the crate binary "app" (or "app-<hash>" in deps/). Other crate
# build scripts (e.g. swift-rs build-script-test-build) must NOT get the shim.
OUTNAME="$(basename "$OUT")"
if [[ -n "$OUT" ]] && [[ "$OUTNAME" == app || "$OUTNAME" == app-* ]] && file "$OUT" 2>/dev/null | grep -q "Mach-O.*executable"; then
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

    # Step 1: build .app bundle
    # $OUT is target/debug/deps/app-<hash>; go up two levels to get target/debug/
    TARGET_DEBUG="$(cd "$(dirname "$OUT")/.." && pwd)"
    BUNDLE="$TARGET_DEBUG/PoseFix.app/Contents"

    mkdir -p "$BUNDLE/MacOS"

    # Copy Mach-O into bundle BEFORE signing (sign-in-place)
    cp -f "$OUT" "$BUNDLE/MacOS/PoseFix"

    # Copy the bundle Info.plist (has CFBundleExecutable, CFBundlePackageType, etc.)
    cp -f "$SCRIPT_DIR/bundle-Info.plist" "$BUNDLE/Info.plist"

    # Sign the full bundle
    codesign --force --deep --sign - \
        --identifier "com.posefix.dev" \
        --entitlements "$SCRIPT_DIR/entitlements.plist" \
        "$TARGET_DEBUG/PoseFix.app" 2>/dev/null || true

    # Step 2: replace the linker output with a shell shim.
    # Cargo copies $OUT → target/debug/app. bun tauri dev then runs target/debug/app.
    # On macOS 26 Tahoe TCC crashes raw binaries accessing privacy APIs — must run
    # from .app bundle. The shim exec's the bundle binary so the process path is
    # PoseFix.app/Contents/MacOS/PoseFix → TCC sees it as a bundle → shows dialogs.
    cat > "$OUT" <<'SHIM'
#!/usr/bin/env bash
DIR="$(cd "$(dirname "$0")" && pwd)"
exec "$DIR/PoseFix.app/Contents/MacOS/PoseFix" "$@"
SHIM
    chmod +x "$OUT"
fi
exit 0
