# Changelog

## 0.1.4

- `styles.css` no longer paints the page: removed the `:root` background, `color-scheme: dark` (both made WKWebView opaque and blocked the native Playus background), and the `.playus-game-root` background. Games are transparent by default again; opt into a solid background per game via `BackgroundConfig`.

## 0.1.3

- `sound.play`/`sound.playUrl` accept an optional `semitones` pitch shift (playback-rate based) for melodies and sample variation.

## 0.1.0

- Initial partner release. Bridge protocol v3: `ready` → `hostReady` → `hostReadyAck` → `started` → `score` → `finished`.
- Runtime helpers: native bridge, sounds, haptics, tap-to-start overlay with i18n, touch hints, debug overlay, seeded random, URL params, gameplay delta clamping, Playus fonts and global styles.
- Custom game sounds via `sound.preloadUrl`/`sound.playUrl` (inherit the host mute state) and host-mute subscription via `sound.onEnabledChange` for games with their own audio engine.
- Engine containers for Phaser, Babylon.js, and Three/plain WebGL.
- Local host simulator with handshake validation and example games.
