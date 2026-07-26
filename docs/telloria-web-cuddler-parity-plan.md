# Telloria Web 对齐 Cuddler 推进方案

> 状态：实现与 `web-v0.4.50` 增量同步完成，进入最终整合 PR 验收
> 调研日期：2026-07-26
> Telloria 基线：`3f18c06f`（`origin/main`，0 ahead / 0 behind）
> Cuddler 代码基线：`c79c1f50`（`origin/main`）
> Cuddler 线上视觉基线：`web-v0.4.50` / `4fea686b`

## 1. 目标与边界

目标是让 Telloria 网页端在信息架构、页面结构、交互行为、响应式布局和视觉密度上与 Cuddler 最新网页端保持 1:1 同步，同时保留 Telloria 自己的品牌、内容、模型调用和本地优先能力。

品牌边界：Cuddler 只作为结构和交互参考。Telloria 继续使用原站黑色背景、白色文字与 `#1cb495` 绿色强调色，不同步 Cuddler 的黄色或其他产品色板。

本轮明确不包含：

- Tauri 桌面壳、iOS、Android 或其他原生端；
- Cuddler 的数据库、计费、生产账号、管理后台数据和服务端密钥；
- 将 Telloria 变成指向 `cuddler.ai` 的 iframe、反向代理或换皮站；
- 直接复制会使 Telloria 依赖 Cuddler 私有 API 的实现。

这里的“1:1”定义为用户可观察契约一致，而不是源码逐行相同：

1. 相同入口、导航层级和页面去向；
2. 相同桌面/移动布局、卡片比例、密度与状态；
3. 相同关键交互（筛选、搜索、无限加载、创建入口、底部导航、抽屉）；
4. 相同空态、加载态、错误兜底和可访问语义；
5. Telloria 数据适配器提供等价字段，保持自身业务与 API 独立。

## 2. 全局调研结论

### 2.1 仓库与运行状态

- Telloria 远端 `main` 已是最新，但本机存在一套尚未提交的 Next.js/NextChat 迁移工程；旧静态站文件处于删除状态，新工程文件处于未跟踪状态。
- Cuddler 本机已安全 fast-forward 到 `c79c1f50`，并以 `web-v0.4.50` 发布点复核网页契约。
- Telloria 新工程可在本地运行，核心自定义页面包括 Explore、Scene、Scene Chat、Profile、Subscribe 和 Auth。
- Cuddler 本地页面依赖完整认证/API 环境，匿名本地预览会触发数据错误；调研因此同时采用最新源码和线上 `web-v0.4.50` 的真实渲染结果。

### 2.2 架构差异

| 维度     | Telloria 当前                              | Cuddler 最新                                            |
| -------- | ------------------------------------------ | ------------------------------------------------------- |
| 框架     | Next.js 14 + React Router + NextChat store | Next.js App Router + React Query                        |
| 数据     | 本地种子 + NextChat 模型/API               | 独立 API 服务 + PostgreSQL                              |
| 桌面导航 | Explore / Scene / Profile / Setting        | Explore / Games / Scene / Gacha / Activity / Profile    |
| 移动导航 | Home / Scene / Create / Profile / Chats    | Explore / Scene / Create / Inbox / Profile              |
| Explore  | 单一瀑布网格、旧 Banner、单标签字段        | For You / Trending / New、标签、Game Rooms、分区/无限流 |
| 卡片     | 图片 + 名称 + 描述 + 单一浏览量            | 3:4 封面、作者/标签/描述、聊天数/点赞数、负反馈         |
| 路由体量 | 16 个枚举路由，6 个 Telloria 定制页面      | 约 100 个页面（含约 33 个管理页）                       |
| 响应式   | 独立移动头部和底栏                         | 移动专用 Explore、统一底栏、全屏路由隐藏规则            |
| 无障碍   | 主要依赖视觉按钮                           | Skip link、语义 heading、aria-current、命名按钮         |

Telloria 已经复刻了较早一代 Cuddler 的轮廓，但两者不是同一源码分支。现状不能通过合并几个近期 commit 达成同步。

### 2.3 Cuddler 最新 main 相对线上版本的新增进展

- Lorebook 编辑页增加 entry title 与 9 类 entry type；
- Lorebook 增加读者可见 badge / viewer，并保留 private / hint / full 可见性；
- Lorebook 支持 Universe 归属，并可显式借用至多两个其他角色的 Lorebook；
- Lorebook 支持 AI 草拟条目，采纳后默认关闭，避免未审阅知识直接影响对话；
- 作者可从助手回复发起 Lore 修正，生成默认启用的 `correction` 条目；
- 聊天/私信/房间输入区固定到可视视口底部，适配移动软键盘；
- Explore 的 Challenge / Game Rooms Banner 修复窄屏换行；
- 布局与 Sidebar 增加与上述移动视口修复配套的 viewport 约束。

这些变化已按所属页面和本地数据契约完成同步，没有引入 Cuddler 私有 API、数据库或账号依赖。

## 3. 正反方辩论

### 正方：直接迁入 Cuddler `apps/web`

主张：

- 源码同源最接近字面意义的 1:1；
- 后续可以持续 cherry-pick Cuddler Web commit；
- 大量页面、组件和 i18n 不必在 Telloria 重写。

优势：

- 初始视觉差距收敛最快；
- 自动继承 Cuddler 的可访问性、移动端和测试资产；
- 减少逐组件比对遗漏。

代价与风险：

- Cuddler Web 直接依赖独立 API、NextAuth、Prisma schema、React Query、共享包和生产数据契约；
- 仅复制 `apps/web` 无法独立工作，继续复制 API/shared 又会越过“仅网页端”边界；
- 会替换 Telloria 的 NextChat 数据层、模型路由、本地存储和现有聊天能力；
- 两个产品会产生部署、鉴权、计费和隐私耦合。

### 反方：保留 Telloria 架构，按可观察契约移植

主张：

- 以 Cuddler 为设计系统和交互规范；
- 在 Telloria 内建立稳定的视图模型与页面契约；
- 页面逐层替换，业务调用仍由 Telloria 提供。

优势：

- 不破坏 Telloria 已可工作的模型/API、聊天记录和本地能力；
- 每个 PR 都可独立运行、回滚和做视觉验收；
- 可以明确区分“网页对齐”和“需要服务端能力”的功能；
- 后续同步可由差异清单和视觉回归驱动。

代价：

- 首次对齐工作量较大；
- Cuddler 新功能不能机械 cherry-pick；
- 需要维护一层 Telloria view-model adapter。

### 仲裁与推荐

采用反方方案：**保留 Telloria 架构，以 Cuddler 最新 Web 的用户可观察契约为唯一设计基线，分层移植。**

否决直接源码复制的核心理由不是开发速度，而是它会把网页同步扩大为后端、鉴权、数据库与计费迁移，违反本次“仅 Telloria 网页版本”的边界，并造成现有功能回归。

为降低长期维护成本，执行时增加三条约束：

1. 页面组件只消费统一的 Telloria Web view model，不直接写 Cuddler API 路径；
2. 每个阶段记录 Cuddler commit 基线，并以桌面 1440px、移动 390px 做视觉验收；
3. 新入口先提供可工作的本地等价能力；需要真实服务端能力时显示明确空态，不伪造成功。

## 4. 推进阶段与 PR 结构

### PR 1：Web 基线与 Explore / Shell 对齐

- 接纳并整理本机 Next.js Web 迁移，排除 `src-tauri`；
- 建立本方案、同步基线与验收口径；
- 对齐桌面 Sidebar 的入口、层级、底部资源区和聊天区；
- 对齐移动端 Header、feed chips、Game Rooms Banner、2 列 3:4 卡片和底部导航；
- 对齐桌面 Explore 的标签/搜索、For You / Trending / Discover 分区与卡片信息；
- 修复 `/explore` 与 `/` 双入口，消除当前空白页；
- 增加 Explore 行为测试。

验收：桌面与移动 Explore 的结构、密度、导航和核心交互与 Cuddler 基线一致；Telloria 品牌和种子内容保留。

### PR 2：Scene / Games / Gacha / Activity

- Scene feed、Scene detail 和 Remix 入口；
- Game Rooms hub 与房间入口；
- Gacha 展示、概率说明和 reveal 状态；
- Activity feed 与空态；
- 对应移动端页面头部和底栏状态。

验收：Sidebar 所有一级入口均为可用页面，不存在死链或“coming soon”替代主流程。

### PR 3：Character / Create / Chat / Lorebook

- Character detail、作者信息、Start Chat；
- Create launcher 与角色/导入入口；
- Chat 头部、消息卡、附件/语音/场景入口；
- 输入框按最新 Cuddler main 固定到 visual viewport；
- Lorebook 编辑结构与 9 类 entry type 对齐，但落到 Telloria 自身存储。

验收：从 Explore 卡片到聊天的主漏斗闭环；移动软键盘不遮挡输入框。

### PR 4：Profile / Inbox / Membership / Settings

- Profile 标签、内容卡、编辑资料；
- Inbox 的 Chats / Messages 信息架构；
- Membership / Credits 页面层级；
- Settings 并入 Profile cluster；
- 收藏、关注、通知等无服务端能力部分提供真实本地状态或明确空态。

### PR 5：公共页面、质量与持续同步

- Resources、Changelog、Download、Support、Privacy、Terms；
- i18n、键盘可达、Skip link、aria-current、错误/加载/空态；
- 视觉回归截图、路由 smoke、性能预算；
- `docs/cuddler-web-sync-log.md` 记录以后每次同步的 Cuddler commit 范围。

### 最终整合 PR：`web-v0.4.50` 收尾

- 将 5 个阶段合并为一个相对 `main` 的可独立验收变更；
- 补齐 Shared Worlds、AI Lorebook draft 与聊天回复 Lore 修正；
- 增加 GitHub Actions 类型、单测、构建和 bundle 预算检查；
- 将 Vercel 明确配置为 Next.js 原生构建，避免沿用旧静态站部署模式；
- 最终整合 PR 通过后合并，关闭被取代的堆叠 PR。

## 5. 决策记录

| 决策             | 推荐                                                                                                           |
| ---------------- | -------------------------------------------------------------------------------------------------------------- |
| 同步方式         | 契约移植，不复制 Cuddler 私有后端                                                                              |
| 品牌             | 保留 Telloria；结构和交互对齐 Cuddler                                                                          |
| 首个范围         | Shell + Explore + 路由兼容                                                                                     |
| 页面入口         | 新增 `/explore`，`/` 保持兼容并呈现同一页面                                                                    |
| 移动导航文案     | Explore / Scene / Create / Inbox / Profile                                                                     |
| 桌面标签         | All / Anime / Fantasy / Romance / Sci-Fi / Horror / Adventure / Comedy / Drama / Mystery / Action / Historical |
| 数据策略         | Telloria view model；本地数据提供 author/tags/chatCount/likeCount                                              |
| PR 策略          | 按上述 5 个可独立验收阶段拆分，默认 Draft PR                                                                   |
| Tauri            | 本轮排除，不提交 `src-tauri`                                                                                   |
| Cuddler 管理后台 | 不纳入用户侧 1:1；另行立项才迁移                                                                               |

## 6. 最终验收清单

- [x] 所有 Cuddler 用户侧一级入口在 Telloria 有等价可用入口；
- [x] 1440×900 与 390×844 两个基准视口无横向溢出；
- [x] Explore 卡片、网格、标签、搜索、加载和空态一致；
- [x] 移动底栏在 Chat/Room 等全屏页面按契约隐藏；
- [x] 键盘可完成一级导航、筛选、搜索和打开卡片；
- [x] 生产构建、类型检查、单测通过；
- [x] 每个 PR 都附基线、浏览器验收结果和差异说明；
- [x] Telloria 不依赖 Cuddler 生产 API、cookie、数据库或密钥。
