---
title: "ASTR 101 Course Site Decision Log (ADR Index)"
version: "1.0.0"
date: "2026-01-14"
status: "ACTIVE"
owner: "Dr. Anna Rosen"
---

# ASTR 101 Course Site Decision Log (ADR Index)

This file records **binding decisions** for the course site.

**Any change to a LOCKED decision requires:**
1) a new ADR entry appended here (or separate ADR file), and  
2) updated acceptance screenshots, and  
3) successful CI build across outputs.

---

## ADR-0001 — Modules-first Information Architecture
- **Date:** 2026-01-14
- **Status:** LOCKED
- **Decision:** Modules are the primary organizational unit. Navigation and content flow through module landing pages.
- **Rationale:** Cognitive scaffolding + reduced navigation entropy. Aligns site with learning arc.
- **Consequences:** Requires module landing pages and module-grouped sidebar.

---

## ADR-0002 — Two-mode Navigation
- **Date:** 2026-01-14
- **Status:** LOCKED
- **Decision:** Two-mode navigation is required:
  1) Sidebar dropdowns for quick access
  2) Module landing pages for contextual learning
- **Rationale:** Students need both “find it fast” and “understand why it matters.”
- **Consequences:** Module pages must be narrative + dashboard hybrid.

---

## ADR-0003 — No Time Estimates, No Progress Tracking
- **Date:** 2026-01-14
- **Status:** LOCKED
- **Decision:** The site MUST NOT include time estimates, progress bars, completion tracking, or difficulty ratings.
- **Rationale:** Equity + avoids discouragement; students learn at different paces.
- **Consequences:** Remove any UI patterns that imply “pace normalization.”

---

## ADR-0004 — Slides Open in New Tab
- **Date:** 2026-01-14
- **Status:** LOCKED
- **Decision:** All slide links open in new tab (`target="_blank"`, `rel="noopener"`).
- **Rationale:** “Presentation mode” is distinct from “reference mode” (module page). Avoids losing place.
- **Implementation Note:** Sidebar links require JS injection (Quarto sidebar cannot set target).
- **Consequences:** Must maintain robust selector logic that survives theme/layout updates.

---

## ADR-0005 — Observatory Slate Palette Adopted
- **Date:** 2026-01-14
- **Status:** LOCKED
- **Decision:** Observatory Slate is the canonical palette.
- **Rationale:** Semantic roles scale better than single-accent palettes; reduces meaning collisions.
- **Consequences:** All colors must route through tokens; no ad hoc hex.

---

## ADR-0006 — Semantic Color Roles (Teal/Indigo/Gold/Rose)
- **Date:** 2026-01-14
- **Status:** LOCKED
- **Decision:** Color roles are semantic:
  - Teal = interactive
  - Indigo = structure
  - Gold = rare emphasis
  - Rose = pitfalls/errors
- **Rationale:** Predictable meaning across all surfaces.
- **Consequences:** Violations are treated as bugs.

---

## ADR-0007 — 90/9/1 Usage Ratio
- **Date:** 2026-01-14
- **Status:** LOCKED
- **Decision:** 90% neutrals / 9% teal+indigo / 1% gold+rose.
- **Rationale:** Prevents “everything is highlighted” failure mode.
- **Consequences:** Gold/Rose must remain rare; periodic review required.

---

## ADR-0008 — Callout Type Mapping Locked
- **Date:** 2026-01-14
- **Status:** LOCKED
- **Decision:** Callouts map to roles:
  - Note/Problem → Indigo
  - Tip/Sanity Check → Teal
  - Important/Solution → Gold
  - Warning/Caution → Rose
- **Rationale:** Color meaning consistency + rapid student interpretation.
- **Consequences:** Any new callout type must declare mapping or is disallowed.

---

## ADR-0009 — Build + CI Output Matrix
- **Date:** 2026-01-14
- **Status:** LOCKED
- **Decision:** CI must build:
  - site HTML
  - representative PDFs
  - at least one RevealJS deck
- **Rationale:** Prevent “works on my machine” failures mid-semester.
- **Consequences:** CI must include TeX + headless render dependencies.

---

## ADR-0010 — Change Control Process
- **Date:** 2026-01-14
- **Status:** LOCKED
- **Decision:** Changes to design/features require:
  1) ADR entry
  2) updated acceptance screenshots
  3) passing CI
- **Rationale:** Keep Claude from drifting; keep the site stable.
- **Consequences:** No silent palette or layout churn.

---

## ADR Template (Use for Future Decisions)

Copy/paste this block for new decisions:

```markdown
## ADR-XXXX — Title
- **Date:** YYYY-MM-DD
- **Status:** PROPOSED | LOCKED | SUPERSEDED
- **Decision:** (one sentence)
- **Rationale:** (why)
- **Alternatives:** (considered options)
- **Consequences:** (what changes, what it costs)
- **Implementation Notes:** (how to implement / constraints)
- **Supersedes:** ADR-YYYY (if any)
- **Superseded by:** ADR-ZZZZ (if any)
```

---
