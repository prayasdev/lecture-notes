# AI Authoring Contract for Digital Notes

Use this file as the **working specification** when asking an AI to add a new digital subject or module. It defines the source format, quality bar, and integration rules for this repository.

## Required output

Create one subject folder at `digital notes/subjects/<subject-slug>/`, a local `manifest.json`, and one Markdown file per declared module. Never create or edit a central subject catalogue. Never edit `website/src/library.generated.ts` manually.

```text
digital notes/subjects/<subject-slug>/
  manifest.json
  modules/
    module-01/
      <CODE>_Module_I_Lecture_Notes.md
      assets/
    module-02/
      <CODE>_Module_II_Lecture_Notes.md
      assets/
```

| Item | Mandatory rule |
|---|---|
| Subject slug | Lowercase kebab-case, unique, and identical to the manifest `id`. |
| Manifest | Declare title, code, category, description, tags, and every digital module. |
| Module path | `<subject>/modules/<module.id>/<module.file>` must exist exactly. |
| Assets | Keep module-only images in that module’s `assets/` folder. |
| Collections | Add Legacy or Practical only when resources exist; omit unused keys and folders. |
| Build step | Run `node website/scripts/sync-notes.mjs` after writing content. |

## Markdown module template

Use this sequence unless the supplied syllabus requires a clearly different structure.

```md
# <COURSE CODE> — <SUBJECT TITLE>

## Module <ROMAN NUMERAL>: <MODULE TITLE>

**Lecture duration:** <hours>  
**Prepared for:** <audience>  
**Prepared by:** Manus AI  
**Scope:** <one concise syllabus-aligned sentence>

> **Central idea:** <one precise, conceptually useful statement>

---

## 1. Learning outcomes

After completing this module, a student should be able to:

1. <measurable outcome>
2. <measurable outcome>

### Module map

| Section | Topic | Approximate teaching emphasis |
|---|---|---:|
| 2 | <topic> | <hours> |

---

## 2. <First teaching section>

Explain concepts accurately with short subsections, tables, figures, worked examples, and tutorial questions where they improve learning.

![Specific figure description](assets/<descriptive-file-name>.png)

Inline math: \(\eta = P_{out}/P_{in}\).

Display math:

\[
E = P \times t
\]

---

## References

[1] [Author or organisation, *Title*.](https://example.org)

### Visual-attribution notes

State the source, licence/status, or original-creation method for every non-trivial visual.
```

## Authoring standards

Write complete, syllabus-aligned lecture notes rather than a summary or slide outline. Begin with learning outcomes and a module map. Use a logical numbered progression, then include worked calculations where relevant, a short recap, and tutorial or revision questions when the module benefits from them. Prefer explanatory prose plus well-labelled tables over unsupported lists.

Use credible primary, academic, government, standards-body, or institutional sources for technical claims. Place numbered in-text citations as ordinary text such as `[1]`, then give full linked entries under `## References`. Do not invent sources, data, laboratory results, quotations, figures, or user testimonials. Where a fact is jurisdiction-, tariff-, or standard-specific, state its scope and avoid presenting it as universal.

## Mathematics and figures

The website renders LaTeX through KaTeX. Write inline expressions with `\(...\)` and display equations with `\[...\]`. Do **not** use escaped bracket citations such as `\[1\]`; write `[1]`. Keep figure URLs relative, using `assets/filename.ext`, because the synchronizer converts those module-local paths into published raw-content URLs.

Only add a figure when it aids the lesson. Give each figure accurate alt text and a caption. Use source-appropriate, reusable, or author-created visuals, and record their attribution after the reference list.

## Manifest starter

```json
{
  "id": "ee0001-example-subject",
  "code": "EE0001",
  "title": "Example Subject",
  "shortTitle": "Example",
  "category": "Electrical Engineering",
  "categoryId": "electrical-engineering",
  "description": "One concise catalogue description.",
  "tags": ["topic one", "topic two"],
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

### Legacy-only manifest pattern

For a subject with no Markdown modules, omit `modules`. Use `legacyDirectories` to register one or more complete folders under `digital notes/legacy/`; use `legacyFiles` only for subject-specific files held in a shared folder such as `legacy/PYQ/`.

```json
{
  "id": "example-legacy-subject",
  "code": "EXAMPLE",
  "title": "Example Legacy Subject",
  "shortTitle": "Example",
  "category": "Electrical Engineering",
  "categoryId": "electrical-engineering",
  "description": "A concise description of the available legacy collection.",
  "tags": ["example topic"],
  "legacyDirectories": ["legacy/Example Notes"],
  "legacyFiles": ["legacy/PYQ/Example Subject PYQ.pdf"]
}
```

## Completion checklist

Before finishing, verify every module file exists, every local image path resolves from its own module folder, each manifest module points to the correct file, citations match the reference list, and all content is committed with the regenerated `website/src/library.generated.ts`.
