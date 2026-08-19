# Website Content Integration

This directory connects the distributed source archive to the static React catalogue. It does not own lecture content. The authoritative files remain in `digital notes/`; this layer reads them and produces a generated library for the reader.

## Data flow

```text
subject manifest + module Markdown + local resources
                    ↓
website/scripts/sync-notes.mjs
                    ↓
website/src/library.generated.ts
                    ↓
client/src/pages/Home.tsx → catalogue and Markdown reader
```

| File | Responsibility | Editing rule |
|---|---|---|
| `scripts/sync-notes.mjs` | Scans manifests, modules, local Legacy/Practical resources, and builds raw GitHub URLs. | Edit only when archive behaviour changes. |
| `src/library.generated.ts` | Generated subject catalogue and embedded Markdown content. | **Never edit manually.** |
| `../client/src/pages/Home.tsx` | Catalogue navigation, collection visibility, Streamdown/KaTeX reader. | Edit only for reader or UI behaviour. |

## Synchronize content

From the repository root, run:

```bash
node website/scripts/sync-notes.mjs
pnpm check
```

The synchronizer reads every `digital notes/subjects/<slug>/manifest.json`, then resolves each declared module at `modules/<module.id>/<module.file>`. It discovers supported local resources under the subject’s Legacy and Practical directories, merges any manifest-registered metadata or external links, and writes `src/library.generated.ts`.

## Rendering rules

Module-local asset links written as `](assets/<file>)` become raw GitHub URLs during synchronization. The Markdown reader supports ordinary Markdown, tables, images, `\(...\)` inline mathematics, and `\[...\]` display mathematics. The reader normalizes the latter LaTeX delimiters for KaTeX; source Markdown should keep the documented authoring syntax.

The repository identity and raw-link branch are intentionally explicit at the top of `scripts/sync-notes.mjs`. If this archive is forked or its default branch changes, update `owner`, `repository`, and `branch` before syncing.

## Commit boundary

Every content change must include both the authored files under `digital notes/` and the regenerated `website/src/library.generated.ts`. This keeps the static site deterministic and allows any host to build or serve the same catalogue without a runtime database.

See [`../README.md`](../README.md) for the project map and [`../AI_AUTHORING_README.md`](../AI_AUTHORING_README.md) for the content-generation contract.
