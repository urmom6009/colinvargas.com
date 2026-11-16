# colinvargas.com style guide

## purpose

`colinvargas.com` is a public record of aerospace software, numerical experiments, and project notes built so the reasoning can be reopened.

The site should feel like an editorial technical record: large type, hard rules, restrained copy, visible equations, solver records, and enough interface detail to make the work inspectable. If a visual mark does not explain the work, remove it.

## visual thesis

Use PP Neue Montreal with the confidence of a foundry page, not as a generic portfolio font. The reference point is behavior and structure: oversized grotesque headlines, horizontal dividers, compact labels, masked reveals, and confident empty space.

The aerospace layer supplies the content: equations, solver states, verification notes, trajectory maps, case records, and project evidence. Do not replace that with generic portfolio decoration or mimic a type foundry page so closely that the work disappears.

## type roles

- PP Neue Montreal is the identity face. Use it for names, section ideas, large project titles, and the main reading voice.
- IBM Plex Mono is the technical accent. Use it for labels, metadata, tags, captions, logs, nav, footer readouts, and status text.
- Keep source copy lowercase unless a technical term, proper noun, code token, or equation needs its native casing.
- Prefer fewer, larger type moments over many small panels competing for attention.
- Use the technical record as the specimen: equations, logs, solver limits, and project evidence are the subject.

## color and surface

- Warm paper and ink remain the base system.
- Teal is the primary technical accent. Red is signal/limit/attention. Gold is secondary measurement or trajectory.
- Use stronger color sparingly for high-impact editorial moments. The page should feel printed and deliberate, not themed or loud.
- Favor hard horizontal rules, square plates, and open rows over soft cards, heavy shadows, or decorative blobs.
- Keep one strong field or statement plate per page at most. The rest of the page should rely on type, rules, and evidence.

## copy voice

- Write for technical collaborators who can inspect the work.
- Center records, assumptions, methods, verification, and reusable notes.
- Avoid slogan loops. If a section already says the work is inspectable, the details should show what makes it inspectable.
- Keep supporting copy short enough to scan in one pass.

## page patterns

- Homepage sections are editorial plates: one large idea, one technical surface, one clear reason to exist. selected work follows the identity section, before approach and supporting interests.
- Secondary pages use `page-intro`, readable overviews, and ruled action/index rows. retain `page-scene` only for the existing systems readouts; all content stays in normal document flow.
- Systems pages may be denser, but they should still use restrained labels, clear boundaries, and public-safe summaries.
- New routes should start with the record being exposed: project, note, system, or contact path. Do not start with generic portfolio filler.

## evidence and interactions

- Project titles, tools, scope, and status come from `src/data/portfolio.ts`. do not duplicate them in route-local arrays.
- Lead with actual implementation or verified artifacts. the solver feature quotes a pinned source revision, with the file and revision recorded; statements remain unchanged apart from leading indentation.
- Use real figures with units, setup, and provenance when numerical results become available. do not substitute stock geometry, decorative flow lines, or a pretend refinement control for project evidence.
- Planned methods, unpublished reports, and draft logs are not completed public evidence. current project pages are overviews, with the publication status stated explicitly.
- Project rows present the method and material available to inspect. project filters use native buttons with pressed states and an announced count.
- Without javascript, all project rows and implementation excerpts remain visible; enhancement-only controls remain hidden.
- The homepage can connect the source to a computed physical representation. identify the calculation, grid, prescribed velocity, boundary conditions, and time. distinguish a reference case from a saved thesis result; never use an invented shape as numerical output.
- The brand mark is a small abstract pair of offset solid planes, shared between the header and favicon. keep its clear negative space and restrained accent; do not add letterforms, a badge frame, or technical ornament.

## motion

- Keep all information visible without requiring animation.
- Use small color changes and arrow motion for links. detailed project excerpts stay still. the homepage source, annotated cell, and computed field also stay in normal flow. one brief entrance may introduce the study; direct code-line selection highlights the matching face and measured value.
- Avoid blur-heavy reveals, hover lifts, traveling source copies, and sticky scenes that stretch a short page over several viewports.
- Preserve reduced-motion behavior and visible keyboard focus.
- With reduced motion or without JavaScript, show the code, annotated cell, and computed final field without an entrance. native code-line buttons provide keyboard and pointer inspection when JavaScript is available; scrolling does not change the selected line.
