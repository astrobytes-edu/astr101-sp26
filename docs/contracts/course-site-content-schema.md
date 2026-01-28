---
title: "ASTR 101 Course Site Content Schema Contract"
version: "1.0.0"
date: "2026-01-14"
status: "LOCKED"
owner: "Dr. Anna Rosen"
---

# Content Schema Contract (Claude-Proof)

This contract defines the required metadata and structural patterns for module pages and lecture cards.

---

## 1. Module Page Front Matter (MUST)

Each `modules/module-XX.qmd` MUST include:

```yaml
---
title: "Module X: <Title>"
subtitle: "Weeks A–B | <Short tagline>"
page-layout: article
---
````

Optional keys allowed:

* `description:` (used for SEO)
* `categories:` / `keywords:` (optional)

---

## 2. Module Page Sections (MUST)

Each module page MUST contain these sections in order:

1. `## Why this module matters` (narrative intro)
2. `## Learning objectives`
3. `## Lectures`
4. `## Required reading` (or `## Readings`)

---

## 3. Lecture Card Markup (MUST)

Lecture cards MUST use these class names:

* `.lecture-grid`
* `.lecture-card`
* `.lecture-card-title`
* `.lecture-card-date`
* `.lecture-card-summary`
* `.lecture-card-link`

Minimum structure:

```markdown
::: {.lecture-grid}

::: {.lecture-card}
### Lecture 01: Title {.lecture-card-title}
**Tue, Jan 20** {.lecture-card-date}

One-line summary. {.lecture-card-summary}

[View Slides →](../slides/lecture-01-title.qmd){target="_blank" rel="noopener" .lecture-card-link}
:::

:::
```

Notes:

* The link MUST include `target="_blank"` and `rel="noopener"`.
* The card MUST NOT include time estimates or progress UI.
* Dates MAY be omitted if unknown, but the class name must remain (empty is acceptable).

---

## 4. Sidebar Link Targeting (MUST)

All sidebar links under `/slides/` MUST open in new tab.

Implementation MUST:

* set `target="_blank"` and `rel="noopener"` for those links at runtime via JS.

---

## 5. Exam Markers (MUST)

Exams MUST appear in the sidebar as **non-links**.

They MUST be visually distinct but not interactive.

---

## 6. Forbidden Patterns (MUST NOT)

* No inline hex colors in content
* No ad hoc HTML styles (e.g. `<span style="color:#...">`)
* No “click here” link text
* No lecture cards with progress/time/difficulty

```

---

If you want, I can also draft the **exact `_quarto.yml` skeleton** + **assets/scripts.js** + **SCSS contract stubs** that implement these rules *without ambiguity* — but the docs above should already keep Claude tightly on the rails.
```
