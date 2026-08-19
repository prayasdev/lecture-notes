# Lecture Notes — Design Direction

## Three explored approaches

### Approach A
**Theme Name:** Marginalia & Marigold  
**Very Brief Intro:** A warm contemporary reading room that feels like a carefully marked academic book: cream paper, ink-black typography, restrained terracotta rules, and graceful serif headlines. It supports serious study without becoming visually austere.  
**Probability:** 0.07

### Approach B
**Theme Name:** Archive Atelier  
**Very Brief Intro:** A darker museum-catalogue direction with tobacco paper, brass accents, and dense typographic labels, designed to make every subject feel like part of a durable reference archive.  
**Probability:** 0.03

### Approach C
**Theme Name:** Field Notes Studio  
**Very Brief Intro:** A soft utilitarian system inspired by annotated engineering notebooks, using light sand, muted moss, and structured labels to make navigation practical and tactile.  
**Probability:** 0.09

---

## Chosen approach: Marginalia & Marigold

### Design Movement
The interface follows **contemporary academic editorial design** with the spatial rhythm of a literary journal and the discipline of a university archive. It deliberately avoids dashboard tropes and generic software-card patterns.

### Core Principles
1. **Reading comes first.** The site gives lecture content a generous, quiet reading plane with strong line length, clear hierarchy, and resilient contrast.
2. **Navigation is a shelf, not a menu.** Subjects, modules, and legacy resources are presented as a structured library that can grow without redesign.
3. **Editorial hierarchy creates meaning.** Numerals, bylines, meta labels, folios, and highlighted callouts make content scannable before it is read in full.
4. **Warmth is functional.** Paper-toned surfaces and restrained ink, terracotta, and library-green accents reduce visual harshness while preserving focus.

### Color Philosophy
The palette evokes a premium study desk rather than a digital dashboard. **Parchment** (#F4EDE0) is the main paper surface, **ink** (#241B16) carries long-form text, **marigold** (#D59638) marks active learning and calls to action, **clay red** (#A94F35) anchors rules and emphasis, and **library green** (#31584F) signals completed or stable reference material. Color is never decorative without an informational role.

### Layout Paradigm
The primary composition is an **asymmetric library spread**: a compact top masthead, a left subject shelf, a central content canvas, and a right contextual rail for module progress and resources. On smaller screens, the shelf collapses into a searchable drawer and the contextual rail becomes an inline sequence beneath the article header.

### Signature Elements
1. A persistent **folio strip** with subject code, module number, and estimated reading time.
2. Thin terracotta **binding rules** and margin markers that divide content without boxed-card clutter.
3. A small **sunburst bookmark mark** used as the logo, favicon, and active-reading indicator.

### Interaction Philosophy
Interactions should feel like handling a well-made reference volume: quiet, direct, and predictable. Module selection, filtering, and subject changes are instant. Hover states reveal metadata and progress without moving the reading target. The raw GitHub action is intentionally secondary to the rendered digital reading route.

### Animation
At reduced motion settings, all nonessential movement is removed. Otherwise, content panes enter with a 180–220 ms opacity-and-translation transition; cards lift by no more than 2 px; active indicators slide along their rule in under 180 ms. There are no looping animations, typewriter effects, or oversized celebratory transitions.

### Typography System
**Fraunces** supplies page titles, large subject headings, and pull quotes with editorial character. **Source Serif 4** is used for rendered long-form note content because of its comfortable academic reading texture. **IBM Plex Sans** handles navigation, small labels, metadata, controls, and numeric information. Display headings use tight tracking; body copy uses generous line-height and a constrained reading measure.

### Brand Essence
**A structured digital reading room for students who want deep notes, clean paths through a subject, and a library that can grow with them.**  
**Personality:** Scholarly, warm, precise.

### Brand Voice
Headlines are specific and calm; controls are direct; microcopy explains where a reader is and what will happen next. It avoids hype, vague productivity language, and generic onboarding phrasing.

Example lines: “A reference shelf for work that deserves to be kept.”  
“Read the rendered module, or open the source file when you need the original.”

### Wordmark & Logo
The logo is a **sunburst bookmark mark**: a small terracotta bookmark tab emerging from a marigold half-sun and bounded by an ink outline. The wordmark pairs the mark with a custom-styled “Lecture Notes” title in Fraunces, not a default system-font treatment.

### Signature Brand Color
**Marginalia Terracotta — #A94F35.** It is used sparingly for rules, active states, bookmark details, and essential actions.

## Implementation notes

The repository must preserve a scalable content layout:

| Repository area | Purpose |
|---|---|
| `digital notes/subjects/<subject-slug>/modules/` | Rendered Markdown source for each subject module. |
| `digital notes/subjects/<subject-slug>/legacy/` | Future PDF, PPT, PPTX, and other legacy resources. |
| `digital notes/subjects/<subject-slug>/manifest.json` | Subject metadata, module metadata, and resource definitions. |
| `website/` | Standalone static website source and build instructions. |

The website will render registered Markdown modules inside the site. Legacy documents are listed from the manifest and opened through a GitHub raw-content URL pattern, so adding files does not break navigation. A subject is added by creating its folder, writing or extending its manifest, and placing the files in the documented locations.
***
