# colinvargas.com

astro portfolio site for `colinvargas.com`.

## site structure

- `/` is the live editorial portfolio homepage.
- `/work` is a filterable project index. `/work/adaptive-cfd-solver`, `/work/scramjet-analysis-tool`, and `/work/compressible-flow-project` explain project scope, approach, and publication status. the last url is retained for the mixing chamber analysis project.
- `/work/portfolio-and-technical-logs` describes this site and its repository-aware logging workflow, with a link to the public source.
- `/notes` explains that there are currently no public notes. draft entries remain private and are not rendered into pages.
- `/systems` is the public systems readout. it renders sanitized, read-only telemetry and falls back cleanly if the live API route is unavailable.
- `/sysadmin` and its four detail urls redirect to their corresponding `/systems` pages for existing bookmarks.
- `/resume` is a printable, project-based technical profile summarizing focus areas, project experience, and public contact links.
- `/404` provides a styled fallback for unpublished or missing pages.

## local workflow

```sh
npm ci
npm run dev
npm run build
```

use node.js >=22.12.0. the dev server defaults to `http://localhost:4321/`. the production build runs astro diagnostics before writing static output to `dist/`.

before publishing a visual change, check at least:

```sh
npm run build
```

then smoke test `/`, `/work`, `/resume`, `/notes`, the project pages, `/systems`, and a missing route locally. check project filters, mesh view controls, theme persistence, keyboard access, and mobile layouts. `npm run preview` serves the built output for a production smoke test.

project data lives in `src/data/portfolio.ts`. the homepage, work index, project pages, and technical profile share these records so titles, tooling, and publication status stay consistent. diagrams are labeled as concepts; they are not solver output or performance evidence. add verified artifacts before promoting project results or planned capabilities to demonstrated claims.

local astro does not apply the vercel telemetry rewrite. `/systems` labels fallback values as sample data, never as current service health. missing fields in an api response do not inherit sample measurements.

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

1. preserve the warm paper, dark green technical figures, oversized pp neue montreal type, ibm plex mono labels, and hard horizontal rules.
2. use the mesh control to explain local refinement. its concept label must remain visible; do not imply that it is a running solver.
3. keep selected work ahead of supporting interests and make publication status easy to find.
4. give each project its question, current scope, approach, and available evidence. distinguish future methods from current capabilities.
5. keep content in ordinary document flow, readable without javascript and without requiring scroll animations. interactive controls progressively enhance that content.
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
