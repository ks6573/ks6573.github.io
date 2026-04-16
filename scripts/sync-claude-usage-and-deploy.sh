#!/bin/zsh
set -euo pipefail

export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
LOG_DIR="$REPO_DIR/logs"
LOCK_DIR="$REPO_DIR/.sync-claude-usage.lock"

mkdir -p "$LOG_DIR"
exec >>"$LOG_DIR/claude-usage-sync.log" 2>&1

timestamp() {
  date "+%Y-%m-%d %H:%M:%S"
}

echo "[$(timestamp)] start Claude usage sync run"

if ! mkdir "$LOCK_DIR" 2>/dev/null; then
  echo "[$(timestamp)] lock exists, skipping overlapping run"
  exit 0
fi
trap 'rmdir "$LOCK_DIR" 2>/dev/null || true' EXIT

cd "$REPO_DIR"

if [ ! -f "package.json" ]; then
  echo "[$(timestamp)] package.json missing in $REPO_DIR"
  exit 1
fi

npm run sync:claude-usage

if git diff --quiet -- public/data/claude-usage.json; then
  echo "[$(timestamp)] no claude usage changes"
  exit 0
fi

git add public/data/claude-usage.json
git commit -m "chore(stats): sync Claude usage $(date +%Y-%m-%d)" -- public/data/claude-usage.json
git push origin main

echo "[$(timestamp)] sync + push complete"
