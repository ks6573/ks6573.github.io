# ks6573.github.io

Portfolio site built with React + Vite.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy

This repo includes a workflow at `.github/workflows/deploy-pages.yml` that builds and deploys to GitHub Pages on every push to `main`.

For GitHub Pages:

1. Push to `main`.
2. In GitHub: `Settings` -> `Pages` -> `Build and deployment`.
3. Set `Source` to `GitHub Actions`.

## Claude Usage Sync

This site can display a live-style Claude Code usage dashboard from local machine stats.

```bash
npm run sync:claude-usage
```

This reads `~/.claude/stats-cache.json` and writes:

- `public/data/claude-usage.json`

For one-step refresh + build:

```bash
npm run build:with-claude-usage
```

### Optional: Daily Auto-Sync on macOS (launchd)

Run this script to sync and push `public/data/claude-usage.json`:

```bash
./scripts/sync-claude-usage-and-deploy.sh
```

You can schedule it daily with a LaunchAgent:

- Label: `com.ks6573.claude-usage-sync`
- Script: `scripts/sync-claude-usage-and-deploy.sh`
- Logs: `logs/claude-usage-sync.log`
