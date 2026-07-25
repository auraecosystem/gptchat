# 上游同步策略

- 上游仓库：[`git@github.com:ChatGPTNextWeb/NextChat.git`](https://github.com/ChatGPTNextWeb/NextChat)
- 当前同步基线：`706a18b9`
- 分支规范：`main`、`feature/*`、`chore/sync-upstream-*`

## 同步流程

1. 获取上游更新：`git fetch upstream`。
2. 从当前 `main` 创建同期同步分支：`chore/sync-upstream-<日期或版本>`。
3. 在同步分支合并上游主线：`git merge upstream/main`。
4. 解决冲突后执行项目验证（至少运行与改动相关的检查、构建或测试）。
5. 创建 PR，说明上游范围、冲突处理和验证结果；审查完成后再合并回 `main`。

`feature/*` 用于独立功能开发，不直接承载上游同步；同步改动应始终在 `chore/sync-upstream-*` 分支中完成。
