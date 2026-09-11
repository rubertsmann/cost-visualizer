# The Bill for the Boom

A single-screen, animated calculator for the cost of the AI build-out: what a
paying user would owe each month for the capital being spent to come back,
against the $20 actually charged.

It is a **break-even thought experiment, not a forecast**. It assumes the
money has to be repaid by users at all — much of it may instead come back
from enterprise contracts, advertising, or never.

## The page

Controls on the left, answer on the right. Six sliders over researched,
cited defaults; a curve of required monthly price against payback period
with the current setting marked and today's price as a reference line; and
a direct two-bar comparison of charged-versus-needed. A particle field
behind it all runs faster and hotter the further the price is from covering
the bill.

## Running it

```bash
nvm use          # Node version pinned in .nvmrc
npm install
npm run dev      # http://localhost:5173
```

| Script | Does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Typecheck + production build to `dist/` |
| `npm run preview` | Serve the production build |
| `npm test` | Vitest — the break-even model |
| `npm run typecheck` | `tsc --noEmit` |

## How it is put together

- **`src/data/`** — every figure wrapped in `Sourced<T>` with an `asOf` date
  and a citation. The outro table is generated from this, so a figure cannot
  be added without its provenance appearing on the page.
- **`src/lib/model.ts`** — the break-even arithmetic. Pure, no React, and the
  only part with unit tests. Guards every divisor the sliders can drive to
  zero.
- **`src/state/`** — zustand. The scene reads assumptions inside its own rAF
  via `getState()`, so dragging a slider costs no React render on its account.
- **`src/charts/`** — hand-rolled SVG on `d3-scale`/`d3-shape`. No chart
  library: the marks are driven directly from the model on every input.
- **`src/scene/`** — the particle field. Lazy-loaded, strictly decorative,
  and absent entirely under reduced motion.
- **`src/views/Calculator.tsx`** — the page itself.

### Colour

The three series colours are the `dataviz` categorical slots stepped for a
dark surface, validated against `#111114` with `--pairs all`: worst CVD
ΔE 9.4, worst normal-vision ΔE 20.9, all at or above 3:1 contrast.

### Motion

A **Motion** toggle (system / full / reduced) sits at the top right. Under
reduced motion the canvas is not mounted and `three` is never downloaded;
the calculator itself is unaffected, since it was never animated by scroll.

## Caveats worth repeating

- Capex figures are **total** capital expenditure, not AI-only.
- Revenue is **annualized run-rate**, which flatters a fast-growing year.
- The 2024 capex point is **derived** and labelled as such in `src/data/capex.ts`.
- Everything here moves quickly. The `asOf` column is the honest part.

## Hosting

It builds to a folder of static files with no backend, so any static host
works. `netlify.toml` and a GitHub Pages workflow are already in the repo.

**Cloudflare Pages or Netlify — the easiest.** Connect the Git repo, set
build command `npm run build` and publish directory `dist`. Every push
deploys, previews come free, and both have a free tier that covers this
comfortably. Netlify will pick up `netlify.toml` as-is.

**Vercel.** Same flow; it auto-detects Vite, so there is nothing to
configure.

**GitHub Pages — free and already wired up.** `.github/workflows/pages.yml`
builds and deploys on every push to the default branch. Enable it once under
*Settings → Pages → Source: GitHub Actions*. The site is served from
`/<repo>/` rather than the domain root, which is why the workflow passes
`--base=/<repo>/`; without that the asset URLs would 404.

**Anything else.** `npm run build` and copy `dist/` to any web server or
object store. The only server-side requirement is the usual SPA rewrite —
serve `index.html` for unknown paths — and even that only matters if you
later add routes.

One note wherever you host: the page loads fonts from nothing and calls no
APIs, so there is no third-party runtime dependency and no key to leak. The
`three` chunk is ~132kB gzipped and loads only when motion is on.
