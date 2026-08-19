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

Each `subjects/<subject-slug>/manifest.json` holds only that subject’s metadata. It identifies the subject title, code, category, concise description, tags, and only the collections that the subject actually has. The website synchronizer scans all local manifests and generates its own internal index. You never need to maintain a global catalog by hand.

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

The website detects the subject, category, and only the collections with at least one available item. A subject may contain **only Digital notes**, **only Legacy PDFs or presentations**, **only Practical resources**, or any combination. Omit unused collection keys and folders; the interface does not display empty tabs, counts, or placeholder panels. PDF and presentation files in a matching legacy folder are listed automatically. Practical resources may be local files or external WordPress, repository, or laboratory links registered in that subject’s own manifest.
