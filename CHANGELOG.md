# Changelog

## 0.1.0

- Initial partner release. Bridge protocol v3: `ready` → `hostReady` → `hostReadyAck` → `started` → `score` → `finished`.
- Runtime helpers: native bridge, sounds, haptics, tap-to-start overlay with i18n, touch hints, debug overlay, seeded random, URL params, gameplay delta clamping, Playus fonts and global styles.
- Custom game sounds via `sound.preloadUrl`/`sound.playUrl` (inherit the host mute state) and host-mute subscription via `sound.onEnabledChange` for games with their own audio engine.
- Engine containers for Phaser, Babylon.js, and Three/plain WebGL.
- Local host simulator with handshake validation and example games.
