# Digital Notes Library

This directory is the **source library** for every subject shown in the website. Each subject is self-contained so it can be added, moved, or archived without changing the core user interface.

## Subject structure

```text
digital notes/
  subjects/
    <subject-slug>/
      manifest.json
      modules/
        module-01/
          <module-notes>.md
          assets/
      legacy/
        <future PDFs, PPTs, PPTXs, or other source materials>
```

## Adding a new subject

Create a subject folder inside `subjects/`, add a `manifest.json`, and place each Markdown module in its own folder under `modules/`. Register the subject in `website/src/library.generated.ts` by running `node website/scripts/sync-notes.mjs` after editing the top-level `subjects` index inside that file's source manifest.

## Adding a new module

Add the module folder and Markdown file, then add a matching module entry to that subject's `manifest.json`. The entry must include its `id`, `title`, `summary`, `duration`, and the Markdown filename. Run the sync script afterwards. The website renders the Markdown as a full reading view and rewrites local `assets/...` paths to stable GitHub raw-content links.

## Adding legacy material

Put PDF, PPT, PPTX, DOCX, or other legacy files inside the subject's `legacy/` directory. Add a `legacy` entry to the subject manifest with `title`, `type`, `path`, and optional `description`. The website lists the item and opens the raw GitHub-content route in a new tab. This preserves direct access without attempting to render unsupported formats in the browser.

## Important conventions

Use lowercase kebab-case for folders and do not rename a folder after publishing without updating the manifest. Keep related visual assets next to their module source. The Markdown file is the canonical source; generated website data is a build artifact.
