# The Bill for the Boom

An animated scrollytelling page about the cost of the AI build-out: what a
single user pays today, against what they would have to pay for the capital
being spent to come back.

It is a **break-even thought experiment, not a forecast**. It assumes the
money has to be repaid by users at all — much of it may instead come back
from enterprise contracts, advertising, or never.

## The argument, in three chapters

1. **The money went in first** — Big Five capital expenditure 2022–2026
   plotted against OpenAI and Anthropic revenue, on one shared dollar axis.
2. **So what is your share?** — the same bill spread across every user, then
   concentrated onto the ~5.6% who actually subscribe.
3. **Disagree with me** — every assumption behind chapter two, as a slider.

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
- **`src/state/`** — zustand. Scroll position lives here rather than in React
  state so the WebGL loop can read it inside its own rAF; scrolling costs no
  React renders.
- **`src/charts/`** — hand-rolled SVG on `d3-scale`/`d3-shape`. No chart
  library: the marks are scroll-scrubbed and needed to be driven directly.
- **`src/scene/`** — the particle field. Lazy-loaded, strictly decorative,
  and absent entirely under reduced motion.
- **`src/chapters/`** — content. `ChapterShell` owns all pin/scrub wiring.

### Colour

The three series colours are the `dataviz` categorical slots stepped for a
dark surface, validated against `#111114` with `--pairs all`: worst CVD
ΔE 9.4, worst normal-vision ΔE 20.9, all at or above 3:1 contrast.

### Motion

A **Motion** toggle (system / full / reduced) sits at the top right. Under
reduced motion nothing pins and nothing scrubs: chapters render at full
progress as ordinary blocks, the canvas is not mounted, and `three` is never
downloaded. The whole argument survives being read as a static document.

## Caveats worth repeating

- Capex figures are **total** capital expenditure, not AI-only.
- Revenue is **annualized run-rate**, which flatters a fast-growing year.
- The 2024 capex point is **derived** and labelled as such in `src/data/capex.ts`.
- Everything here moves quickly. The `asOf` column is the honest part.
