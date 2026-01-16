# Why ASTR 201 is Different - Design Document

**Created:** 2026-01-15
**Status:** Implemented
**File:** `course-info/why-astr201-is-different.qmd`

---

## Goal

Create an ASTR 201 version of the "Why This Course is Different" page (similar to ASTR 596) that:
- Explains the course philosophy to students
- Motivates them to engage with the challenge
- Addresses growth mindset and productive struggle
- Is concise and punchy (~800 words, layered with TL;DR)

---

## Key Messages

1. **The universe is weird** - and that weirdness is physical (gravity, QM, dark matter/energy)
2. **This isn't fact memorization** - it's learning to think like a scientist
3. **Struggle is how learning happens** - backed by neuroscience
4. **Math + physics explain WHY** - not just what we observe
5. **Skills transfer beyond astronomy** - quantitative reasoning, evaluating claims

---

## Structure

1. **TL;DR callout** (collapsible) - ~100 words
2. **What This Course Actually Teaches** - inference, models, uncertainty
3. **Why It Feels Different** - math, confusion, reflection (grade memos)
4. **The Growth Mindset Payoff** - neuroscience citations
5. **What This Means for You** - agency, resources, trajectory
6. **References** - 3 key papers

---

## Design Decisions

- **Lead with weirdness** to hook interest before explaining approach
- **"cosmos" → "universe"** for consistency
- **Balance theory and observation** - not observer-centric
- **Math as language, physics as explanation** - precise distinction
- **No cheesy motivational lines** - concrete payoffs instead
- **Include growth mindset image** from ASTR 596

---

## Implementation

- File created: `course-info/why-astr201-is-different.qmd`
- Added to sidebar in `_quarto.yml` under "Course Info"
- Image: `assets/growth-mindset.jpeg`
- Renders successfully
