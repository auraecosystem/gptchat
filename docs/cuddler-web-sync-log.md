# Cuddler Web 同步日志

本日志是 Telloria Web 后续跟进 Cuddler 用户侧变化的单一记录。同步的是用户可观察契约，不复制 Cuddler 私有 API、账号、数据库、计费或部署实现。

Telloria 品牌色板固定为黑色背景、白色文字与 `#1cb495` 绿色强调色。上游色彩变化不属于自动同步范围。

## 2026-07-26：全量对齐基线

### 上游范围

- Telloria 起点：`3f18c06f`
- Cuddler 起点：`bf7cd613`（线上 `web-v0.4.49`）
- Cuddler 最新：`c79c1f50`（线上 `web-v0.4.50`）
- 纳入的关键 Cuddler commit：
  - `e445c237`：Explore Game Rooms Banner 窄屏换行；
  - `a154d028`：Chat composer 固定到 visual viewport；
  - `b62ca5c7`：Lorebook trust tier 与 i18n；
  - `c2d9f1c6`：Lorebook entry title 与 9 类 entry type；
  - `ea72092b`：读者可见 Lorebook badge / viewer；
  - `ea5b50f2`：Universe 共享与最多两个外部角色 Lorebook 借用；
  - `27e6f611`：AI 草拟 Lorebook 条目与从助手回复创建 Lore 修正。

### Telloria 堆叠 PR

1. PR #1：Web 基线、Shell、Explore 与调研裁决；
2. PR #2：Scene、Game Rooms、Gacha、Activity；
3. PR #3：Character、Create、Chat、Lorebook；
4. PR #4：Profile、Inbox、Membership、Credits、Settings；
5. PR #5：公共页面、可访问性、质量守卫和同步记录。

最终收尾采用一个相对 `main` 的整合 PR 验收全部阶段。整合 PR 通过后，上述堆叠 PR 关闭为 superseded，避免旧 Vercel 失败状态阻塞最终发布。

### 路由契约

用户侧一级入口均已建立：

- `/explore`
- `/games`
- `/scene`
- `/gacha`
- `/feed`
- `/profile`
- `/inbox`
- `/membership`
- `/credits`
- `/settings`

主漏斗和公共入口：

- `/character/:id`
- `/character/:id/lorebook`
- `/scene-chat/:id`
- `/new-chat`
- `/resources`
- `/changelog`
- `/download`
- `/support`
- `/privacy`
- `/terms`

### 数据边界

- Cuddler API、cookie、NextAuth、数据库、支付和密钥：未接入；
- Telloria 模型/API、NextChat store、本地聊天能力：保留；
- Lorebook、房间、抽卡、Profile 编辑、偏好和预览积分：浏览器本地状态；
- Shared Worlds、AI Lorebook draft 和聊天回复 Lore 修正：浏览器本地等价能力；
- AI 草拟条目采纳后默认关闭；聊天回复生成的 `correction` 默认启用；
- 预览积分操作明确标注“不发生支付”。

## 后续同步流程

1. 在 Cuddler 仓库执行 `git pull --ff-only`，记录新 HEAD；
2. 查看上次基线到新 HEAD 的 `apps/web` 和用户契约相关 diff；
3. 排除 API、管理后台、原生端和运营数据；
4. 排除 Cuddler 品牌色板变化，将可观察结构和交互映射到 Telloria route/view-model/component；
5. 验证 1440×900、390×844、键盘导航、类型、单测、生产构建和 bundle 预算；
6. 更新本日志中的新基线、差异与有意排除项。
