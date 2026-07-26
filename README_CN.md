# Telloria Web

Telloria 是一个本地优先的 AI 互动故事网页应用，把角色探索、动态场景对话、创作者主页、图像与语音交互以及多模型配置整合在同一套响应式界面中。

[English](./README.md)

## 当前网页能力

- 与 Cuddler 对齐的桌面端和移动端 Explore
- 角色与 Scene 内容发现
- 支持多种故事模式的 Scene Chat
- Character、Create、Chat 与 9 类 Lorebook 完整流程
- Profile、Inbox、Tale+ Membership、Credits 与网页设置
- Game Rooms、Gacha、Activity 与公共/法律页面
- OpenAI-compatible、Anthropic、Google 等模型提供方
- 对话和偏好默认保存在本机浏览器
- 支持 PWA、Docker 和 Vercel 部署

完整调研、正反方辩论和分阶段推进方案见
[`docs/telloria-web-cuddler-parity-plan.md`](./docs/telloria-web-cuddler-parity-plan.md)。
后续上游同步记录见
[`docs/cuddler-web-sync-log.md`](./docs/cuddler-web-sync-log.md)，验收证据见
[`docs/web-parity-qa.md`](./docs/web-parity-qa.md)。

## 本地开发

要求：

- Node.js 18+
- Corepack 与 Yarn 1.x

```bash
corepack yarn install
npm run dev
```

打开 [http://localhost:3000/explore](http://localhost:3000/explore)。

## 验证

```bash
npm run test:ci
npm run build
npm run check:web-budget
```

## 部署

项目产出标准 Next.js standalone build，可部署到任意 Node.js 环境。仓库内已包含 Docker 与 Vercel 配置。将 `.env.example` 复制为 `.env.local`，只填写当前部署实际需要的模型/API 凭据。

## 范围

当前分支仅针对 Telloria 网页端。桌面壳与原生移动端源码不会进入本次 Web 对齐工作。

## 来源说明

Telloria Web 保留了来自 MIT 许可 NextChat 项目的基础组件，详见 [LICENSE](./LICENSE)。
