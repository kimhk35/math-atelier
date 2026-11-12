# McKay Math Atelier

Production website: https://atelier.mathmckay.kr/

This repository preserves the complete static source recovered from the production deployment on 2026-11-12 and adds six Advanced Mathematics experiments.

## Build

Run `npm run build`. The build extracts `site-source.tar.gz` into `public` and verifies every file against `source-manifest.json`. Vercel publishes `public` using the existing project.

The archive is a transport format for the recovered static site. Extract it to inspect or edit the HTML and JavaScript. Rebuild the archive and SHA-256 manifest together after changes. No dependencies or secrets are required.

## Added routes

- `/#/list?grade=18`: Advanced Mathematics course with three units
- `/advanced-math/`: six interactive experiments
- `/#/lab/advanced-linear` and the other five experiment routes are shareable through the normal catalog

The update preserves the existing 1029 experiments and adds six new experiments. Navigation includes the home course picker and global search. Service worker and offline asset inventory are updated.

## Verification

57 numerical preset and endpoint checks passed. Browser checks covered the home course card and unit navigation as well as all six experiments and persistence of inquiry notes. Original files were recovered using the public offline inventory. The original Vercel configuration was reconstructed from the deployment source viewer. Previous production deployment: BVgk6wwUxm6L29MMpuf2udQ3xyxV.
