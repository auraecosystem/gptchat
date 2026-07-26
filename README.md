# Telloria Web

Telloria is a local-first AI interactive storytelling web app. It combines character discovery, living scene conversations, creator profiles, image and voice interactions, and configurable model providers in one responsive interface.

[简体中文](./README_CN.md)

## Current web surface

- Cuddler-aligned Explore experience for desktop and mobile
- Character and scene discovery
- Scene conversations with multiple story modes
- Character, Create, Chat and nine-type Lorebook workflow
- Profile, Inbox, Tale+ membership, Credits and Web settings
- Game Rooms, Gacha, Activity and public/legal pages
- OpenAI-compatible, Anthropic, Google and other model providers
- Local browser storage for conversations and preferences
- PWA, Docker and Vercel deployment support

The active Cuddler parity plan and architecture decision record is in
[`docs/telloria-web-cuddler-parity-plan.md`](./docs/telloria-web-cuddler-parity-plan.md).
Ongoing upstream changes are recorded in
[`docs/cuddler-web-sync-log.md`](./docs/cuddler-web-sync-log.md), with QA evidence in
[`docs/web-parity-qa.md`](./docs/web-parity-qa.md).

## Local development

Requirements:

- Node.js 18+
- Corepack with Yarn 1.x

```bash
corepack yarn install
npm run dev
```

Open [http://localhost:3000/explore](http://localhost:3000/explore).

## Validation

```bash
npm run test:ci
npm run build
npm run check:web-budget
```

## Deployment

The standalone Next.js build can run on any Node.js host. Docker and Vercel configurations are included in the repository. Copy `.env.example` to `.env.local` and provide only the model/API credentials required by your deployment.

## Scope

This repository branch targets the Telloria web app. Desktop shell and native mobile sources are intentionally excluded from the web parity work.

## Attribution

Telloria Web retains components derived from the MIT-licensed NextChat project. See [LICENSE](./LICENSE).
