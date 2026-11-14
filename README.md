# colinvargas.com

astro portfolio site for `colinvargas.com`.

## site structure

- `/` is the live editorial portfolio homepage.
- `/work` is a filterable project index. `/work/adaptive-cfd-solver`, `/work/scramjet-analysis-tool`, and `/work/compressible-flow-project` explain project scope, approach, and publication status. the last url is retained for the mixing chamber analysis project.
- `/work/portfolio-and-technical-logs` describes this site and its repository-aware logging workflow, with a link to the public source.
- `/notes` is a reading guide to the public project records and open checks. there are no standalone public notes; draft entries are not rendered into pages.
- `/systems` is the public systems readout. it renders sanitized, read-only telemetry and falls back cleanly if the live API route is unavailable.
- `/sysadmin` and its four detail urls redirect to their corresponding `/systems` pages for existing bookmarks.
- `/resume` is a printable technical profile with education, experience, project work, focus areas, and public contact links.
- `/404` provides a styled fallback for unpublished or missing pages.

## content pass / november 11, 2026

- objective: fill generic project summaries and the notes dead end with sourced public context, add verified background to the technical profile, align contact identity, and remove invented offline telemetry.
- sources: this repository and style guide; the existing website brief; the owner's current resume, propulsion report, and mixing-chamber report; and the owner's correction that both course projects use MATLAB, with `me@colinvargas.com` and `linkedin.com/in/colin-vargas` as public contact details.
- requirements: preserve the current shared data model and interactive solver study; keep concise lowercase copy; separate demonstrated solver behavior from planned AMR; describe the incompressible finite-difference mixing chamber accurately.
- exclusions: no private thesis repository links, draft log, report files, unreviewed figures, or invented metrics are added to the public site.
- acceptance: `npm test` and `npm run build` pass; `/`, `/work`, all project pages, `/notes`, `/resume`, `/contact`, and `/systems` render; public links agree; offline systems pages display unavailable values.
- unresolved: public report artifacts can be added after their contents and provenance are reviewed.
- next action: verify the generated pages and deployment path, then publish the reviewed source.

## readability pass / november 12, 2026

- objective: make the small navigation, technical labels, source excerpt, and captions easier to read on the homepage and supporting pages.
- source: the owner's Safari homepage screenshot and feedback that some text is too small; the existing style guide and CSS are the visual baseline.
- requirements: raise small text sizes and line heights consistently, preserve the editorial type hierarchy and both themes, and keep code inspection usable with pointer, keyboard, reduced motion, and narrow screens.
- exclusions: no project copy, numerical behavior, layout redesign, or unpublished artifacts are part of this change.
- acceptance: run tests and a production build; inspect desktop and narrow layouts for readable labels, code wrapping, nav fit, horizontal overflow, and the scroll study's static fallback.
- unresolved: the exact preferred reading size was not specified, so use a restrained increase and verify it visually.
- result: navigation and action labels now use 15px on desktop and 13px on mobile; shared technical labels use 14px, and the homepage source excerpt uses 13–14px. most dense captions and calculated values use 13px. narrow viewports show the complete study in normal flow so wrapped code does not overlap animated line objects, with a separate face-flux readout where SVG labels would scale too small.
- validation: seven numerical tests and Astro check/build passed with zero diagnostics. browser checks found no horizontal overflow at 320–1800px or on representative secondary pages at 320px. the study uses static mode on narrow, short, reduced-motion, or code-wrapping views; forward and reverse scroll still work when the source fits. code-line selection, project filtering, and theme persistence passed.
- next action: review the readability preview and publish the focused change.

## implementation study pacing / november 12, 2026

- objective: reveal the annotated cell grid before any source line moves and retain a readable record of each completed update step through the final field.
- source: the owner's request to make the grid appear first and keep each step visible rather than transient; the existing pinned source excerpt and computed reference case remain authoritative.
- requirements: reserve an initial grid-only fade, move the six statements in order, keep completed faces and a compact step record visible, and let reverse scrolling reconstruct earlier states.
- exclusions: no changes to the solver excerpt, reference calculation, project claims, or reduced-motion and no-javascript reading paths.
- acceptance: check prelude timing, line arrivals, cumulative face and step visibility, final-field persistence, reverse scrolling, static fallbacks, and desktop/narrow layouts in a built preview.
- unresolved: interpret “grid” as the annotated cell grid in the code-to-cell study; keep the 64 × 64 field as the final stage.
- result: the selected cell grid fades in fully before the first source line moves. completed face highlights remain, and a six-step value record stays visible when the computed field takes over. reversing scroll reconstructs the earlier state.
- validation: seven numerical tests and Astro check/build passed with zero diagnostics. built-preview checks at 1280 × 900 and 1800 × 1100 confirmed the grid-only prelude, ordered arrivals, cumulative faces and records, final-field persistence, and reverse scroll. compact, short, and reduced-motion views show the full study in normal flow without horizontal overflow.
- next action: review the updated motion and readability preview in the open pull request, then publish after approval.

## implementation study layout correction / november 12, 2026

- objective: keep the complete source block visible while the annotated cell grid fades into the space below it.
- source: the owner's correction to the merged implementation-study motion; the pinned source excerpt and computed reference case remain authoritative.
- requirements: put the grid and completed-step record below the code, keep the canonical lines readable throughout the animation, retain the ordered line-to-face movement, and preserve reverse scroll and static reading paths.
- exclusions: no changes to the solver statements, numerical result, project claims, typography system, or other site sections.
- acceptance: inspect the initial code, grid-only fade, intermediate and final stages, reverse scroll, keyboard inspection, mobile and reduced-motion layouts, and fit at desktop sizes. run tests and a production build.
- unresolved: shorter viewports may use the existing normal-flow presentation when the stacked animated study cannot fit.
- result: the source block stays visible throughout. the grid appears directly below it, and moving copies of each source line emerge below the panel as their step begins. completed faces and the step record remain visible; the final field occupies the same lower area. the former reading control now pauses motion for direct inspection.
- validation: seven numerical tests and Astro check/build passed with zero diagnostics. built-preview checks at 2048 × 1190 and 1800 × 1100 confirmed source visibility, grid-only fade, ordered arrivals, cumulative records, final field, and reverse scroll. code-line selection, keyboard focus, pause/return, both themes, reduced motion, no-javascript, and static fallbacks passed. responsive checks from 320 to 1800px found no horizontal overflow after changing the ledger to two columns at 900px.
- next action: review the correction in a focused pull request, then publish it.

## motion restoration and systems refinement / november 13, 2026

- objective: restore the line-to-cell scroll sequence at the owner's Safari viewport while keeping the full source above the grid, and make the public systems pages easier to understand and inspect.
- source: the owner's feedback after the stacked study was published; the pinned implementation excerpt, computed reference case, public systems data contract, and existing style guide remain authoritative.
- requirements: keep the code visible, make the current statement and its physical face distinct from completed steps, retain cumulative records and reverse scroll, and show systems data freshness and unavailable states without invented readings.
- exclusions: no changes to the solver calculation, unpublished reports, private admin operations, or fabricated systems telemetry.
- result: compact desktop spacing restores the pinned study at 2048 × 1028 and 1280 × 900 without reducing source type. the grid arrives before the traveling source copies; the current line and face share the accent, and completed faces and the six-step record remain visible. the systems index is now a four-record reading path; reported panels appear only for actual API values, with source and time shown beside the readings. unavailable, empty, and historical responses have distinct notices. private admin details remain outside the public pages.
- validation: all seven numerical tests and the Astro check/build pass with zero diagnostics. built-preview checks at 2048 × 1028 confirmed source visibility, grid below code, ordered line-to-face motion, reverse scroll, and the final field. mobile 390px checks covered unavailable and mocked dated snapshots on the index and a detail route, with no page errors or horizontal overflow. shorter windows and reduced motion retain static reading paths.
- limitation: the external systems API returned a proxy 403 from this workspace, so the live production payload could not be inspected; local checks used representative API fixtures. the short desktop treatment keeps the study label visible while hiding the longer introduction visually; that introduction remains available to assistive technology.
- next action: review the focused pull request and publish the correction.

## local workflow

```sh
npm ci
npm run dev
npm run build
```

use node.js >=22.12.0. the dev server defaults to `http://localhost:4321/`. the production build runs astro diagnostics before writing static output to `dist/`.

before publishing a visual change, check at least:

```sh
npm test
npm run build
```

then smoke test `/`, `/work`, `/resume`, `/notes`, the project pages, `/systems`, and a missing route locally. check project filters, forward/reverse scrolling through all six code statements, selecting code lines by mouse and keyboard, theme persistence, and mobile layouts. with reduced motion or JavaScript disabled, the code, annotated cell, and final reference field remain readable in normal flow. `npm run preview` serves the built output for a production smoke test.

project data lives in `src/data/portfolio.ts`. the homepage, work index, project pages, and technical profile share these records so titles, tooling, and publication status stay consistent. method and available-material summaries replace decorative project icons. add verified artifacts before promoting project results or planned capabilities to demonstrated claims.

the homepage and solver overview show an actual excerpt from `code/advect_noAMR/src/advance.cpp` in `urmom6009/thesis-updated`, pinned to revision `8f1f6c867c39197c2146b21efce41b947fde296d` (lines 48–57). `src/data/solverImplementation.ts` stores the source location and excerpt; only leading indentation is removed. the feature identifies the current implementation as single-level, with adaptive refinement still planned. the detailed project excerpt stays static.

on the homepage, the source block stays visible and each nonempty line also has a separate moving copy below it. the four flux statements move, rotate, and compress into their measured cell faces: `Fx_lo` left, `Fx_hi` right, `Fy_lo` bottom, and `Fy_hi` top. `dtdivF` and `new_fab` move into the cell interior before the actual balance and updated average appear. the assembled cell shrinks into its measured location in the 64 × 64 field, dissolving as the computed scalar field appears and advances. reverse scrolling reconstructs the cell sequence. the `pause motion` control or keyboard focus opens direct inspection; native line buttons select the corresponding explanation without precise scrolling.

`src/lib/advection.ts` transports an illustrative Gaussian scalar on a 64 × 64 unit-square periodic grid with prescribed velocity `(1, 0.5)`, CFL `0.3`, and final dimensionless time `0.5`. both velocity components are nonzero so all four face fluxes have a visible contribution. the Gaussian starts at `(0.25, 0.5)` with width `0.075`. the cell explanation inspects `(i, j) = (21, 35)` at `t = 0`, with timestep `0.003125`. `inspectCell` computes the displayed fluxes, divergence contribution, and updated average; tests compare its results against the complete field kernel for every cell and both velocity signs.

the final field view interpolates computed states, beginning with the exact first update shown in the cell explanation. this is a separate reference calculation, not a saved thesis run or a claim of thesis validation. the C++ binary is not executed by the website. `npm test` also checks periodic wrapping, mass conservation, bounds, flux signs, nonzero contributions on both axes, and rejection of unstable timesteps.

`ImplementationExcerpt.astro`, `CellFluxView.astro`, `AdvectionView.astro`, and `src/scripts/implementationScroll.ts` own the bounded scroll presentation. `src/scripts/codeMorph.ts` measures the source lines, SVG faces, and field location after font loading and on resize, then moves inert, aria-hidden copies of the original text. step metadata is in `src/data/implementationSteps.ts`. passive scroll events schedule one animation-frame update per event cycle; reduced-motion preference changes and short viewports use the static reading layout. keyboard focus on the canonical source opens the reading view and selects the matching explanation.

local astro does not apply the vercel telemetry rewrite. `/systems` shows unavailable indicators when the public api does not answer; it does not substitute sample measurements. missing fields in an api response remain unavailable.

## sitewide visual system

the durable identity rules live in [`docs/style-guide.md`](docs/style-guide.md). all pages should inherit the homepage's editorial technical-record language: oversized PP Neue Montreal headlines, IBM Plex Mono technical labels, hard horizontal rules, open detail rows, and aerospace evidence as the subject. decorative marks should survive only when they explain the work. secondary pages should not feel like neutral placeholders, but they also should not turn into grids of generic cards. give each route a clear main idea, one supporting technical aside, and index/action rows that use the same rule-based behavior as selected work.

when adding a new route, start by choosing its page role, then map the visual details to that role:

1. header: use the first viewport to state the route's main idea, not a generic label.
2. detail panel: add one framed aside that explains the current state, priority, or missing artifact.
3. index rows: use ruled rows or cells for links so the page feels built, not boxed.
4. background marks: reuse datum lines, mesh hints, and sweep paths only when they support the page's technical context.
5. copy voice: keep source copy lowercase, direct, low-repetition, and aimed at technical collaborators who can inspect the work.

## homepage intention guide

the audience is aerospace and engineering teams. lead with a clear identity and area of focus, then make the work easy to explore.

1. preserve the warm paper, restrained green accents, oversized pp neue montreal type, ibm plex mono labels, and hard horizontal rules.
2. let actual implementation and verified artifacts carry the visual weight. show the source file and revision for excerpts; give reference calculations their case parameters and provenance. avoid decorative flow diagrams or presenting a reference case as a thesis result.
3. keep selected work ahead of supporting interests and make publication status easy to find.
4. give each project its question, current scope, approach, and available evidence. distinguish future methods from current capabilities.
5. keep content readable without javascript or required animation. the homepage has one short, reversible pinned study; reduced motion and short viewports show both complete views in ordinary flow.
6. check desktop and mobile layouts in both themes, with reduced motion and keyboard access. contact and project links should remain easy to find.

## notes and logs

create a new repo-aware log from this repository:

```sh
npm run new:log -- "first deploy"
```

the log generator can also be called from any git repository:

```sh
portfolio-log "amrex build notes"
```

the global wrapper above lives at `/Users/colinvargas/.local/bin/portfolio-log`. the underlying repo script is:

```sh
node /Users/colinvargas/dev/colinvargas.com/scripts/new-log.mjs "amrex build notes"
```

it infers the current repository name, remote, branch, and commit; creates a markdown file in `src/content/logs/`; creates a matching attachment folder in `public/attachments/logs/`; prepopulates frontmatter; and opens the file in `$VISUAL`, `$EDITOR`, or `nvim`.

use `--no-edit` to create the file without opening an editor.

## deployment

this repo is linked to the vercel project `urmom6009s-projects/colinvargas.com`.

current production deployment:

- `https://colinvargas.com`
- `https://www.colinvargas.com`

vercel also creates a per-deployment preview url for each production publish.

cloudflare dns for the domain is configured with dns-only `a` records:

- `colinvargas.com -> 76.76.21.21`
- `www.colinvargas.com -> 76.76.21.21`

before deploying future changes, run `npm run build`. use `npx vercel deploy --prod` when the build is ready to publish.

`/systems/api/public` is rewritten by Vercel to `https://systems-api.urmom.systems/api/public`.
that hostname should expose only sanitized, read-only systems data. restart
controls, hostnames, peer names, raw logs, and host-level details belong on the
separate private admin endpoint.
