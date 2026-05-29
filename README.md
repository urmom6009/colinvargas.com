# colinvargas.com

Astro portfolio site for `colinvargas.com`.

## Local Workflow

```sh
npm install
npm run dev
npm run build
```

The dev server defaults to `http://localhost:4321/`. The production build writes static output to `dist/`.

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
