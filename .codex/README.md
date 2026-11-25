# Cloud development setup

Use Node 24 and npm for this repository's Codex environment. Set the setup
command to `bash .codex/setup.sh` and enable package registry access during
installation. The setup script installs the dependency versions recorded in
`package-lock.json`. Refresh the environment setup when that file changes.

Run `bash .codex/validate.sh` to execute the numerical tests, Astro diagnostics,
and static build. For browser checks, start the built site with
`npm run preview -- --host 0.0.0.0` and follow the routes and interactions in
the root README.

Keep the cloud environment scoped to this public repository. Installation and
validation run independently of Vercel deployment, private systems, and the
owner's local log-authoring tools.
