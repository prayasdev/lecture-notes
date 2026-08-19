# Legacy Archive

Place subject-wise legacy reference files here. The expected structure is:

```text
digital notes/legacy/
  <subject-slug>/
    previous-year-notes.pdf
    class-slides.pptx
    reference-deck.ppt
```

The website synchronizer automatically discovers supported files from each subject archive folder. After adding or changing material, run:

```bash
node website/scripts/sync-notes.mjs
```

Then commit both the legacy files and the regenerated `website/src/library.generated.ts`.
