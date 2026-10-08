# 图片素材来源与版权说明

本目录下的图片按 `src/images/manifest.ts` 的清单由 `npm run fetch-images`（脚本 `scripts/fetch-images.ts`）下载，
落盘文件名一律使用游戏内 id（如 `general/xuchu.jpg`、`card/qinglong.png`），与源库文件名无关。

- 获取日期：2026-09-07

## 来源

| 目录 | 内容 | 来源仓库 | 源路径 | 对应清单常量 |
|---|---|---|---|---|
| `general/` | 武将立绘（350×464），含标准 25 将、风火林山 32 将、SP 14 将 | [libccy/noname](https://github.com/libccy/noname)（无名杀） | `image/character/<id>.jpg`（源库拼写不同者见清单注释：许褚 `xuzhu`、卧龙诸葛亮 `sp_zhugeliang`、袁绍 `re_yuanshao`、颜良文丑 `yanwen`、鲁肃 `re_lusu`、张昭张纮 `zhangzhang`、SP关羽 `re_guanyu`） | `GENERAL_PORTRAIT_SRC` |
| `card/` | 牌面（200×290，不含花色点数，由游戏叠加），含标准 32 种 + 军争篇 11 种 | [Mogara/QSanguosha-v2](https://github.com/Mogara/QSanguosha-v2) | `image/big-card/<en>.png` | `CARD_FACE_SRC` |
| `equip/` | 装备条（149×25） | Mogara/QSanguosha-v2 | `image/equips/<Name>.png` | `EQUIP_STRIP_SRC` |
| `role/` | 身份图标（主公 / 忠臣 / 反贼 / 内奸 / 未知） | Mogara/QSanguosha-v2 | `image/system/roles/*.png` | `roleIcon()` |
| `magatama/` | 体力勾玉（空 / 红 / 黄 / 绿） | Mogara/QSanguosha-v2 | `image/system/magatamas/{0,1,3,5}.png` | `magatama()` |
| `kingdom/` | 势力图标（魏 / 蜀 / 吴 / 群） | Mogara/QSanguosha-v2 | `image/kingdom/icon/*.png` | `kingdomIcon()` |
| `system/` | 牌背、牌桌背景 | Mogara/QSanguosha-v2 | `image/system/card-back.png`、`image/system/backdrop/default.jpg` | `SYSTEM_IMAGES` |

项目自带、不由脚本下载的素材（登记在 `LOCAL_GENERAL_PORTRAITS` / `LOCAL_SYSTEM_IMAGES`）：`general/chaoji.jpg`（自定义武将“超级”立绘，由项目作者提供）、`general/shizhe.jpg`（自定义武将“师者”立绘，AI 生成、由项目作者提供）、`kingdom/hua.png`（自定义势力“华”图标，程序生成的“华”字）。

## 许可

- 无名杀（libccy/noname）以 **GPLv3** 发布。
- QSanguosha-v2 以 **GPLv3** 发布，并附加 **Mogara Commercial Forbidden Restriction（禁止商用）**。
- 以上图片均为《三国杀》官方美术素材，**版权归游卡桌游（Yoka Games）所有**，并非自由许可内容。
- 因此本项目**仅供个人学习与非商业用途**，不得将这些图片用于任何商业发布。

## 运行时行为

游戏在图片未加载完成或文件缺失时会回退到原有的程序化绘制（色块 + 文字），
缺失文件只在控制台 `warn` 一次；`tests/images/manifest.test.ts` 会校验清单与游戏数据、磁盘文件三者一致。
