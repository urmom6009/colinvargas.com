# Portfolio: AI workflow

Engineering identity: https://github.com/urmom6009/colinvargas.com. Read `README.md` and `docs/style-guide.md`; retain the existing visual direction. Treat unpublished case studies and planned capabilities as unfinished. Publishing is separate from a successful local build.

## Working agreement

Use one planning home per outcome and one implementation task per bounded change.
ChatGPT is the planning/research home when a matching project exists. Its files and
chat history do not automatically synchronize with this workspace.

Before implementation, read the existing project instructions and authoritative
specification. Record the objective, requirements, exclusions, acceptance checks,
unresolved decisions, and one next action in an existing issue or project document.
Do not create a duplicate roadmap when one already exists. An exploratory idea is
not an approved implementation milestone.

For software, the repository and its GitHub issues/PRs hold engineering truth.
Use existing Notion records for non-code commitments and cross-project coordination
when available, linking engineering records instead of duplicating their contents.
Keep ClickUp as a read-only historical reference. If a source is unavailable, say
so and use a dated handoff; never imply that an upload or chat is live-synchronized.

## Workspace and worktree discipline

Confirm the host, repository root, branch/commit, working-tree changes, and existing
worktrees before edits. Preserve unrelated edits and staged files. Prefer an isolated
worktree for an independent code change; never switch, reset, merge, or clean another
task's checkout merely to align it with this workflow. Multiple checkouts share
history through Git, not by copying application files. Worktrees created from older
commits may lack these instructions: include the workflow reference in the task
handoff, and integrate documentation through a reviewed Git change when appropriate.

Remote describes where work runs. Use the existing remote project for Linux/server
work and the Mac checkout when macOS testing is required. Do not create extra projects
or permanent worktrees for every milestone. For non-Git folders, use a distinct
output directory and preserve original documents; Git operations do not apply.

## Completion and return handoff

Run checks appropriate to the actual change. Report exactly what was verified and
what remains unverified; build success does not prove deployment or user workflows.
Update the existing changelog/status document when warranted. Stage only task-owned
files and make a focused commit when safe; leave unrelated staged work untouched.
Do not push, publish, restart services, submit applications, or widen permissions
merely as part of an organizational/documentation task.

Return: source issue/specification; host and branch/commit or PR; changed behavior or
artifact; checks and results; limitations; unresolved decisions; one next action.
Bring this evidence back to the planning home before defining the next milestone.
Archive a completed conversation only after useful decisions are preserved and the
user's archival intent is clear. Keep active outcomes limited to three across the
whole system; a local and remote checkout of one outcome count as the same outcome.

## Handoff template

- Outcome and authoritative source:
- Target workspace/host and branch or source version:
- Requirements and exclusions:
- Acceptance checks:
- Open decisions:
- Result, checks run, and commit/PR or output:
- Remaining limitations and next action:
