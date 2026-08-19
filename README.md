# Lecture Notes

**Lecture Notes** is a static, manifest-driven academic archive. Source notes live beside each subject; the website builds an internal catalogue from those distributed manifests. The archive can scale without a central subject registry.

## Architecture at a glance

```text
digital notes/                         # Authoritative content source
  subjects/<subject-slug>/
    manifest.json                      # Subject metadata and module index
    modules/module-01/<notes>.md       # Rendered digital note
    modules/module-01/assets/          # Images used only by that module
  legacy/<subject-slug>/                # Optional PDFs, PPTs, and documents
  practical/<subject-slug>/             # Optional code, files, or local records

website/scripts/sync-notes.mjs          # Reads distributed content
website/src/library.generated.ts        # Generated build artifact; do not edit
client/                                 # React reader and catalogue interface
```

| Layer | Owns | Rule |
|---|---|---|
| Subject folder | Metadata, modules, and module assets | One `manifest.json` per subject; no central catalogue. |
| Legacy / Practical folders | Optional local resources | A subject may omit either or both. |
| Synchronizer | Generated website library | Run after every content or manifest change. |
| React client | Search, catalogue, and Markdown reader | Do not put lecture content in UI code. |

## Add or change content

Create or update the subject-local manifest and source files, then run the synchronizer from the repository root.

```bash
node website/scripts/sync-notes.mjs
pnpm check
```

Commit the source content **and** the regenerated `website/src/library.generated.ts`. The reader hides missing Digital, Legacy, and Practical collections automatically.

## Documentation map

| Document | Use it for |
|---|---|
| [`digital notes/README.md`](digital%20notes/README.md) | Manifest schema, folder rules, and local-resource registration. |
| [`AI_AUTHORING_README.md`](AI_AUTHORING_README.md) | A concise, copy-ready contract for an AI creating new Markdown lecture notes. |
| [`website/README.md`](website/README.md) | Synchronization, generated data, and website integration details. |

## Non-negotiable conventions

Use lowercase kebab-case subject slugs, keep every module in its declared `module-XX` folder, and keep its Markdown `file` name identical to the manifest entry. Link module images with relative Markdown paths such as `![Load profile](assets/load-profile.png)`. Use `\(...\)` for inline mathematics and `\[...\]` for display mathematics; use ordinary `[1]` style citations, never escaped bracket citations.

For a new subject, start with the AI authoring guide, create the directory structure it specifies, and register only the collections that genuinely exist.
