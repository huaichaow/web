# Sound effect credits

The clips in `sfx.bin` (this folder) are unmodified clips from four audio packs by
**Kenney** (www.kenney.nl), released under **Creative Commons Zero (CC0 1.0)**:
http://creativecommons.org/publicdomain/zero/1.0/ — each pack's bundled
`License.txt` states the CC0 license. Credit is not required; it is given here
with thanks.

| Pack | Page | Download |
| --- | --- | --- |
| Impact Sounds (1.0) | https://kenney.nl/assets/impact-sounds | `kenney_impact-sounds.zip` |
| Interface Sounds (1.0) | https://kenney.nl/assets/interface-sounds | `kenney_interface-sounds.zip` |
| RPG Audio | https://kenney.nl/assets/rpg-audio | `kenney_rpg-audio.zip` |
| Sci-Fi Sounds (1.0) | https://kenney.nl/assets/sci-fi-sounds | `kenney_sci-fi-sounds.zip` |

Each file is renamed after the game cue that plays it (see
`src/audio/sfxAssets.ts`). Since M25c the 30 clips ship as one file,
`sfx.bin` (a plain concatenation with a file table, `src/audio/audioBundle.ts`:
each clip's Ogg bytes unchanged); the individual source files are kept in the
repository under `assets/sfx/` and the bundle is rebuilt from them with
`npm run packs:committed`. Cues without a file, or whose file fails to load or
decode (e.g. no Ogg Vorbis support), use the procedural WebAudio recipes in
`src/audio/recipes.ts`.

| File | Pack | Original file |
| --- | --- | --- |
| `hitPhys.ogg` | Impact Sounds | `Audio/impactPunch_medium_000.ogg` |
| `hitMagic.ogg` | Impact Sounds | `Audio/impactGlass_light_001.ogg` |
| `hitTaken.ogg` | Impact Sounds | `Audio/impactPunch_heavy_001.ogg` |
| `swing.ogg` | RPG Audio | `Audio/knifeSlice.ogg` |
| `shot.ogg` | Sci-Fi Sounds | `Audio/laserSmall_000.ogg` |
| `towerShot.ogg` | Sci-Fi Sounds | `Audio/laserLarge_001.ogg` |
| `deathChamp.ogg` | Impact Sounds | `Audio/impactBell_heavy_001.ogg` |
| `deathMinion.ogg` | Impact Sounds | `Audio/impactSoft_medium_001.ogg` |
| `structureDown.ogg` | Sci-Fi Sounds | `Audio/lowFrequency_explosion_000.ogg` |
| `cast_heal.ogg` | Interface Sounds | `Audio/maximize_003.ogg` |
| `blink.ogg` | Sci-Fi Sounds | `Audio/laserSmall_002.ogg` |
| `zoneWarn.ogg` | Interface Sounds | `Audio/bong_001.ogg` |
| `boom.ogg` | Sci-Fi Sounds | `Audio/explosionCrunch_000.ogg` |
| `stun.ogg` | Impact Sounds | `Audio/impactMetal_light_002.ogg` |
| `root.ogg` | Impact Sounds | `Audio/impactWood_medium_001.ogg` |
| `shield.ogg` | Sci-Fi Sounds | `Audio/forceField_003.ogg` |
| `heal.ogg` | Interface Sounds | `Audio/maximize_006.ogg` |
| `dash.ogg` | RPG Audio | `Audio/cloth2.ogg` |
| `gold.ogg` | RPG Audio | `Audio/handleCoins.ogg` |
| `levelUp.ogg` | Interface Sounds | `Audio/confirmation_002.ogg` |
| `skillUp.ogg` | Interface Sounds | `Audio/select_003.ogg` |
| `buy.ogg` | RPG Audio | `Audio/handleCoins2.ogg` |
| `sell.ogg` | Interface Sounds | `Audio/drop_002.ogg` |
| `recallStart.ogg` | Sci-Fi Sounds | `Audio/spaceEngineLow_000.ogg` |
| `recallDone.ogg` | Interface Sounds | `Audio/maximize_008.ogg` |
| `respawn.ogg` | Interface Sounds | `Audio/open_002.ogg` |
| `fail.ogg` | Interface Sounds | `Audio/error_004.ogg` |
| `wave.ogg` | Interface Sounds | `Audio/pluck_002.ogg` |
| `victory.ogg` | Interface Sounds | `Audio/confirmation_004.ogg` |
| `defeat.ogg` | Interface Sounds | `Audio/error_007.ogg` |
