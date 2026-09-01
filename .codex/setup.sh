codex mcp add hf-mcp-server --url "https://huggingface.co/mcp?login"
docker run --init \
  --name bytebase\
  --publish 8080:8000 \
  --volume ~/.bytebase/data:/var/opt/bytebase \
  bytebase/bytebase:latest
  # Setup a postgres database with user bbdev and database bbdev
export PG_URL=postgresql://bbdev@localhost/bbdev

# Start backend
alias r='go build -ldflags "-w -s" -p=16 -o ./bytebase-build/bytebase ./backend/bin/server/main.go && ./bytebase-build/bytebase --port 8080 --data . --debug'
find . -type f \( -name "*.prg" -o -name "*.dbf" -o -name "*.cdx" -o -name "*.dbt" \)
# Start frontend
alias y="pnpm --dir frontend i && pnpm --dir frontend dev"
╭──────────────────────────────────────────────────╮
│ >_ OpenAI Codex                                  │
│                                                  │
│ model:     gpt-5.6-sol medium/model to change │
│ directory: ~/code                                │
╰──────────────────────────────────────────────────╯

  To get started, describe a task or try one of these commands:

  /init - create an AGENTS.md file with instructions for Codex
  /status - show current session configuration
  /permissions - choose what Codex is allowed to do
  /model - choose what model and reasoning effort to use
  /review - review any changes and find issues
      
curl -X 'POST' \
  'http://127.0.0.1:8000/predict' \
  -H 'Content-Type: application/json' \
  -d '{
    "feature_1": 0.45,
    "feature_2": 1.28
  }'

cat << 'EOF' > .gitattributes
# Remap header/script extensions
*.ch linguist-language=C
*.prg linguist-language=Text
*.dbf linguist-vendored
*.sv linguist-language=Text

# Exclude generated HTML reports and notebooks from stats
*.html linguist-vendored
*.ipynb linguist-documentation
EOF

# Commit and push to GitHub
git add .gitattributes
git commit -m "fix: configure .gitattributes to fix language stats"
git push origin main

man git-clone https://github.com/josStorer/RWKV-Runner

# Then
cd RWKV-Runner
python ./backend-python/main.py #The backend inference service has been started, request /switch-model API to load the model, refer to the API documentation: http://127.0.0.1:8000/docs

# Or
cd RWKV-Runner/frontend
npm ci
npm run build #Compile the frontend
cd ..
python ./backend-python/webui_server.py #Start the frontend service separately
# Or
python ./backend-python/main.py --webui #Start the frontend and backend service at the same time

# Help Info
python ./backend-python/main.py -h
git clone https://github.com/auraecosystem/jssg
cd jssg
zig build
npx codemod @nodejs/cjs-to-esm

This repository contains codemods (automated migrations) for "userland" code. These are intended to facilitate adopting new features and upgrading source-code affected by breaking changes.

## Usage

> [!CAUTION]
> These scripts change source code. Commit any unsaved changes before running them. Failing to do so may ruin your day.

To run the transform scripts use [`codemod`](https://go.codemod.com/github) command below:

### From registry

With the codemod CLI you can run a workflow from the [Codemod Registry](https://codemod.link/nodejs-official). Replace `<recipe>` with the name of the recipe you want to run:

```bash
npx codemod @nodejs/<recipe>
