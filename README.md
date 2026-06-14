# colinvargas.com

astro portfolio site for `colinvargas.com`.

## site structure

- `/` is the live editorial portfolio homepage.
- `/work/adaptive-cfd-solver`, `/work/scramjet-analysis-tool`, and `/work/compressible-flow-project` are intentional pending project pages until the full case studies are ready.
- `/notes` is an intentional pending notes index while public logs are being assembled.
- `/systems` is the public systems readout. it renders sanitized, read-only telemetry and falls back cleanly if the live API route is unavailable.
- `/resume` is a linkable resume-style work index summarizing projects, capabilities, and public contact links.
- `/404` provides a styled fallback for unpublished or missing pages.

## local workflow

```sh
npm install
npm run dev
npm run build
```

the dev server defaults to `http://localhost:4321/`. the production build writes static output to `dist/`.

before publishing a visual change, check at least:

```sh
npm run build
```

then smoke test `/`, `/resume`, `/notes`, one `/work/...` page, and a missing route locally.

## sitewide visual system

the durable identity rules live in [`docs/style-guide.md`](docs/style-guide.md). all pages should inherit the homepage's editorial technical-record language: oversized PP Neue Montreal headlines, IBM Plex Mono technical labels, hard horizontal rules, open detail rows, and aerospace evidence as the subject. decorative marks should survive only when they explain the work. secondary pages should not feel like neutral placeholders, but they also should not turn into grids of generic cards. give each route a clear main idea, one supporting technical aside, and index/action rows that use the same rule-based behavior as selected work.

when adding a new route, start by choosing its page role, then map the visual details to that role:

1. header: use the first viewport to state the route's main idea, not a generic label.
2. detail panel: add one framed aside that explains the current state, priority, or missing artifact.
3. index rows: use ruled rows or cells for links so the page feels built, not boxed.
4. background marks: reuse datum lines, mesh hints, and sweep paths only when they support the page's technical context.
5. copy voice: keep source copy lowercase, direct, low-repetition, and aimed at technical collaborators who can inspect the work.

## homepage intention guide

the homepage should feel like a staged editorial record for aerospace work, not a list of panels. use this sequence when adding or changing visual details:

1. name the section role first: topic, proof, record, trajectory, or contact path.
2. give every visual element a job: equation, grid, line, meter, or status should clarify a real engineering habit.
3. stage the scroll: big idea first, then one detail, then another, then a complete view worth pausing on.
4. avoid repeated claims. if a section already says "evidence," the details should show evidence rather than restating the word.
5. keep background marks intentional: use datum lines, mesh hints, sweep paths, and readout geometry only when tied to aerospace or numerical work.
6. check the completed state of each chapter. the final view of a section should look composed, not like unrelated items happened to scroll into frame.
7. keep copy lowercase, direct, and mostly impersonal. prefer project behavior, assumptions, verification, and reusable records over first-person explanation.

when reviewing the page locally, scroll each chapter slowly and check for: clear topic arrival, staged detail reveal, complete-section pause, clean exit, and obvious handoff into the next section.

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
