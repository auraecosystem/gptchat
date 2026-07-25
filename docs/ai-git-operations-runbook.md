# AI Git 操作手册：上游修复同步与 GitHub 合并

> **用途**：将本文件完整提供给其他 AI。AI 必须严格按本文档执行，先检查、后修改、再验证；任何推送、创建 PR、合并 PR 都必须基于本项目与当前仓库状态执行，不得臆测。
>
> **项目目录**：`/home/tang/project/person/tang-ai-chat`
>
> **项目包管理器**：Yarn Classic `1.22.19`。

## 1. 仓库约定

| 项目 | 固定值 / 规则 |
| --- | --- |
| 企业仓库（`origin`） | `git@github.com:Neumannzc/tang-ai-chat.git` |
| 原项目（`upstream`） | `git@github.com:ChatGPTNextWeb/NextChat.git` |
| 稳定分支 | `main` |
| 日常功能分支 | `feature/<功能名称>` |
| 上游同步分支 | `chore/sync-upstream-<YYYY-MM-DD>` |
| 文档/维护分支 | `chore/<事项>` |
| 当前初始上游基线 | `706a18b9` |
| 上游推送规则 | `upstream` 只能拉取；其 push URL 必须为 `DISABLED`。绝不向上游推送。 |

## 2. 所有操作的强制前置检查

进入项目目录后，先执行以下命令，并根据真实输出决定后续操作：

```bash
cd /home/tang/project/person/tang-ai-chat

git status --short --branch
git remote -v
gh auth status
git fetch origin --prune
```

必须满足以下条件：

1. 当前工作区没有未提交变更；有变更时，停止并报告变更文件，不能覆盖或丢弃用户改动。
2. `origin` 指向本项目仓库，且 `upstream` 指向 `ChatGPTNextWeb/NextChat`。
3. `upstream` 的 push 地址为 `DISABLED`；若不是，先执行：

   ```bash
   git remote set-url --push upstream DISABLED
   ```

4. `gh auth status` 显示已登录且具备 `repo` 权限；否则停止并要求用户完成 GitHub 登录。
5. 不得使用 `git push --force`、`git reset --hard`、`git clean -fd` 或覆盖用户未提交改动。

## 3. 场景 A：同步原项目的 Bug 修复或新提交

### 3.1 获取并评估上游更新

```bash
cd /home/tang/project/person/tang-ai-chat

git switch main
git pull --ff-only origin main
git fetch upstream --prune --tags

git rev-list --left-right --count main...upstream/main
git log --oneline main..upstream/main
git diff --stat main...upstream/main
git diff --name-status main...upstream/main
```

解释：

- `git rev-list --left-right --count main...upstream/main` 输出两个数字：左边是本项目独有提交数，右边是上游新增提交数。
- 右边为 `0`：没有要同步的上游更新，停止并报告。
- 先阅读 `git log` 和变更文件清单；若用户只要求某个 Bug 修复，确认对应上游提交 SHA 或 PR 后，再选择合并范围。

### 3.2 同步整个上游 `main`

适用于需要吸收上游当前全部修复时：

```bash
DATE=$(date +%F)
git switch -c "chore/sync-upstream-${DATE}"
git merge --no-ff upstream/main -m "chore: sync upstream NextChat"
```

- 禁止对共享的 `main` 使用 rebase。
- 不要直接在 `main` 合并上游。
- 若需要同步特定正式版本，使用经过确认的 tag，例如：

  ```bash
  git merge --no-ff v2.16.1 -m "chore: sync upstream NextChat v2.16.1"
  ```

### 3.3 只同步一个明确的上游 Bug 修复

适用于用户指定上游 commit SHA 或只需某个修复时：

```bash
DATE=$(date +%F)
git switch -c "chore/sync-upstream-${DATE}-<bug-keyword>"
git cherry-pick -x <上游提交SHA>
```

- `-x` 会在提交信息中记录来源提交，必须保留。
- 不知道准确 SHA 时，不得凭提交标题猜测；先使用 `git log upstream/main` 或 `gh` 查证。

### 3.4 冲突处理规则

发生冲突时：

```bash
git status
git diff --name-only --diff-filter=U
```

处理原则：

1. 先理解上游改动解决的问题，再与本项目的企业定制逻辑比较。
2. 不能无条件选择 `ours` 或 `theirs`。
3. 对 `README.md`、`docs/` 的上游内容冲突：保留 Tang AI Chat 的本地化文档结构；必要时只摘取仍有价值的技术说明。
4. 对应用源码冲突：保留本项目独立业务能力，同时吸收上游 Bug 修复的最小必要代码。
5. 解决后：

   ```bash
   git add <已解决文件>
   git merge --continue
   # 若是 cherry-pick：git cherry-pick --continue
   ```

6. 无法安全判断时，停止，保留冲突现场，并向用户报告冲突文件、两边逻辑与需要的决策。

## 4. 验证要求

先检查项目定义的脚本：

```bash
node -e "const p=require('./package.json'); console.log(p.scripts)"
```

当前项目的常用命令为：

```bash
yarn lint
yarn test:ci
yarn build
```

执行规则：

1. 若 `node_modules/` 不存在，**不得擅自执行 `yarn install`**；报告依赖未安装，等待用户授权。
2. 若依赖存在，至少执行与变更相关的检查；同步上游代码时优先执行：

   ```bash
   yarn lint
   yarn test:ci
   yarn build
   ```

3. 如命令失败，必须保留原始错误，修复或向用户报告；不能以“未验证”代替“通过”。
4. 无论何种变更，必须执行：

   ```bash
   git diff --check
   ```

## 5. 提交、推送与 PR 流程

### 5.1 提交前检查

```bash
git status --short
git diff --check
git diff --stat
git diff
```

确认变更只包含本次任务范围后再暂存：

```bash
git add <明确的文件或目录>
git diff --cached --check
git diff --cached --stat
```

提交信息规范：

```text
chore: sync upstream NextChat
fix: <修复内容>
feat: <功能内容>
docs: <文档内容>
```

上游同步提交必须能追溯来源，建议示例：

```bash
git commit -m "chore: sync upstream NextChat <tag或短SHA>"
```

### 5.2 推送功能或同步分支

仅在用户明确要求推送，或已授权“继续完成 PR 流程”时执行：

```bash
git push -u origin "$(git branch --show-current)"
```

推送后必须读取远程分支确认结果：

```bash
git ls-remote --heads origin "$(git branch --show-current)"
```

### 5.3 创建 Pull Request

仅在用户明确要求创建 PR，或已授权“继续完成 PR 流程”时执行。PR 必须指向本项目的 `main`：

```bash
BRANCH=$(git branch --show-current)
gh pr create \
  --repo Neumannzc/tang-ai-chat \
  --base main \
  --head "$BRANCH" \
  --title "chore: sync upstream NextChat <tag或短SHA>" \
  --body $'## 上游来源\n- 仓库：ChatGPTNextWeb/NextChat\n- 合并范围：<upstream main / tag / commit SHA>\n\n## 变更说明\n- <主要变更>\n\n## 冲突处理\n- <无冲突，或列出冲突与处理方式>\n\n## 验证\n- [ ] git diff --check\n- [ ] yarn lint\n- [ ] yarn test:ci\n- [ ] yarn build\n\n## 风险与回滚\n- <风险与回滚方式>'
```

创建后必须回读 PR，不得只报告创建成功：

```bash
gh pr view --repo Neumannzc/tang-ai-chat --json url,state,title,baseRefName,headRefName,commits,changedFiles,additions,deletions
```

### 5.4 合并 Pull Request

**合并是外部不可逆操作。除非用户明确说“合并 PR #<编号>”或给出同等明确授权，否则不得合并。**

合并前检查：

```bash
gh pr view <PR编号> --repo Neumannzc/tang-ai-chat --json url,state,isDraft,mergeStateStatus,reviewDecision,statusCheckRollup
```

只有满足以下条件才允许合并：

- PR 状态为 `OPEN`，且不是 Draft；
- `mergeStateStatus` 表明可合并；
- 必需 CI 检查通过；
- 用户已明确授权合并。

推荐使用 squash merge，保持 `main` 历史简洁：

```bash
gh pr merge <PR编号> \
  --repo Neumannzc/tang-ai-chat \
  --squash \
  --delete-branch
```

合并后必须验证：

```bash
gh pr view <PR编号> --repo Neumannzc/tang-ai-chat --json state,mergedAt,mergeCommit,url
git switch main
git pull --ff-only origin main
git status --short --branch
```

## 6. 合并后维护

每次成功同步上游后，更新：

- `docs/upstream-sync.md` 的“当前同步基线”；
- 本次同步日期、上游 tag/commit、冲突与验证结论；
- 若发现长期重复冲突，记录推荐的模块边界或适配方案。

不要删除：

- `LICENSE`；
- `.github/`、`scripts/`、`Dockerfile`、`docker-compose.yml`、`.dockerignore`；
- 用户未明确要求删除的应用源码、配置或锁文件。

## 7. 交付报告模板

完成任一操作后，向用户报告真实结果，不得编造：

```markdown
## 执行结果

- 场景：上游同步 / Bug 修复 / 推送分支 / 创建 PR / 合并 PR
- 当前分支：
- 上游范围（仓库、tag 或提交 SHA）：
- 本地提交：
- 远程分支：
- PR：

## 变更与冲突

- 变更文件数：
- 冲突文件及处理方式：无 / <详情>

## 验证

- `git diff --check`：通过 / 失败
- `yarn lint`：通过 / 失败 / 未执行（原因）
- `yarn test:ci`：通过 / 失败 / 未执行（原因）
- `yarn build`：通过 / 失败 / 未执行（原因）

## 状态

- 是否已推送：是 / 否
- 是否已创建 PR：是 / 否
- 是否已合并：是 / 否（未获得明确授权时必须为“否”）
```
