# Credits and licensing

Bakehouse Blitz is an original game: its name, art, text, sounds and levels are made for this
project. Game mechanics follow the match-3 genre; no names, art or audio from other games are used.

## Audio

All sound effects and music are original and generated for this project by
`scripts/gen-sfx.ts` (a small sfxr-style synthesizer and step sequencer in `scripts/audio/`).
No samples or third-party recordings are used. Re-generate with `npm run sfx`; the output is
deterministic, so the committed files only change when the definitions change.

- `audio/sfx/*.wav` – 36 effects, mono 16-bit 22.05 kHz.
- `audio/music/map.wav` (saga map), `meadow.wav`, `canyon.wav`, `berry.wav` (level music for
  worlds 1–3) – seamless loops, mono 16-bit 16 kHz.

License: same as the project.

## Fonts

Fredoka by The Fredoka Project Authors, SIL Open Font License 1.1, bundled from the
`@fontsource/fredoka` npm package (latin subset, weights 400/600/700; see `src/shared/fonts.css`).

## Graphics

Everything is drawn in code, no image assets are downloaded:

- Treats, specials, blockers and ingredients: Pixi Graphics in `src/render/art/`, rasterized once
  into a texture atlas at startup.
- Effects particles and the hint hand: `src/render/fx/atlas.ts`.
- UI icons and map decorations: inline SVG (`src/game/ui/art.tsx`, `src/game/map/MapArt.tsx`).
- App icons and the title logo: SVG source in `scripts/icons/logo.ts`, rasterized to PNG by
  `npm run icons` (`@resvg/resvg-js`) into `public/icons/`.

License: same as the project.
