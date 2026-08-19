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
    <subject-slug>/
      <future PDFs, PPTs, PPTXs, or other source materials>
```

## Adding a new subject

Create a subject folder inside `subjects/`, add a `manifest.json`, and place each Markdown module in its own folder under `modules/`. Create a matching folder at `legacy/<subject-slug>/` for archived files. Run `node website/scripts/sync-notes.mjs` to refresh the generated website data.

## Adding a new module

Add the module folder and Markdown file, then add a matching module entry to that subject's `manifest.json`. The entry must include its `id`, `title`, `summary`, `duration`, and the Markdown filename. Run the sync script afterwards. The website renders the Markdown as a full reading view and rewrites local `assets/...` paths to stable GitHub raw-content links.

## Adding legacy material

Put PDF, PPT, PPTX, DOCX, or other legacy files inside `legacy/<subject-slug>/`. The synchronizer automatically discovers supported files and lists them in the website with a direct raw GitHub-content link. Add an optional `legacy` entry to a subject manifest only when you want to override a file title, type, or description. This preserves direct access without attempting to render unsupported formats in the browser.

## Important conventions

Use lowercase kebab-case for folders and do not rename a folder after publishing without updating the manifest. Keep related visual assets next to their module source. The Markdown file is the canonical source; generated website data is a build artifact.
