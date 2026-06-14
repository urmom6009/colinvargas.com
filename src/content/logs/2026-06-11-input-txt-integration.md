---
title: "input.txt integration"
date: 2026-06-11
project: "Thesis - advect_noAMR"
repo: "thesis-updated"
repoPath: "/Users/colinvargas/Documents/school/Masters/thesis-updated"
remote: "git@github.com:urmom6009/thesis-updated.git"
branch: "main"
commit: "b5ef5a5"
tags: ["thesis", "no-amr", "advection", "nit-picking"]
summary: "on actually using the inputs.txt file for what it was meant for."
draft: true
attachmentDir: "/attachments/logs/2026-06-11-input-txt-integration/"
attachments: []
---

## Context

- Prior to these updates made a few days ago, the upwind advection scheme was ran using `mpiexec ./advect_noAMR -n 4`.
  This was all well and good but the program would run with just a default half period, rightward initial velocity. The hope was that changing the inputs file to a time that was at least twice the value of the default would exhibit the behavior expected. Namely -- the "blob" would return to nearly the exact same position with a slightly elliptical shape in the x-axis proving that the concentration or whatever scalar was being advected was "spreading" so to speak within the domain and that this would be the expectation after exactly one computational domain length was covered by the Gaussian blob.

## Log

- After forgetting that the inputs file can simply be pointed to following the executable directory and a humbling conversation with the debugger trying to figure out why it was not reading my inputs file, successful runs were produced with the expected behavior and desired simulation runtime extension.

## Artifacts

- Add files to `/Users/colinvargas/dev/colinvargas.com/public/attachments/logs/2026-06-11-input-txt-integration` and reference them from `/attachments/logs/2026-06-11-input-txt-integration/`.
