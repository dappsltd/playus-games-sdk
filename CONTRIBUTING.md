# Contributing Or Delivering A Game

Playus accepts games as plain source code or as a pre-built static bundle — sent privately or as a PR in this repo.

## Source Or Bundle

We prefer plain source code. It lets us review the game properly, apply performance tuning with our own tools, and ship urgent fixes ourselves instead of waiting for a publisher update.

If you cannot share source (copyright or other reasons), a built bundle is fine — the SDK exists exactly so a pre-built bundle works out of the box in the Playus apps.

## Partner Flow

1. Build your game in your own repository.
2. Install and use `@playus.club/games-sdk`.
3. If you are porting an existing game, use `docs/partner-game-porting-template.md` to remove app-shell behavior and document Playus-specific decisions.
4. Build a static production bundle with relative asset paths (Vite: `base: './'`).
5. Test the built bundle in the local Playus host simulator (copy it into `public/<game-id>/`, see the README).
6. Send Playus the bundle (or your source) plus the required game metadata from the submission checklist.

## What Happens After Acceptance

Accepted games are built by Playus (when delivered as source), zipped, signed, and hosted. Bundles may be cached inside the apps and are publicly accessible and downloadable — always in built form, never as raw source. Do not put anything into your game that you would not ship publicly.

## Source PR Flow

If you are contributing source directly, create a folder under `games/<your-game-id>` and start from one of the examples.

## What We Review

- The game uses the real Playus SDK bridge.
- `ready`, `hostReadyAck`, `started`, `score`, and `finished` happen in the right order.
- Live score updates are meaningful for a leaderboard and are not sent every frame.
- The final score is a single exact number in the real score unit.
- Required assets are local or bundled and load before `ready()`.
- In-game text uses `lang` from the URL hash.
- Gameplay-affecting randomness is seeded when fairness depends on it.
- The framework/runtime choice is lean enough for mobile WebViews.

## What Not To Include

- Login, accounts, analytics, ads, payments, or backend calls required for gameplay.
- A custom start screen, menu, pause screen, leaderboard, upload flow, or final result screen.
- Required remote runtime data fetches.
- Heavy engine exports unless Playus agreed to the tradeoff first.
- Obfuscated or minified source code when submitting source.
- Signing keys, deployment credentials, or Playus backend assumptions.

Playus may still request bundle, performance, metadata, or scoring changes before accepting a game.
