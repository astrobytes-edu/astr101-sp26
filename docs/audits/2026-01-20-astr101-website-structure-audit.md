# ASTR 101 Course Website Audit

**Date:** 2026-01-20
**Auditor:** Claude (automated)
**Repository:** `/Users/anna/Teaching/astr101-sp26`
**Scope:** Website structure, quality, and ASTR 201 artifact cleanup

---

## Executive Summary

The ASTR 101 course website is **substantially complete** with robust infrastructure (Quarto, RevealJS, figure/equation registries, profiles). However, significant cleanup is needed around **ASTR 201 references, incomplete modules, draft content, and missing directories**.

| Category | Critical | Major | Minor |
|----------|----------|-------|-------|
| Issues Found | 3 | 8 | 12 |

**Estimated cleanup effort:** 2–4 hours

---

## 1. ASTR 201 References Found

### Critical: Student-Facing Content

| File | Line | Issue | Action |
|------|------|-------|--------|
| `handouts/scholarly-engagement-norms.qmd` | 22 | "Math level: Astro 201" | Change to "ASTR 101" |

### Major: File Naming

| File | Issue | Rename To |
|------|-------|-----------|
| `modules/module-01/_prep/astr_201_lecture_1_spoiler_alerts_the_decoder_ring_55_60_min.md` | ASTR 201 in filename | `lecture-01-spoiler-alerts-prep.md` |
| `modules/module-01/_prep/lecture-01/presentation/ASTR201-Lecture01-SpoilerAlerts.qmd` | ASTR 201 in filename | `ASTR101-Lecture01-SpoilerAlerts.qmd` |

### Major: Design Specs

| File | Rename To |
|------|-----------|
| `docs/specs/astr-201-figure-system-spec.md` | `figure-system-spec.md` |
| `docs/specs/astr201-equation-system-spec.md` | `equation-system-spec.md` |
| `docs/specs/astr201-teaching-tools-extension-spec.md` | `teaching-tools-extension-spec.md` |

### Medium: Demos README

`demos/README.md` documents course levels (101/201) in the roadmap tables. This is acceptable for planning purposes but should clarify this repo is ASTR 101 only.

### Low Priority: AGENTS.md

References "ASTR201 skills" — clarify if this is mixed-course documentation or needs updating.

---

## 2. Structural Issues

### Missing Directories

| Directory | Status | Impact | Action |
|-----------|--------|--------|--------|
| `modules/module-04/` | Does not exist | README documents 4 modules; Module 4 not present | Create or remove from docs |
| `assets/images/module-03/` | Does not exist | No module-03 figures can be registered | Create directory |

### Empty Modules

| Module | slides/ | readings/ | Impact |
|--------|---------|-----------|--------|
| module-02 | Empty | Empty | Students see empty listings |
| module-03 | Empty | Empty | Students see empty listings |

**Recommendation:** Create placeholder content or hide from sidebar until ready.

---

## 3. Draft Content Blocking Render

Files with `draft: true` will not appear in published site:

### Student-Facing (Review Immediately)

- `modules/module-01/slides/lecture-01-spoiler-alerts-slides.qmd`
- `modules/module-01/readings/lecture-01-spoiler-alerts-reading.qmd`
- `course-info/why-astr101-is-different.qmd`
- `exams/index.qmd`
- `explore/astro-videos.qmd`

### Handouts (8 files)

- `scholarly-engagement-norms.qmd`
- `astr101-socratic-seminar-toolkit.qmd`
- `astr101-discourse-kit.qmd`
- `astr101-figure-kit.qmd`
- `lecture-02-reference-tables.qmd`
- `ai-tutor-study-tips.qmd`
- (and others)

**Action:** Audit each file; set `draft: false` for content ready for students.

---

## 4. Configuration Review

### _quarto.yml Status

| Section | Status | Notes |
|---------|--------|-------|
| Params (lines 7–33) | ✓ Complete | Course code correctly set to "ASTR 101" |
| Profiles | ✓ Complete | Student/Instructor distinction configured |
| Sidebar | ⚠ Verify | Modules 2/3 have `contents: []` — will show empty |
| Theme | ✓ Complete | All SCSS files present |
| Filters | ✓ Complete | Custom shortcodes loaded |

### Figure Registry Status

| Metric | Status |
|--------|--------|
| Total entries | ~45 |
| Alt text | All present |
| Module-03 entries | 0 (missing) |
| Module-04 entries | 4 (directory missing) |

### Equation Registry Status

| Metric | Status |
|--------|--------|
| Entries | 8 registered |
| Include files | All present |
| Meaning cards | All complete |

---

## 5. Minor Issues

| Issue | Location | Action |
|-------|----------|--------|
| TODO comment | `handouts/grade-memo-template.md:89` | Complete or remove |
| Commented-out content | `modules/module-03/index.qmd:57–80` | Restore or delete |
| Large PDF in repo | `modules/module-01/_prep/Photons_to_Physical_Truth_Slides_nblm.pdf` (14 MB) | Consider removing |
| Orphaned prep files | `modules/module-01/_prep/` | Archive old iterations |
| "Coming soon" placeholders | Activities, Handouts pages | Clarify timeline |

---

## 6. Recommended Actions

### Phase 1: Critical (Do First)

1. **Rename ASTR 201 files**
   ```bash
   # In modules/module-01/_prep/
   mv astr_201_lecture_1_spoiler_alerts_the_decoder_ring_55_60_min.md lecture-01-spoiler-alerts-prep.md

   # In modules/module-01/_prep/lecture-01/presentation/
   mv ASTR201-Lecture01-SpoilerAlerts.qmd ASTR101-Lecture01-SpoilerAlerts.qmd
   ```

2. **Fix handout content**
   - Edit `handouts/scholarly-engagement-norms.qmd:22`
   - Change "Astro 201" to "ASTR 101"

3. **Rename design specs**
   ```bash
   cd docs/specs/
   mv astr-201-figure-system-spec.md figure-system-spec.md
   mv astr201-equation-system-spec.md equation-system-spec.md
   mv astr201-teaching-tools-extension-spec.md teaching-tools-extension-spec.md
   ```

4. **Set draft: false for ready content**
   - Review each draft file
   - Change to `draft: false` for public content

### Phase 2: Major (Before Semester)

5. **Create missing directories**
   ```bash
   mkdir -p assets/images/module-03
   mkdir -p modules/module-04/{slides,readings}
   ```

6. **Populate empty modules** (or hide from sidebar)

7. **Reconcile module-04 figures** (images exist but directory doesn't)

### Phase 3: Minor (Nice to Have)

8. Clean up prep directory (archive old files)
9. Remove commented-out content
10. Complete or remove TODOs
11. Remove large PDFs from repo

---

## 7. Verification Checklist

Before declaring cleanup complete:

- [ ] All ASTR 201 references renamed to ASTR 101
- [ ] Student-facing handout content updated
- [ ] `draft: true` status reviewed for all files
- [ ] Module-03 images directory created
- [ ] Module 4 status clarified
- [ ] `quarto render` completes without errors
- [ ] Navigation sidebar displays correctly
- [ ] All figure IDs have corresponding files

---

## Appendix: Full File List with 201 References

```
handouts/scholarly-engagement-norms.qmd:22
modules/module-01/_prep/astr_201_lecture_1_*.md (filename)
modules/module-01/_prep/lecture-01/presentation/ASTR201-*.qmd (filename)
docs/specs/astr-201-figure-system-spec.md (filename)
docs/specs/astr201-equation-system-spec.md (filename)
docs/specs/astr201-teaching-tools-extension-spec.md (filename)
demos/README.md:199-241 (course level table - acceptable)
AGENTS.md:20-45 (skills documentation)
```

---

*Generated by automated audit on 2026-01-20*
