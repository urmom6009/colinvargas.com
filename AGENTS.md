# project instructions

## scope and architecture

Public Astro portfolio. Routes live in src/pages; shared layouts in src/layouts; static files in public. Read docs/style-guide.md before visual changes. Preserve the existing editorial design, lowercase copy, and sanitized read-only systems endpoint. Private infrastructure details and control actions must not enter this repository.

## setup and validation

Use a current Node runtime compatible with the checked-in Astro version. If package-lock.json exists, install with npm ci; otherwise use npm install and review dependency changes. Run npm run build (astro check followed by astro build). For route/UI changes, smoke test /, /resume, /notes, one /work route, and a missing route. Do not claim those checks passed unless executed.

The existing Vercel deployment remains authoritative. Cloud setup must not run npx vercel deploy --prod or connect production credentials. Use npm run new:log -- "title" from the repository; the absolute /Users/colinvargas paths in the README describe optional local wrappers, not cloud prerequisites.

## privacy boundary

This repository is eligible for GitHub + cloud Codex development only for its existing noncommercial scope. Do not import commercial or proprietary implementations, unpublished thesis/research, customer data, production logs, credentials, or material from other repositories. If a task introduces potentially commercial or proprietary work, stop cloud work on that material and keep its source and execution on the owner's local/self-hosted system. A private GitHub repository is still cloud storage. Never change repository visibility or publish/deploy as part of a development task without that task authorizing it.

## working process

Read repository and nested AGENTS.md instructions before edits. Use a dedicated branch and a pull request. Keep existing deployment targets and git history. Do not combine legacy repositories or infer that a similarly named repository is obsolete. Keep secrets in the appropriate runtime secret store; examples must contain placeholders. Report checks actually run and any environment limitations. Do not fabricate validation.
