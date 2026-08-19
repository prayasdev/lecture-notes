# Digital Notes Content Guide

This directory is the **authoritative content layer**. Each subject is self-contained: it owns its metadata and digital modules, while Legacy and Practical material remains optional. The website builds its catalogue by scanning these subject-local manifests; there is no central subject JSON to maintain.

## Structure

```text
digital notes/
  subjects/<subject-slug>/
    manifest.json
    modules/module-01/<module-notes>.md
    modules/module-01/assets/<module-image>
  legacy/<subject-slug>/<PDF, PPT, DOCX, XLSX, ZIP>
  practical/<subject-slug>/<code, notebook, document, or README>
```

| Directory | Purpose | Required? |
|---|---|---|
| `subjects/<slug>/` | Subject manifest and digital modules | Yes, for a digital subject. |
| `legacy/<slug>/` | Locally hosted legacy documents | Only when Legacy exists. |
| `practical/<slug>/` | Local practical files | Only when local Practical resources exist. |

## Subject manifest

Create `subjects/<subject-slug>/manifest.json`. Use lowercase kebab-case for the folder and `id`. The `modules` array may be empty for a Legacy-only or Practical-only subject.

```json
{
  "id": "example-subject",
  "code": "EE0001",
  "title": "Example Subject",
  "shortTitle": "Example",
  "category": "Electrical Engineering",
  "categoryId": "electrical-engineering",
  "description": "A concise catalogue description.",
  "tags": ["machines", "analysis"],
  "courseHours": 30,
  "modules": [
    {
      "id": "module-01",
      "number": "I",
      "title": "Foundation Topic",
      "summary": "A concise searchable module summary.",
      "duration": "06 hours",
      "file": "EE0001_Module_I_Lecture_Notes.md"
    }
  ]
}
```

| Field | Use |
|---|---|
| `id`, `code`, `title`, `category`, `description`, `modules` | Core subject and catalogue fields. |
| `shortTitle`, `categoryId`, `tags`, `courseHours`, `accent` | Recommended metadata fields. |
| `legacyDirectory`, `practicalDirectory` | Optional custom local-resource directories; defaults use the subject slug. |
| `legacy`, `practical` | Optional registered resources, resource overrides, or external links. |

Every module object must point to `modules/<id>/<file>`. For a local figure, write `![Alt text](assets/figure-name.png)` in that module Markdown file. The synchronizer rewrites this path for the published reader.

## Optional collections

Legacy discovery supports `.pdf`, `.ppt`, `.pptx`, `.doc`, `.docx`, `.xls`, `.xlsx`, and `.zip`. Practical discovery supports those files plus `.md`, `.ipynb`, `.py`, `.m`, `.c`, `.cpp`, and `.js`. `README` files are ignored as resources.

To register an external Practical resource, add it to the subject manifest:

```json
{
  "practical": [
    {
      "id": "lab-site",
      "title": "Laboratory practical guide",
      "type": "Website",
      "url": "https://example.edu/labs",
      "description": "External WordPress or laboratory route."
    }
  ]
}
```

Do not create empty collection folders or placeholder files. A subject may be Digital-only, Legacy-only, Practical-only, or any real combination; absent collections are hidden in the website.

## Update workflow

After changing a manifest, Markdown file, or local resource, run this from the repository root:

```bash
node website/scripts/sync-notes.mjs
pnpm check
```

Commit the source content and the regenerated `website/src/library.generated.ts`. For the exact Markdown standard and a copy-ready brief for a future AI, read [`../AI_AUTHORING_README.md`](../AI_AUTHORING_README.md).
