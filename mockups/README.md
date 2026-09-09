# Portfolio design studies

Standalone, responsive prototypes for Karan Seroy's portfolio. The current direction is `terminal.html`. The first-round comparison is preserved at `index.html`. Serve this directory with `python3 -m http.server 4174 --bind 127.0.0.1 --directory mockups` from the repository root, or open the HTML files directly. No install or application build is required.

## Current direction: Terminal

The user rejected C and found A/B too corporate. The new brief is a computer-terminal portfolio.

- Palette: terminal black #101310, shell surround #181c18, pane #171c17, border #323c31, phosphor #b8d291, text #d0d3c7. Alternate amber and ice palettes are selectable.
- Type: IBM Plex Mono throughout. Normal output is compact; ASCII letterforms carry the identity.
- Layout: a single terminal window with a file browser, shared content pane, command prompt, and status line. The panel button at the start of the tabs or `⌘/Ctrl+B` collapses the Files sidebar and releases its width to the content pane. Desktop visibility is remembered locally. The file tree becomes a temporary drawer on phones, with its state independent of the desktop preference.
- Review against the revised brief: the main view is command output, project directories, and saved activity data. This replaces the marketing headlines, project illustrations, and large cards of the first round.
- Interactions: clickable files and project READMEs; commands including `whoami`, `projects`, `open syscontrol`, `cat experience.log`, `cat contact.txt`, `activity`, `cd`, `pwd`, `clear`, and `theme amber`; command history, tab completion, keyboard focus shortcut, and keyboard-inspectable contribution cells.
- Data: `terminal-data.js` copies the existing public GitHub snapshot (January 1–August 16, 2026, generated August 17). `terminal-usage-data.js` bundles the saved public ChatGPT/Codex and Claude exports, also generated August 17. All charts are labeled as snapshots.
- Activity: `terminal.html#activity` opens `activity.dat` with GitHub, ChatGPT/Codex, and Claude heatmaps. ChatGPT/Codex includes token totals, streaks, longest chat, and expandable usage insights; its export supplies relative activity levels without exact daily dates or token counts. Claude includes usage totals, dated message counts, and a 42-day message trend. The overview retains its compact GitHub chart.
- Scope: browser-only portfolio commands; no operating-system shell execution. No AI service or backend is connected.

```text
title bar                                      palette
overview / projects / experience / contact
file tree | whoami → ASCII identity + profile
          | ls projects/ → project directories
          | cat activity.dat → GitHub + ChatGPT/Codex + Claude
command prompt
status line
```

Terminal verification: checked six viewport widths from 320 to 1440 pixels with no horizontal document overflow or failed asset requests. Passed 18 interaction assertions for command completion, history and draft restoration, relative project files, parent navigation, text-only command echo, the phone file drawer and focus transfer, keyboard activity inspection, palette persistence, clearing, and returning home. Terminal JavaScript files passed syntax checks. Desktop and phone screenshots are in `previews/terminal-*.png`.

Activity addition verification: the bundled usage fields exactly match their public JSON exports. Passed 25 browser assertions, including all 694 rendered source cells, date/relative-level labels, keyboard and tap inspection, expandable insights, the 42-day trend, theme switching, commands, direct links, and preservation of the overview. No document or inner-pane horizontal overflow at 320, 390, 768, 1024, or 1440 pixels; no JavaScript page errors or failed asset requests. Reviewed desktop and phone screenshots in `previews/terminal-activity-*.png`.

Sidebar addition verification: passed 37 browser assertions covering pointer and keyboard toggles, reclaimed width, persistence, navigation, focus recovery, phone drawer behavior, and desktop/phone transitions. Both sidebar states fit at 320, 390, 700, 701, 768, 1024, and 1440 pixels without document or content-pane horizontal overflow. No JavaScript page errors. Screenshots are in `previews/terminal-sidebar-*.png`.

## First-round design plans (rejected)

### A. Fieldwork

- Purpose: make the work immediately legible to collaborators and hiring teams.
- Palette: mist #edf3f8, cobalt #2254df, ink #182936, slate #526778, white #ffffff, silver #d6e0e9.
- Type: Manrope throughout; large, tightly spaced headlines and readable body text.
- Layout: left-aligned introduction beside a dimensional systems drawing; two substantial project stories below.
- Signature: an exploded stack represents the layers between a model and a useful system. The illustration is a conceptual diagram, not a product screenshot.

```text
Name                         Work / About / Contact
Introduction                 Exploded systems drawing
Selected work                Short framing sentence
SysControl                   SwiftLaw
Experience                   Working philosophy
Contact
```

### B. Instrument

- Purpose: give technical visitors something concrete to explore.
- Palette: navy #111d2a, raised navy #1a2938, ice #e7eff7, steel #9bafc2, blue #9bbfff, amber #efbc74.
- Type: IBM Plex Sans for reading; IBM Plex Mono for actual technical content.
- Layout: compact rail and wide workbench; a large headline opens into an interactive pipeline and project inspector.
- Signature: a sample evaluation pipeline with explicit example-data labeling. No telemetry is presented as live production data.

```text
Rail | Name                                Contact
     | Introduction                 Build philosophy
     | Input -> Extract -> Verify -> Output
     | Step inspector                       Sample result
     | Project selector                  Project detail
     | Experience / Contact
```

### C. Commonplace

- Purpose: emphasize the person making the work and make the portfolio memorable.
- Palette: yellow #f3dc68, plum #422443, lilac #d7c6ed, paper #fffdf5, rose #efb4a6, leaf #bccdab.
- Type: Bricolage Grotesque; an expressive name treatment and quieter prose.
- Layout: persistent identity column beside an asymmetric collection of project objects; single-column reading order on small screens.
- Signature: a project notebook, with playful type and purposeful project-specific illustrations.

```text
Name / role       Intro                          Contact
                  SysControl, large notebook
Short bio         Terminaude          Evaluation notes
Links             More projects / About
```

## Review against the brief

These vary information hierarchy and interaction, not just colors. Fieldwork leads with project outcomes; Instrument demonstrates process; Commonplace gives personality and projects equal emphasis. The drawings reference systems tooling, terminal work, and evaluation from the actual portfolio. The designs avoid stock photography, invented testimonials, and decorative statistics.

## Prototype scope

- Existing project descriptions and career context come from `src/projectData.js`, `src/App.jsx`, `src/AboutPage.jsx`, and `src/ContactPage.jsx`, inspected September 9, 2026.
- Project illustrations are original diagrammatic mockups, not screenshots of released products.
- Fieldwork includes working project-detail dialogs. Instrument has an interactive sample pipeline and project selector. Commonplace has category filters and expandable project notes.
- Contact and GitHub links use existing portfolio destinations. No message is sent by a prototype.
- The current React application and synced activity datasets are unchanged. Activity panels can be retained on a secondary Work/Activity page when a direction is selected.
- Fonts are bundled for local previews; license files accompany downloaded fonts.

## Build on a direction

Each concept has its own HTML and CSS; `shared.css` and `shared.js` provide only presentation navigation and shared interaction behavior. Choose a direction, then move its visual system into the React components. The content and illustrations can also be mixed deliberately across concepts.

## Verification — September 9, 2026

- All four pages loaded in Chromium with no JavaScript page errors or failed asset requests.
- Checked document width at 320, 390, 768, 1024, and 1440 pixels: no horizontal page overflow. The comparison table scrolls within its own container on narrow screens.
- Passed 20 interaction assertions covering project dialogs and their content, repository destinations, Escape and focus return, pipeline stage selection and the sample run, project selection, category filters, expandable notes, phone/desktop previews, and navigation between gallery and prototypes.
- Confirmed each concept has one main heading, labeled buttons, and valid local section anchors.
- Both JavaScript files passed `node --check`.
- Reviewed desktop and full phone-page screenshots. Screenshots are saved in `previews/`, including full-page exports for every concept.
- These checks cover the local design prototypes; no production deployment or live AI integration was performed.
