# Decision Log

Three hard trade-offs made during this case study, and why I resolved them the way I did.

---

## 1. Custom icon factory vs. the official `@hugeicons/react` wrapper

**The problem.** The brief required Hugeicons with tree-shakeable imports. The free pack (`@hugeicons/core-free-icons`) exports icons as `[tagName, attrs][]` SVG tuples. The React wrapper (`@hugeicons/react`) expects a different shape — `IconSvgObject` from the pro pack — so passing free-pack icons to it causes TypeScript errors and broken rendering.

**Options considered.**
- ① Use the React wrapper anyway and cast types with `as any` — works at runtime, hides errors.
- ② Install the pro pack — not permitted by the brief (no external UI libraries beyond what was specified).
- ③ Write a small local factory that renders the tuple data directly as a native `<svg>`.

**Decision: option ③.** `src/lib/icon.ts` contains a `makeIcon` function (~20 lines) that turns any free-pack tuple array into a typed React component. It keeps the bundle small (only imported icons are included), eliminates all type errors, and is fully explainable line-by-line — which the brief required.

**Trade-off accepted.** We own this abstraction, so if Hugeicons changes its internal data shape we need to update the factory. Acceptable for a project of this scope; in production I would pin the icon package version.

---

## 2. CSS variable theming vs. a JS theme context

**The problem.** Six companies each need their own accent, brand-mark, and tint colour. Components must switch colours instantly when the user changes company.

**Options considered.**
- ① React context with inline style overrides on every component — correct, but adds prop-drilling or a context consumer to every styled element.
- ② CSS-in-JS (styled-components / emotion) with a theme object — powerful, but violates the "no UI library" constraint and adds significant bundle weight.
- ③ Set a `data-company` attribute on `<html>` and use CSS custom-property overrides in a stylesheet.

**Decision: option ③.** A single `useEffect` in `App.tsx` sets `document.documentElement.dataset.company`. One selector block per company in `tokens.css` swaps three variables. No component touches hex values or company IDs — only token classes (`bg-accent`, `text-accent`). The switch is instant (one DOM attribute write, browser repaints), requires zero JavaScript at runtime beyond the attribute set, and adding a seventh company is a two-file change.

**Trade-off accepted.** The CSS approach makes it slightly harder to animate colour transitions (you cannot tween CSS custom properties without `@property` + Houdini, which is not universally supported). We chose to accept hard-cut switching in exchange for simplicity and performance.

---

## 3. IndexedDB stale-while-revalidate vs. in-memory caching only

**The problem.** The brief called for offline resilience. On first load the mock API has 500 ms latency; on reload the user would see skeletons again even though data was available moments ago.

**Options considered.**
- ① In-memory cache only (a module-level `Map`) — survives component unmounts but not page refresh, and provides no offline support.
- ② Service Worker with `Cache-API` — correct for full offline support, but adds significant complexity (registration, versioning, update lifecycle) that is out of scope for a one-week brief.
- ③ Thin IndexedDB helper that stores the last successful API response keyed by endpoint, read before the fetch and returned immediately (stale), then replaced when the network response arrives.

**Decision: option ③.** `src/lib/idb.ts` is ~50 lines using the raw IndexedDB API (no library). `useApi` reads the cached value and sets it as the initial state before the fetch completes, so the UI is never blank on reload. When the fetch succeeds the cache is updated. When offline the stale value remains.

**Trade-off accepted.** The stale data can be arbitrarily old — there is no TTL or invalidation strategy beyond "replace on next successful fetch". For internal tooling where data changes infrequently this is acceptable. A production implementation would add a `cachedAt` timestamp and invalidate after a configurable TTL.
