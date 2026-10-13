# Model, texture and item icon credits

Every 3D model in this folder, every item icon in `public/icons/items/` and
the ground texture in `public/textures/` is derived from assets released
under **Creative Commons Zero (CC0 1.0)**:
http://creativecommons.org/publicdomain/zero/1.0/ — each pack's bundled
`LICENSE.txt` states the CC0 license. Credit is not required; it is given
here with thanks.

| Pack | Author | Source | License |
| --- | --- | --- | --- |
| KayKit Character Pack: Adventurers (1.0) | Kay Lousberg (www.kaylousberg.com) | https://github.com/KayKit-Game-Assets/KayKit-Character-Pack-Adventures-1.0 | CC0 1.0 (`LICENSE.txt`) |
| KayKit Character Pack: Skeletons (1.0) | Kay Lousberg | https://github.com/KayKit-Game-Assets/KayKit-Character-Pack-Skeletons-1.0 | CC0 1.0 (`LICENSE.txt`) |
| KayKit Dungeon Remastered (1.0) | Kay Lousberg | https://github.com/KayKit-Game-Assets/KayKit-Dungeon-Remastered-1.0 | CC0 1.0 (`Assets/LICENSE.txt`) |
| KayKit Medieval Hexagon Pack (1.0) | Kay Lousberg | https://github.com/KayKit-Game-Assets/KayKit-Medieval-Hexagon-Pack-1.0 | CC0 1.0 (`LICENSE.txt`) |
| KayKit Forest Nature Pack (1.0, free tier) | Kay Lousberg | https://kaylousberg.itch.io/kaykit-forest | CC0 1.0 (`License.txt`) |
| ambientCG Grass001 (1K-JPG) | ambientCG (Lennart Demes) | https://ambientcg.com/view?id=Grass001 | CC0 1.0 (https://docs.ambientcg.com/license/) |

The files are built by `npm run models` (`tools/models/build.ts`, driven by
`tools/models/manifest.ts`) from the packs extracted outside the repo. The
build prunes unused meshes, keeps only the listed animation clips, joins the
skinned parts, simplifies the lane minions and the map's trees / bushes, recolors some palette textures
and converts textures to WebP. Item icons are rendered from KayKit props by
`tools/models/iconRaster.ts`.

## Models

| File | Role | Pack | Source file(s) | Changes |
| --- | --- | --- | --- | --- |
| `champ_marksman.glb` | Marksman | Adventurers | `Characters/gltf/Rogue.glb` | 2H crossbow only |
| `champ_fighter.glb` | Fighter | Adventurers | `Characters/gltf/Barbarian.glb` | 2H axe only |
| `champ_mage.glb` | Mage | Adventurers | `Characters/gltf/Mage.glb` | staff only |
| `champ_tank.glb` | Tank | Adventurers | `Characters/gltf/Knight.glb` | 1H sword + badge shield |
| `champ_support.glb` | Support | Adventurers | `Characters/gltf/Rogue_Hooded.glb` + `Assets/gltf/staff.gltf` | greens recolored blue, Mage staff attached |
| `champ_duelist.glb` | Duelist (Blademaster, M11) | Adventurers | `Characters/gltf/Knight.glb` | 2H sword only, helmet removed, steel greys tinted crimson |
| `champ_assassin.glb` | Assassin (Shade, M11) | Adventurers | `Characters/gltf/Rogue_Hooded.glb` | knife in each hand, greens recolored purple |
| `champ_pyro.glb` | Pyro (Ember, M11) | Adventurers | `Characters/gltf/Mage.glb` | wand + open spellbook, violets recolored flame orange / red |
| `champ_ranger.glb` | Ranger (Hunter, M11) | Adventurers | `Characters/gltf/Rogue.glb` + `Assets/gltf/quiver.gltf` | 1H crossbow, quiver on the back, greens recolored amber |
| `champ_paladin.glb` | Paladin (M11) | Adventurers | `Characters/gltf/Barbarian.glb` + `Assets/gltf/sword_1handed.gltf` + `Assets/gltf/shield_round_color.gltf` | hat and axes removed, blues recolored gold, sword / shield steel gilded |
| `champ_ezreal.glb` | Ezreal (M13c, KayKit fallback) | Adventurers | `Characters/gltf/Rogue.glb` | 2H crossbow only, greens recolored deep blue, steel gilded |
| `monster_big.glb` | Big jungle monster | Skeletons | `Characters/gltf/Skeleton_Warrior.glb` + `Assets/gltf/Skeleton_Axe.gltf` | moss-green recolor, helmet removed |
| `monster_small.glb` | Small jungle monster | Skeletons | `Characters/gltf/Skeleton_Minion.glb` | ash-purple recolor, cloak removed |
| `minion_melee.glb` | Melee minion | Skeletons | `Skeleton_Minion.glb` + `Skeleton_Blade.gltf` + `Skeleton_Shield_Small_A.gltf` | simplified, one primitive |
| `minion_caster.glb` | Caster minion | Skeletons | `Skeleton_Mage.glb` + `Skeleton_Staff.gltf` | simplified, one primitive |
| `minion_siege.glb` | Siege minion | Skeletons | `Skeleton_Rogue.glb` + `Skeleton_Crossbow.gltf` | simplified, one primitive |
| `minion_super.glb` | Super minion | Skeletons | `Skeleton_Warrior.glb` + `Skeleton_Axe.gltf` + `Skeleton_Shield_Large_A.gltf` | simplified, one primitive |
| `tower.glb` | Tower (`tower_blue`, `tower_red`) | Medieval Hexagon | `buildings/{blue,red}/building_tower_A_*.gltf` | — |
| `inhibitor.glb` | Inhibitor plinth | Dungeon Remastered | `floor_tile_large.gltf.glb` | — |
| `nexus.glb` | Nexus plinth (`nexus_blue`, `nexus_red`) | Medieval Hexagon | `buildings/{blue,red}/building_tower_base_*.gltf` | — |
| `rubble.glb` | Destroyed structure | Medieval Hexagon | `buildings/neutral/building_destroyed.gltf` | — |
| `props.glb` | Map props (12 nodes, M10i) | Forest Nature Pack | Forest `Assets/gltf/` `Rock_1_G`, `Rock_3_K`, `Rock_2_D`, `Rock_1_E`, `Tree_1_A`, `Tree_4_B`, `Tree_3_B`, `Tree_1_B`, `Tree_3_A`, `Bush_1_C`, `Bush_4_E`, `Bush_3_B` (`*_Color1.gltf`) | trees and bushes simplified (meshopt) |

## Item icons (`public/icons/items/*.png`, 64 px)

| Item | Pack | Source prop |
| --- | --- | --- |
| `long_sword` | Adventurers | `sword_1handed` |
| `ruby` | Dungeon Remastered | `bottle_A_green` (recolored red) |
| `cloth` | Adventurers | `shield_round` |
| `mantle` | Adventurers | `shield_badge_color` |
| `dagger` | Adventurers | `dagger` |
| `boots` | Adventurers | `Rogue.glb` left leg (boot) |
| `vamp` | Skeletons | `Skeleton_Blade` (recolored red) |
| `frost` | Adventurers | `axe_1handed` (recolored ice blue) |
| `spellblade` | Adventurers | `sword_2handed_color` |
| `bramble` | Adventurers | `shield_spikes` |
| `tome` | Adventurers | `spellbook_closed` |
| `codex` | Adventurers | `spellbook_open` |
| `staff` | Adventurers | `staff` |

## Textures

| File | Source | Changes |
| --- | --- | --- |
| `public/textures/ground_noise.webp` | ambientCG Grass001, `Grass001_1K-JPG_Color.jpg` | grayscale, normalized, 256 px |
