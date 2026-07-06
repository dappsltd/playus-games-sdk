# Playus Sound Previews

These files are raw previews of the shared Playus game sounds.

They are committed to this repository so game developers can listen to the available sound palette while making design decisions. They are not imported by the SDK runtime and are not shipped in the npm package.

Use the filename without `.mp3` as the SDK sound id:

```ts
import { sound } from '@playus.club/games-sdk';

await sound.preload(['pop-multi-down']);
sound.play('pop-multi-down', { volume: 0.6 });
```

The Playus native apps provide these sounds at runtime. Browser/dev builds use the SDK fallback URLs.
