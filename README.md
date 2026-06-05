# colinvargas.com

astro portfolio site for `colinvargas.com`.

## site structure

- `/` is the live editorial portfolio homepage.
- `/work/adaptive-cfd-solver`, `/work/scramjet-analysis-tool`, and `/work/compressible-flow-project` are intentional pending project pages until the full case studies are ready.
- `/notes` is an intentional pending notes index while public logs are being assembled.
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

all pages should inherit the homepage's specimen language: full-width frosted navigation, lowercase type, quiet mesh/grid backgrounds, intentional aerospace marks, oversized topic headers, and framed detail panels. secondary pages should not feel like neutral placeholders. give each route a clear main idea, one supporting detail card, and index/action cells that use the same border, grid, and shadow behavior as selected work.

when adding a new route, start by choosing its page role, then map the visual details to that role:

1. header: use the first viewport to state the route's main idea, not a generic label.
2. detail panel: add one framed aside that explains the current state, priority, or missing artifact.
3. index cards: use card-like rows or cells for links so the page feels built, not listed.
4. background marks: reuse datum lines, mesh hints, sweep paths, and trace geometry only when they support the page's technical context.
5. copy voice: keep source copy lowercase, direct, low-repetition, and mostly impersonal.

## homepage intention guide

the homepage should feel like a staged technical specimen, not a list of panels. use this sequence when adding or changing visual details:

1. name the section role first: topic, proof, record, trajectory, or contact path.
2. give every visual element a job: equation, grid, line, card, meter, or status should clarify a real engineering habit.
3. stage the scroll: big idea first, then one detail, then another, then a complete view worth pausing on.
4. avoid repeated claims. if a section already says "evidence," the details should show evidence rather than restating the word.
5. keep background marks intentional: use datum lines, mesh hints, sweep paths, and readout geometry tied to aerospace or numerical work.
6. check the completed state of each chapter. the final view of a section should look composed, not like unrelated items happened to scroll into frame.
7. keep copy lowercase, direct, and mostly impersonal. prefer project behavior and evidence over first-person explanation.

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
