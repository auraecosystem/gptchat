# Telloria Web 对齐验收记录

## 参考环境

- 日期：2026-07-26
- 桌面视口：1440×900
- 移动视口：390×844
- Cuddler 代码基线：`c79c1f50`（`web-v0.4.50`）
- Telloria 验收分支：`codex/web-parity-v050-closeout`

## 浏览器验收

| 页面/流程            | 桌面 | 移动 | 交互检查                                          |
| -------------------- | ---: | ---: | ------------------------------------------------- |
| Explore / Shell      | 通过 | 通过 | feed、标签、搜索、Game Rooms、卡片                |
| Scene                | 通过 | 通过 | tab、类型筛选、搜索、Overlay、Remix               |
| Game Rooms           | 通过 | 通过 | 启动、继续、离开、local persistence               |
| Gacha                | 通过 | 通过 | daily ticket、odds、reveal、album                 |
| Activity             | 通过 | 通过 | All / Following / Mentions、read state            |
| Character            | 通过 | 通过 | Follow、creator、Start Chat、Lorebook             |
| Create               | 通过 | 通过 | character、scene、import、blank chat              |
| Chat                 | 通过 | 通过 | message、smart、image、voice、visual viewport、Lore fix |
| Lorebook             | 通过 | 通过 | viewer、visibility、CRUD、9 types、Shared Worlds、AI draft |
| Profile              | 通过 | 通过 | tabs、asset handoff、edit dialog                  |
| Inbox                | 通过 | 通过 | Chats / Messages、search、composer                |
| Membership / Credits | 通过 | 通过 | plan、limits、models、preview balance             |
| Settings             | 通过 | 通过 | language、switches、persistence、advanced handoff |
| Public / Legal       | 通过 | 通过 | resources、download、support、privacy、terms      |

所有已检查路由的 `documentElement.scrollWidth` 均等于基准视口宽度。Chat 关闭设置抽屉时为 390px；打开抽屉后仍为 390px。移动 Chat 不渲染全局底栏，composer 底部与 visual viewport 对齐。

品牌色板验收：Explore、Scene、Membership 和移动底部导航均使用 Telloria 原站 `#1cb495` 绿色强调色；未发现旧黄色强调色残留。内容图片可保留自身色彩。

## 可访问性

- 全局 Skip to main content；
- 一级导航使用 `aria-current="page"`；
- feed 和 Inbox tabs 使用 `role="tab"` / `aria-selected`；
- Gacha、Profile、Lorebook 使用命名 dialog；
- 设置开关使用 `role="switch"` / `aria-checked`；
- 搜索、导入、聊天和 Lorebook 表单具有 label、placeholder 或可访问名称；
- 全局 `:focus-visible` 保持可见焦点。

## 生产 bundle 预算

执行：

```bash
npm run build
npm run check:web-budget
```

预算：

- `.next/static` JavaScript 总量 ≤ 20 MiB；
- 最大单一生产 JavaScript chunk ≤ 4 MiB；
- CSS 总量 ≤ 1 MiB。

2026-07-26 生产构建实测：JavaScript 总量 7.37 MiB，最大 chunk 1.31 MiB，CSS 总量 0.29 MiB，三项均通过。standalone 与 `VERCEL=1` 的 Next.js 原生构建均成功。

阈值可通过 `TELLORIA_MAX_JS_BYTES`、`TELLORIA_MAX_CHUNK_BYTES` 和 `TELLORIA_MAX_CSS_BYTES` 收紧。预算检测只接受生产构建输出，缺少 `.next` 时直接失败。

自动验证同时包含 TypeScript 检查和 23 项契约测试；GitHub Actions 在 PR 与 `main` push 上执行类型、单测、构建和 bundle 预算四道守卫。

## Core Web Vitals 说明

当前 Codex 环境未配置 `chrome-devtools-mcp`，因此本轮没有伪造 LCP、CLS、INP、FCP 或 TBT 数字。配置该 MCP 后，应在生产构建和真实缓存策略下补跑 trace。代码层已确认：

- 页面级组件采用动态 import；
- 主要图片容器预留固定 aspect ratio / 高度，降低布局位移；
- 全屏页面限制文档宽度，移动抽屉关闭时不参与布局宽度；
- 远程 Unsplash 图片仍是 LCP 波动来源，生产内容接入后应由 Telloria CDN 生成明确尺寸的 WebP/AVIF。

## 已知非阻断警告

- `rt-client` 的 `bufferutil` / `utf-8-validate` 是可选原生依赖；
- 既有 `chat.module.scss` 存在 autoprefixer `end` 提示；
- 父目录 ESLint 配置缺少 `next/core-web-vitals`；
- Browserslist 数据需要独立维护更新；
- SSR 阶段的 localStorage 提示来自现有 NextChat 持久化层。
