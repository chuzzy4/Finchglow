# Finchglow Group Staff Portal

A multi-company internal staff portal for Finchglow Holdings Group, built as a front-end engineering case study.

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Install & run

```bash
npm install
npm run dev
```

The dev server starts at **http://localhost:5173**.

### Environment variables

Copy `.env.example` to `.env` and adjust as needed:

```bash
cp .env.example .env
```

| Variable | Default | Description |
|---|---|---|
| `VITE_API_LATENCY_MS` | `500` | Artificial delay added to every mock API call |
| `VITE_API_FAILURE_RATE` | `0.1` | Probability (0–1) that a mock call returns an error |
| `VITE_APP_TITLE` | `Finchglow Group Staff Portal` | `<title>` tag value |

Setting `VITE_API_FAILURE_RATE=0` disables random failures entirely — useful while reviewing UI states.

### Build

```bash
npm run build       # production bundle → dist/
npm run preview     # serve the production build locally
```

---

## Stack

| Concern | Choice |
|---|---|
| Framework | React 18 + TypeScript 5 |
| Build tool | Vite 6 with `@tailwindcss/vite` plugin |
| Styling | Tailwind CSS v4 |
| Icons | `@hugeicons/core-free-icons` via a local `makeIcon` factory |
| Data | Local JSON files with a fetch wrapper (`src/api/client.ts`) |
| Persistence | IndexedDB via a thin helper (`src/lib/idb.ts`) |
| Font | Plus Jakarta Sans (self-hosted via `@fontsource`) |

No UI component library, no state management library, no utility belt (lodash / date-fns).

---

## Architecture

### Directory layout

```
src/
├── api/            # Fetch wrapper + per-resource API modules
├── components/ui/  # Generic, reusable UI atoms (Skeleton, Error, Empty, Badge)
├── config/         # Single source of truth for company configuration
├── data/           # Mock JSON data (apps, alerts, users)
├── features/       # Feature-sliced UI — one folder per domain concern
│   ├── alerts/     # AlertCard, AlertsBanner, AlertsFeed
│   ├── home/       # Home, AppGrid, AppCard
│   ├── offline/    # OfflineBanner
│   ├── search/     # SearchBar, SearchResults
│   └── switcher/   # CompanyTabs (dropdown switcher)
├── hooks/          # useApi, useSearch, useDebounce, useOffline
├── lib/            # icon factory, filterItems, IndexedDB helper, timeago
├── styles/         # global.css (Tailwind base) + tokens.css (design tokens)
└── types/          # Shared TypeScript types
```

### Key design decisions

**CSS theming via `data-company` attribute**  
`document.documentElement.dataset.company` is set to the active company ID whenever the user switches. `tokens.css` has one `[data-company="<id>"]` block per company that swaps three CSS variables (`--color-accent`, `--color-brand-mark`, `--color-tint`). Every component uses only token utility classes (`bg-accent`, `text-accent`, `bg-tint`) — no company names or hex values in component code. Adding a seventh company requires editing only `src/config/companies.ts` and `src/styles/tokens.css`.

**Single `useApi` hook for all data fetching**  
`useApi` handles loading, error, retry, and optionally reads/writes IndexedDB so the last successful response is available immediately on next load (stale-while-revalidate pattern without a library).

**Custom icon factory instead of `@hugeicons/react`**  
The free-pack icons export `[tagName, attrs][]` SVG tuples, not the `IconSvgObject` type the React package expects. A local `makeIcon` factory in `src/lib/icon.ts` renders these directly as native `<svg>` elements, giving type-safe, tree-shakeable icon components with no runtime overhead.

**Offline detection with `useOffline`**  
Listens to `window` `online`/`offline` events. When the app reconnects a refetch key is incremented, which causes `useApi` fetchers to re-run. The last-updated timestamp is stored and shown in `OfflineBanner`.

**Company filtering centralised in `filterItems.ts`**  
`filterByCompany` accepts any array with a `scope` field (`'group' | string[]`). Passing `'group'` means the item is always visible regardless of active company. This keeps filtering logic in one place and out of components.

---

## What I would do with another week

1. **Authentication** — wire up a real OIDC flow (Auth.js / Keycloak). The mock `CURRENT_USER` in `App.tsx` would be replaced by claims from the id-token; the company switcher would be restricted to companies the authenticated user belongs to.

2. **Proper API layer** — replace the JSON files with a lightweight BFF (e.g. a small Hono or Express service) returning the same shapes. The fetch wrapper in `src/api/client.ts` is already structured for this; only the base URL and auth headers would change.

3. **End-to-end tests** — add Playwright smoke tests for the three core flows: company switch (theme change + app grid update), search (results appear, clear resets), and offline banner (service worker or `navigator.onLine` stub).

4. **App launcher deep-links** — each app card currently has a placeholder `href`. Real URLs (and whether to open in a new tab vs. an embedded iframe panel) would be configured in `apps.json` and respected by `AppCard`.

5. **Notifications** — real-time critical alerts via SSE or WebSocket, replacing the polled JSON. The `AlertsBanner` and `AlertsFeed` components already accept live data; only the data source changes.

6. **Accessibility audit** — run axe-core against every route, address any remaining focus-trap or colour-contrast issues, and add `aria-live` regions for the company switch so screen-reader users are informed of the context change.
