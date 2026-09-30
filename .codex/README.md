# cloud development setup

These commands prepare the repository; they do not create or publish a Codex Cloud environment.

In Settings > Codex Cloud > Environments, create or edit an environment containing only this repository. Ask setup to use the commands below, review its report, then publish after checks pass. Keep access set to Only me. New tasks use the published setup. Repository refresh does not rerun installation; republish after dependency changes requiring new packages or tools.

Use package-manager network access for installation. Do not add deployment credentials, production bindings, VPN access, homelab mounts, or source from other projects. Read the root AGENTS.md privacy boundary before assigning work.

See [the official OpenAI cloud environments guide](https://learn.chatgpt.com/docs/environments/cloud-environments).

## commands

Use Node 24 with npm. The checked-in lockfile is authoritative.

Install: `bash .codex/setup.sh`

Validate: `bash .codex/validate.sh`

For a task needing the development server: `npm run dev -- --host 0.0.0.0`. Stop it after the check. Do not run deployment commands.

The build performs Astro diagnostics and the static build. After UI changes, also check /, /resume, /notes, an existing /work route, and a missing route in local preview. A build alone is not visual verification.
