#!/usr/bin/env bash
set -euo pipefail
repo_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"
command -v node >/dev/null || { echo "node is required; select Node 24." >&2; exit 1; }
command -v npm >/dev/null || { echo "npm is required." >&2; exit 1; }
# Fail on incompatible runtimes without changing the lockfile.
npm ci --engine-strict --no-audit --no-fund
