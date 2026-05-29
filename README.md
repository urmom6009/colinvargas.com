# colinvargas.com

Astro portfolio site for `colinvargas.com`.

## Local Workflow

```sh
npm install
npm run dev
npm run build
```

The dev server defaults to `http://localhost:4321/`. The production build writes static output to `dist/`.

## Notes and Logs

Create a new repo-aware log from this repository:

```sh
npm run new:log -- "first deploy"
```

The log generator can also be called from any Git repository:

```sh
portfolio-log "amrex build notes"
```

The global wrapper above lives at `/Users/colinvargas/.local/bin/portfolio-log`. The underlying repo script is:

```sh
node /Users/colinvargas/dev/colinvargas.com/scripts/new-log.mjs "amrex build notes"
```

It infers the current repository name, remote, branch, and commit; creates a Markdown file in `src/content/logs/`; creates a matching attachment folder in `public/attachments/logs/`; prepopulates frontmatter; and opens the file in `$VISUAL`, `$EDITOR`, or `nvim`.

Use `--no-edit` to create the file without opening an editor.

## Deployment

This repo is linked to the Vercel project `urmom6009s-projects/colinvargas.com`.

Current production deployment:

- `https://colinvargas.com`
- `https://www.colinvargas.com`
- `https://colinvargas-8du3zcvk0-urmom6009s-projects.vercel.app`

Cloudflare DNS for the domain is configured with DNS-only `A` records:

- `colinvargas.com -> 76.76.21.21`
- `www.colinvargas.com -> 76.76.21.21`

Before deploying future changes, run `npm run build`. Use `npx vercel deploy --prod` when the build is ready to publish.
