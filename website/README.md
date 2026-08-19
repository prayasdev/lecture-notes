# Website

This directory contains the content-generation and library configuration layer for the Lecture Notes web experience. The Manus static template serves the React shell from `client/`; it imports generated note data from `website/src/` so the published website can remain fully static.

## How the site works

1. Source modules remain inside `digital notes/subjects/<subject>/modules/`.
2. `website/scripts/sync-notes.mjs` reads subject manifests and Markdown files.
3. The script writes `website/src/library.generated.ts`, which is imported by the React reader.
4. Module-local image paths are rewritten to GitHub raw-content URLs so the rendered site can display the source diagrams and figures.
5. Legacy PDFs and presentations are registered in each subject `manifest.json` and open through a raw GitHub link.

## Routine update

After adding or changing notes, run:

```bash
node website/scripts/sync-notes.mjs
```

Then commit both the source files under `digital notes/` and the regenerated `website/src/library.generated.ts`.

## Publishing

The project is designed for the included static website workflow. The repository also contains all source notes and website configuration so it can be deployed on another static host if desired.
