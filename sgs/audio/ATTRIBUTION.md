# 音频素材来源与版权说明

本目录下的 `.ogg` 文件来自开源项目 **QSanguosha-v2**（Mogara）的 `audio/` 目录：

- 仓库：https://github.com/Mogara/QSanguosha-v2
- 获取方式：`npm run fetch-audio`（脚本 `scripts/fetch-audio.ts`，按 `src/audio/manifest.ts` 的清单从
  `https://raw.githubusercontent.com/Mogara/QSanguosha-v2/master/audio/` 下载，已存在的文件跳过）
- 获取日期：2026-09-06（标准包）、2026-09-07（军争篇与扩展武将）

## 许可

- QSanguosha-v2 以 **GPLv3** 发布，并附加 **Mogara Commercial Forbidden Restriction（禁止商用）**。
- 语音、音效本身为《三国杀》官方素材，**版权归游卡桌游（Yoka Games）所有**，并非自由许可内容。
- 因此本项目**仅供个人学习与非商业用途**，不得将这些音频用于任何商业发布。

## 目录结构

| 目录 | 内容 | 对应游戏内 id |
|---|---|---|
| `card/male/`, `card/female/` | 基本牌 / 锦囊牌语音（男声 / 女声） | `CARD_VOICE`（如 `sha` → `slash.ogg`） |
| `card/common/` | 装备穿戴音效（武器 / 防具 / 坐骑） | `EQUIP_USE_SFX` |
| `equip/` | 装备技能触发音效 | `EQUIP_SKILL_SFX`（`eq:<cardName>`） |
| `skill/` | 武将技能语音，`<name><n>.ogg` 多个变体随机播放；部分扩展技能只有不带序号的 `<name>.ogg`（清单 `plain: true`） | `SKILL_VOICE`（注意 `tieqi` → `tieji`） |
| `death/` | 武将阵亡台词（换皮 SP 武将指向原武将文件；蔡文姬源库无台词） | `DEATH_VOICE`（落盘文件名 = 武将 id） |
| `system/` | 受伤 / 失去体力 / 按钮 / 阶段切换 / 胜负 / 背景音乐 | `SYSTEM_SFX`、`BGM_PATH` |

## 项目自带语音（MiniMax 语音合成）

以下 `.mp3` 文件不来自 QSanguosha-v2，而是由 [MiniMax](https://platform.minimaxi.com/) 语音合成接口（T2A v2，模型 `speech-2.8-hd`，
音色 `Chinese_gravelly_storyteller_nv1`）按台词生成，脚本 `scripts/gen-voice.ts`（`npm run gen-voice`，需环境变量 `MINIMAX_API_KEY`），
清单中以 `SKILL_VOICE[*].local` / `LOCAL_DEATH_VOICE` 标记，不进入 `fetch-audio` 的下载清单：

| 文件 | 武将 / 技能 | 台词 |
|---|---|---|
| `skill/chuandao1.mp3`、`skill/chuandao2.mp3` | 师者【传道】 | 传道授业，吾之责也。／ 学而时习，不亦说乎？ |
| `skill/shouye1.mp3`、`skill/shouye2.mp3` | 师者【授业】 | 有教无类，何分敌我？／ 汝且试之，吾为汝师。 |
| `skill/jiehuo1.mp3`、`skill/jiehuo2.mp3` | 师者【解惑】 | 惑而不从师，其为惑也终不解矣。／ 此问，吾有以教汝。 |
| `death/shizhe.mp3` | 师者阵亡 | 教无止境，吾道不孤…… |

生成日期：2026-09-10。台词文本由项目作者撰写；合成音频的使用须遵守 MiniMax 服务条款。

说明：源库中部分文件虽以 `.ogg` 命名，实际容器为 WAV 或 MP3；浏览器的 `decodeAudioData` 会按内容识别，
本项目不依赖扩展名。
