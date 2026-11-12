# Changelog

## Unreleased

### Monogram and code-to-physics scroll study — November 11, 2026

- Objective: refine the top-left logo and let the code excerpt transition into its physical meaning as the reader scrolls, retaining the approved restrained portfolio style.
- Requirements: a coherent header/favicon mark; a short, reversible scroll transition from the actual C++ excerpt into a computed periodic scalar-advection field; explicit reference-case provenance; normal page navigation and a readable reduced-motion/no-JavaScript presentation.
- Exclusions: invented thesis results, a new AMR or fluid-momentum claim, deployment, and environment configuration changes.
- Acceptance: Astro check/build; numerical checks for the reference update; desktop/mobile scroll, keyboard, theme, reduced-motion, and no-JavaScript browser checks; visual review of both transition states.
- Decisions: use the displayed first-order upwind flux/update for a small browser reference case. identify it as a reference calculation rather than a saved thesis run. keep the detailed project excerpt static.
- Result: replaced the framed text badge with a balanced two-stroke monogram and matching favicon. the homepage now transitions the exact code excerpt into a computed scalar field as the reader scrolls; reversing scroll restores the code. one short pinned study releases into the project list. the detailed project excerpt remains static.
- Validation: all five numerical tests passed, and `npm run build` passed with zero errors, warnings, or hints. browser checks passed in 14 viewport/theme combinations (ten animated studies and four compact static fallbacks), including intermediate field movement, source focus, reverse scrolling, normal page release, live reduced-motion changes, no JavaScript, theme updates, project filters, and matching header/favicon paths. no uncaught JavaScript errors occurred. captured a short MP4 of the completed transition.
- Limits: the field is a separate reference calculation using the displayed update and an illustrative Gaussian initial condition; the C++ thesis binary was not run. reduced motion and insufficient viewport height deliberately show both complete views without animation. nothing was pushed, deployed, or published.
- Next action: review the local motion preview and refined logo.

### Refine the graphics — November 11, 2026

- Objective: preserve the approved portfolio layout while replacing schematic decoration with a quieter presentation of actual capability.
- Requirements: remove generic project pictograms and the simulated refinement control; use concrete methods and source-backed implementation detail; retain responsive layouts and publication boundaries.
- Exclusions: invented simulation results, performance claims, a new solver demonstration presented as thesis work, deployment, and environment changes.
- Acceptance: Astro check/build, desktop/mobile visual inspection in both themes, functional project filtering/navigation, and no decorative graphics presented as project output.
- Decision: use an actual implementation excerpt, as selected by the user. inspected the thesis solver at revision `8f1f6c867c39197c2146b21efce41b947fde296d`; the excerpt is from `code/advect_noAMR/src/advance.cpp`, lines 48–57.
- Result: removed the refinement toggle, glowing field, and generic mesh/engine/flow pictograms. the homepage and solver page now show the actual C++ flux/update excerpt with its source revision. project rows and detail pages present concrete method and available-material summaries. the approved page structure and typography remain intact.
- Validation: `npm run build` passed with zero errors, warnings, or hints. the rendered excerpt matches the pinned source after dedenting. built-site browser checks passed for 48 page/viewport/theme combinations, project links, keyboard filters, source focus, theme persistence, and content without JavaScript; development smoke checks also passed. no uncaught JavaScript errors occurred.
- Limits: the C++ source was inspected, not rebuilt or executed in this website task. the feature makes no new convergence, performance, or validation claim. no deployment or publication was performed.
- Next action: review this local refinement; use documented run artifacts if adding numerical figures later.

### Portfolio refresh — November 11, 2026

- Objective: make the portfolio engaging and credible for aerospace and engineering teams, based on the existing repository's project descriptions.
- Requirements: retain the editorial visual identity; prioritize selected work; distinguish current scope, planned methods, and unpublished results; provide useful project overviews and consistent contact/navigation.
- Exclusions: invented performance claims, publication of draft logs, new employment/education claims, deployment, and environment configuration changes.
- Acceptance: passing Astro check/build; desktop/mobile and keyboard smoke checks; working project and navigation links; legible light/dark themes and reduced-motion/no-JavaScript content; explicitly identified illustrative diagrams and telemetry fallback.
- Open decisions: additional project reports/results require owner-supplied artifacts; existing homepage descriptions take precedence where older pages disagree about project scope/tooling.
- Result: replaced the homepage with a clear aerospace focus, an interactive mesh concept, prominent selected-work rows, supporting interests, and a direct contact section. added shared project records, four structured project overviews, keyboard-accessible project filters, a printable technical profile, consistent navigation/contact information, social metadata, and a favicon.
- Reliability: restored `/systems` and its detail pages, retained `/sysadmin` compatibility redirects, and labeled sample telemetry explicitly. partial live responses no longer inherit sample measurements. draft notes remain unpublished.
- Validation: `npm run build` passed with zero errors, warnings, or hints and generated 21 static pages. browser checks passed against both development and built preview: 15 canonical pages/internal link targets, five legacy redirects, a custom 404, keyboard mesh/filter controls, skip-link focus, theme persistence/system preferences, invalid/partial telemetry responses, 50 responsive page checks across 320–1440px, reduced motion, and five pages without JavaScript. inspected desktop/mobile and light/dark screenshots; checked that generated assets exclude draft-note content and private repository paths.
- Limitations: numerical reports/results were not supplied, and live production telemetry/deployment were not tested. no deployment, environment configuration update, push, or publication was performed.
- Next action: review the portfolio and attach verified project reports, figures, or source releases before expanding its results claims.

- Documented the planning-to-implementation handoff, authoritative sources, worktree discipline, and verification closeout in `AI-WORKFLOW.md` and `AGENTS.md`.

- Refined the portfolio identity into a sharper editorial technical record with self-hosted IBM Plex Mono accents, fewer decorative card surfaces, stronger statement plates, rule-based motion, route-wide clipping safeguards, updated purpose copy, and a reusable style guide.
- Updated Astro dependency tooling and pinned patched transitive packages to clear Dependabot advisories for `esbuild` and YAML language-service dependencies.
- Cleaned up the public systems pages with calmer dashboard styling, read-only telemetry language, and a clearer private admin endpoint boundary.
- Raised inactive scroll-card contrast and trimmed slogan-like copy so previously revealed content stays readable across the site.
- Extended the in-flow scroll-scene treatment to secondary pages and moved the footer into a shared ribbon with a footer-aware theme toggle.
- Reworked homepage scroll scenes so staged cards stay in-flow, section-specific, and visually separated instead of overlapping in one stacked layer.
- Extended the scroll-scene behavior to secondary pages so resume, work, notes, contact, about, and project pages use bounded staged sections.
- Reframed homepage scroll chapters as viewport-sized scenes with sticky headlines and layered detail cards that scale to the window.
- Moved the scroll scene treatment into the shared layout while preserving the stacked homepage and index layouts so staged sections stay readable.
- Softened homepage scene transitions by removing hard story-section bands and keeping only subtle continuous field lines.
- Retimed homepage scroll scenes so section ideas land before details, with each active detail receiving a spotlight state until the next reveal.
- Extended the homepage specimen language across secondary pages with shared background marks, framed page asides, card-like indexes, and lowercase source copy.
- Tightened the homepage nav, scroll-stage chapter behavior, copy voice, and README guidance for more intentional visual details.
- Refined the homepage with sticky scroll chapters, a hero-level current focus block, selected-work cards, full-width frosted navigation, intentional background marks, and sitewide lowercase styling.
- Reworked the homepage into a bold type-specimen scroll experience with organic reveal sections instead of click-gated drawers.
- Reduced always-visible homepage instrumentation with closed drawers, quieter navigation, and scroll/hover reveal behavior.
- Warmed the jet-age visual system, made navigation sticky with a light shadow, and added a minimal hidden field-notes interaction.
- Added build-time KaTeX equation rendering, heavier PP Neue Montreal hero treatment, and a slightly more personal statement of visual taste.
- Refreshed the site voice and visual system around evidence-first aerospace software, visible reasoning, and a more personal technical brand.
- Added intentional homepage interactions for the solver lab, project cards, and trajectory map.
- Added persistent light/dark theme support, frosted surfaces, and a sharper homepage signal panel.
- Added a solver readout and trajectory band to give the homepage a richer technical layer.
- Added an interactive navigation treatment with hover motion, active-state markers, and a `resume` destination.
- Refined the homepage hero line and tagline scale for a more compact first impression.
- Added `/resume` as a linkable project/work index with capabilities and public contact links.
- Refined the homepage design system with cleaner typography, calmer accents, stronger project status language, and a working-style section.
- Added intentional pending pages for the three selected work routes.
- Added a pending notes index and styled 404 page for unpublished pages.
- Documented the current site structure, stable production domains, and local visual smoke-test workflow in `README.md`.
- Added a repo-aware log generator that creates prefilled Markdown notes and matching attachment folders.
- Added an Astro content collection schema for future public log pages.
- Deployed the Astro portfolio to Vercel production.
- Added `colinvargas.com` and `www.colinvargas.com` as Vercel aliases and pointed Cloudflare DNS at Vercel.
- Documented the local build and deployment workflow in `README.md`.
- Set up the project as a minimal Astro site ready for Vercel.
- Added the first editorial portfolio homepage with PP Neue Montreal typography, sparse geometric accents, selected work, current focus, notes, about, and contact sections.
