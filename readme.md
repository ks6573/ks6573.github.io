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

## Navigation and appearance

- Click the files, tabs, or project directories to navigate. Project READMEs have shareable URLs such as `/projects.html#project/syscontrol`.
- The panel button toggles Files. Desktop visibility is remembered separately from the temporary phone drawer. Escape closes the focused phone drawer and restores focus.
- The site uses a fixed tan palette, including for visitors who previously saved a different theme. Fonts are bundled; their license is in `public/fonts/OFL.txt`.
- The command prompt, command history, custom global shortcuts, and theme selector have been removed. Standard keyboard access to links, controls, and charts remains available.

## Activity and projects

The overview displays GitHub activity. `activity.dat` groups GitHub, ChatGPT/Codex, and Claude charts, reading the existing JSON exports under `public/data/`. Every chart displays its snapshot date. ChatGPT/Codex exports contain relative weekly intensity levels; dated daily values are not fabricated. Claude includes exact daily message counts and a recent trend.

Use the existing `sync:github-contributions` and `sync:claude-usage` scripts when intentionally refreshing data. A normal build does not refresh or access private usage logs. Each chart handles loading, unavailable/malformed data, and retry independently. Heatmaps support pointer, touch, and keyboard inspection with one Tab stop per chart.

For a Claude refresh followed by a build, run `npm run build:with-claude-usage`. The existing `./scripts/sync-claude-usage-and-deploy.sh` script refreshes and pushes the Claude export. An optional macOS LaunchAgent can invoke it with label `com.ks6573.claude-usage-sync`; its log path is `logs/claude-usage-sync.log`.

Curated project descriptions are in `src/projectData.js`. The Projects view retains the public GitHub API feed for additional recent repositories, with a fallback when GitHub is unavailable.

## Source structure

- `src/App.jsx`: terminal layout, sidebar preference, and focus management.
- `src/terminalModel.js`: page and project URL mapping.
- `src/TerminalViews.jsx` and `src/ProjectList.jsx`: portfolio content and project views.
- `src/ActivityPanels.jsx`: loading and rendering the public activity exports.
- `src/styles.css`: the terminal visual system and responsive layouts.

## Initial terminal release validation — September 9, 2026

Clean install and production build passed. The built site passed 91 Chromium assertions covering all direct entry pages, project refresh/back/forward navigation, command completion and history, text-only command rendering, palettes, sidebar persistence, focus recovery, all 694 chart cells against the public exports, details/trend rendering, and widths from 320 to 1440 pixels. Loading failures, malformed data, retries, unavailable storage, and the no-JavaScript contact fallback were exercised. Recent-repository filtering used a synthetic GitHub response; outage handling was tested separately. Desktop and phone layouts were visually reviewed. These are local build checks, not a substitute for verifying a deployment.

## Simplified interface validation — September 9, 2026

The fixed tan palette and simplified navigation passed a production build and 75 local Chromium checks. Coverage includes fresh visitors and saved green/blue preferences across all five entry pages, removal of the command controls and global shortcuts, project links and browser history, sidebar persistence, all three charts with 694 cells, and layouts from 320 to 1440 pixels. Desktop and phone screenshots were visually reviewed; no browser errors or failed site assets were observed.
