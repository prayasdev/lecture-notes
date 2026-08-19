# Digital Notes Archive

The archive is intentionally **distributed by subject**. Every subject retains a local manifest, so a new course can be created or moved without maintaining one large central JSON file.

## Archive structure

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
      <PDF, PPT, PPTX, DOCX, XLSX, ZIP>
  practical/
    <subject-slug>/
      README.md
      <optional local practical files>
```

## Subject-local manifest

Each `subjects/<subject-slug>/manifest.json` holds only that subject’s metadata. It identifies the subject title, code, category, concise description, tags, Markdown modules, top-level legacy folder, and practical resources. The website synchronizer scans all local manifests and generates its own internal index. You never need to maintain a global catalog by hand.

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
  "legacyDirectory": "legacy/example-subject",
  "practicalDirectory": "practical/example-subject",
  "practical": [
    {
      "id": "lab-site",
      "title": "Lab practical repository",
      "type": "Website",
      "url": "https://example.edu/labs",
      "description": "Optional WordPress or external reference route."
    }
  ],
  "modules": []
}
```

## Adding a subject

Create the subject folder, add its local manifest and module folders, then create matching folders in `legacy/` and `practical/`. Run the synchronizer afterwards:

```bash
node website/scripts/sync-notes.mjs
```

The website then detects the subject, category, collection counts, and resources. PDF and presentation files in the matching legacy folder are listed automatically. Practical resources may be local files or external WordPress, repository, or laboratory links registered in that subject’s own manifest.
