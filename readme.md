# Karan Seroy's portfolio

The production site at [kseroy.me](https://kseroy.me/) implements the terminal design study in React and Vite. Original design studies remain in `mockups/`.

## Develop and build

```sh
npm ci
npm run dev
npm run build
npm run preview
```

GitHub Actions builds and deploys `dist/` to GitHub Pages on pushes to `main`. `public/CNAME` preserves the configured custom domain. Build entry points include the homepage, `projects.html`, `about.html`, `contact.html`, and `activity.html`, so shared links load directly on the static host.

## Terminal controls

- Click the files, tabs, or project directories to navigate. Project READMEs have shareable URLs such as `/projects.html#project/syscontrol`.
- Use `home`, `projects`, `open syscontrol`, `cat experience.log`, `cat activity.dat`, `cat contact.txt`, `cd ..`, `pwd`, `clear`, and `help` in the prompt. Commands navigate the portfolio; they do not execute a system shell.
- `/` focuses the prompt, arrow keys browse command history, and Tab completes commands.
- The panel button or `⌘/Ctrl+B` toggles Files. Desktop visibility is remembered separately from the temporary phone drawer. Escape closes the phone drawer and restores focus.
- `theme green`, `theme amber`, and `theme ice` select a locally remembered palette. Fonts are bundled; their license is in `public/fonts/OFL.txt`.

## Activity and projects

The overview displays GitHub activity. `activity.dat` groups GitHub, ChatGPT/Codex, and Claude charts, reading the existing JSON exports under `public/data/`. Every chart displays its snapshot date. ChatGPT/Codex exports contain relative weekly intensity levels; dated daily values are not fabricated. Claude includes exact daily message counts and a recent trend.

Use the existing `sync:github-contributions` and `sync:claude-usage` scripts when intentionally refreshing data. A normal build does not refresh or access private usage logs. Each chart handles loading, unavailable/malformed data, and retry independently. Heatmaps support pointer, touch, and keyboard inspection with one Tab stop per chart.

For a Claude refresh followed by a build, run `npm run build:with-claude-usage`. The existing `./scripts/sync-claude-usage-and-deploy.sh` script refreshes and pushes the Claude export. An optional macOS LaunchAgent can invoke it with label `com.ks6573.claude-usage-sync`; its log path is `logs/claude-usage-sync.log`.

Curated project descriptions are in `src/projectData.js`. The Projects view retains the public GitHub API feed for additional recent repositories, with a fallback when GitHub is unavailable.

## Source structure

- `src/App.jsx`: terminal shell, sidebar and palette preferences, command input, focus management.
- `src/terminalModel.js`: virtual commands and URL mapping.
- `src/TerminalViews.jsx` and `src/ProjectList.jsx`: portfolio content and project views.
- `src/ActivityPanels.jsx`: loading and rendering the public activity exports.
- `src/styles.css`: the terminal visual system and responsive layouts.

## Release validation — September 9, 2026

Clean install and production build passed. The built site passed 91 Chromium assertions covering all direct entry pages, project refresh/back/forward navigation, command completion and history, text-only command rendering, palettes, sidebar persistence, focus recovery, all 694 chart cells against the public exports, details/trend rendering, and widths from 320 to 1440 pixels. Loading failures, malformed data, retries, unavailable storage, and the no-JavaScript contact fallback were exercised. Recent-repository filtering used a synthetic GitHub response; outage handling was tested separately. Desktop and phone layouts were visually reviewed. These are local build checks, not a substitute for verifying a deployment.
