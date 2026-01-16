---
title: "ASTR 201 Course Site Design Contract"
version: "1.0.0"
date: "2026-01-14"
status: "LOCKED (Implementation Contract)"
owner: "Dr. Anna Rosen"
scope: ["website", "modules", "handouts", "slides", "pdf"]
---

# ASTR 201 Course Site Design Contract (LOCKED)

This document is a **hard contract** that governs the visual system, semantic color roles, typography, spacing, and component styling for the ASTR 201 Quarto course site.

**If implementation deviates from this contract, it is a bug.**  
Changes require an ADR in `docs/decisions/course-site-decisions.md`.

---

## 0. Normative Language

- **MUST / MUST NOT**: required / forbidden.
- **SHOULD / SHOULD NOT**: strongly recommended / avoid unless justified.
- **MAY**: optional.

---

## 1. Scope

This contract applies to **all student-facing outputs**:

- Website pages (HTML)
- Module landing pages (HTML)
- Handouts (HTML + PDF)
- Assignments (HTML + PDF)
- RevealJS slides (HTML)

It also applies to shared CSS/SCSS and any custom components (shortcodes, JS behaviors, etc.).

---

## 2. Design Principles (Non-Negotiable)

1. **Calm, high-signal reading experience.** Prefer whitespace and hierarchy over decoration.
2. **Semantic color roles.** Colors communicate meaning (interaction, structure, warning), not vibes.
3. **Consistency across surfaces.** A link looks like a link everywhere; a warning looks like a warning everywhere.
4. **Accessibility is not optional.** Contrast, keyboard nav, focus, and non-color encodings are required.
5. **No bespoke styling drift.** No random one-off colors, fonts, shadows, or spacing outside tokens.

---

## 3. Observatory Slate Palette (Semantic Roles)

### 3.1 Semantic Color Roles (LOCKED)

| Role | Name | Meaning | MUST be used for | MUST NOT be used for |
|---|---|---|---|---|
| Interactive | **Teal** | “clickable / active / navigation” | links, buttons, active nav, focus rings, hover states | headings, large background fills |
| Structure | **Indigo** | “section structure / theory space” | headings, section dividers, structural chips, code accents | primary links/buttons |
| Emphasis | **Gold** | “rare: this is the point” | *very rare* important highlights, key results, “Solution” badges | body links, frequent highlighting, large blocks |
| Pitfalls | **Rose** | “danger / misconception / error” | warning/caution/error callouts, validation failures | general emphasis, normal links |

### 3.2 Usage Ratio (LOCKED)

The visual system MUST follow the **90/9/1 ratio**:

- **90%** neutrals (backgrounds, text, borders)
- **9%** Teal + Indigo (interactive + structure)
- **1%** Gold + Rose (rare emphasis + pitfalls)

If Gold or Rose becomes common, the design has failed.

### 3.3 Token Enforcement Rule (LOCKED)

- All colors MUST be sourced from the site token system (SCSS variables or CSS variables).
- Implementation MUST NOT introduce raw hex values in component styles (except inside the token files themselves).

---

## 4. Typography Contract (LOCKED)

### 4.1 Typeface Rules

- **Body font MUST be one sans family** (Inter recommended).
- **Code font MUST be one monospaced family** (JetBrains Mono recommended).
- If serif is introduced (optional), it MUST be applied consistently (e.g., headings only) and documented via ADR.

### 4.2 Type Scale and Hierarchy

- Body text MUST be comfortably readable (target ~16–18px equivalent).
- Heading hierarchy MUST be obvious without relying on color alone:
  - H1: title-level
  - H2: major sections
  - H3/H4: subsections
- Headings MUST use **Indigo** (not Teal).

### 4.3 Inline Code

Inline code MUST:
- Use monospaced font
- Use subtle neutral background
- Use Indigo *as a trim*, not as a bright block

---

## 5. Spacing, Layout, and Density (LOCKED)

### 5.1 Spacing Rules

- Use a small set of spacing steps (e.g. 8/12/16/24/32 px equivalents).
- Avoid dense walls of text:
  - Paragraph spacing MUST be consistent.
  - Lists MUST not be jammed (adequate line-height).

### 5.2 Content Width

- Maximum readable line width SHOULD be constrained (avoid 1400px wide text).
- For module pages, content MUST remain scan-friendly: heading → short paragraphs → cards → lists.

---

## 6. Component Styling Contract (LOCKED)

### 6.1 Links (Interactive = Teal)

Links MUST:
- Use Teal for normal state
- Have visible hover affordance (underline on hover at minimum)
- NOT rely on color alone for identification (underline on hover is required)

Visited links SHOULD NOT turn purple.

### 6.2 Headings (Structure = Indigo)

Headings MUST:
- Use Indigo
- Avoid excessive decorative rules
- Provide clear hierarchy through size/weight

### 6.3 Buttons

Primary buttons MUST use Teal and MUST have:
- Clear hover state
- Visible focus ring
Secondary buttons SHOULD use neutral background with Indigo text.

### 6.4 Code Blocks

Code blocks MUST:
- Be on an elevated neutral surface
- Use Indigo for code “chrome” (labels, borders)
- Support copy buttons + optional folding (feature contract)

### 6.5 Callouts (LOCKED mapping)

Callouts MUST map to semantic roles:

| Callout | Role | Accent |
|---|---|---|
| Note | Structure | Indigo |
| Tip | Interactive/helpful | Teal |
| Important | Rare emphasis | Gold |
| Warning / Caution | Pitfalls | Rose |
| Problem | Structure | Indigo |
| Solution | Rare emphasis | Gold |
| Sanity Check | Helpful | Teal |

Callouts MUST have:
- Title + icon (or title + strong label)
- Border/stripe indicating type
- Not rely only on color (icon/title required)

### 6.6 Lecture Cards (Module Pages)

Lecture cards MUST:
- Be visually consistent with callouts/cosmic style
- Use **Indigo** as structural accent and **Teal** for the link/button
- Avoid progress/time/difficulty indicators (explicitly forbidden)

Hover effects MUST be subtle (no bouncing, no heavy motion).

---

## 7. Dark Mode Contract (LOCKED)

- Dark mode MUST preserve semantic roles:
  - Teal = interactive
  - Indigo = structure
  - Gold = rare emphasis
  - Rose = pitfalls
- Dark mode MUST NOT become neon or high-saturation “cyber UI.”
- Contrast MUST remain readable for long-form text.

---

## 8. Accessibility Contract (LOCKED)

Minimum requirements (non-negotiable):

1. **Keyboard navigation** MUST work for:
   - sidebar expand/collapse
   - nav links
   - lecture card “View Slides” links
2. Focus states MUST be visible:
   - focus ring MUST be present and clearly seen (Teal recommended)
3. Color MUST NOT be sole encoding:
   - warnings MUST include icon + title, not just pink tint
4. Contrast SHOULD meet WCAG AA for body text.

---

## 9. Governance & Change Control (LOCKED)

- Any change to:
  - color role mapping,
  - typography,
  - module card layout,
  - callout mapping,
  - navigation behavior,
  requires:
  1) an ADR entry, and
  2) updated acceptance screenshots,
  3) re-render of all outputs in CI.

No silent changes.

---

## 10. Relationship to Other Docs

- **ASTR 201 Modules UI/UX Design Specification v1.0** describes IA and page structure.
- This document is the **visual contract** and supersedes any styling guidance elsewhere if conflicts arise.

---