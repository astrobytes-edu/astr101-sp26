# ASTR 101 Schedule & Syllabus Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Update ASTR 101 course website with correct schedule, syllabus, and configuration for Spring 2026.

**Architecture:** Edit `_quarto.yml` params first (single source of truth), then rewrite `schedule.qmd` with weekly table, then update `syllabus.qmd` sections to match new grading/platform structure.

**Tech Stack:** Quarto, Markdown, YAML

---

## Task 1: Update `_quarto.yml` params

**Files:**
- Modify: `_quarto.yml:19-29`

**Step 1: Update class logistics params**

```yaml
  # Class logistics
  class-time: "MWF 10:00–10:50 AM"
  location: "LH 345"
```

**Step 2: Update textbook params**

```yaml
  # Textbook
  textbook: "Seeds & Backman, *Universe: Stars and Galaxies*, 11th Edition"
  textbook-platform: "Macmillan Achieve"
```

**Step 3: Verify YAML is valid**

Run: `quarto check`
Expected: No YAML errors

**Step 4: Commit**

```bash
git add _quarto.yml
git commit -m "config: update ASTR 101 class time, room, and textbook"
```

---

## Task 2: Rewrite `schedule.qmd` header and important dates

**Files:**
- Modify: `course-info/schedule.qmd`

**Step 1: Update frontmatter**

```yaml
---
title: "Course Schedule"
subtitle: "ASTR 101: Principles of Astronomy (Spring 2026)"
author: "Dr. Anna Rosen"
draft: true
format:
  html:
    toc: true
    toc-depth: 2
---
```

**Step 2: Write intro and important dates section**

```markdown
## How to use this schedule

- **Mon & Wed:** Lecture (new content)
- **Friday:** In-class activity (hands-on practice)
- **Homework:** Assigned Wednesdays, due Tuesdays 11:59 PM via Achieve

> **Note:** Friday activities will be updated as the semester progresses.

## Important Dates

- **First class:** Wed Jan 21, 2026
- **Module 1 Exam:** Mon Feb 23 (Chapters 1-8)
- **Module 2 Exam:** Mon Apr 6 (Chapters 16-21)
- **Spring Break:** Mar 16-20 (no class)
- **Last class:** Wed May 6
- **Final Exam:** Fri May 8, 10:30 AM – 12:30 PM (Comprehensive)

---
```

**Step 3: Commit partial progress**

```bash
git add course-info/schedule.qmd
git commit -m "docs(schedule): update header and important dates for ASTR 101"
```

---

## Task 3: Write Module 1 schedule table (Weeks 1-6)

**Files:**
- Modify: `course-info/schedule.qmd`

**Step 1: Add Module 1 section with weekly table**

```markdown
## Module 1: Observing the Sky & Solar System (Weeks 1-6)

| Week | Dates | Mon & Wed Topics | Fri Activity | Chapters |
|:-----|:------|:-----------------|:-------------|:---------|
| 1 | Jan 21-23 | (Wed only) Course intro, Scale of universe | — | Ch 1 |
| 2 | Jan 26-30 | Celestial sphere, coordinates; Moon phases, eclipses | Activity 1 | Ch 2-3 |
| 3 | Feb 2-6 | Gravity & orbits, Kepler's laws | Activity 2 | Ch 4 |
| 4 | Feb 9-13 | Light & radiation, EM spectrum | Activity 3 | Ch 5 |
| 5 | Feb 17-20 | (No Mon - Presidents Day) Spectra, Doppler; Telescopes | Activity 4 | Ch 5-6 |
| 6 | Feb 23-27 | **Mon: MODULE 1 EXAM**; Solar system, planets | Activity 5 | Ch 7-8 |

---
```

**Step 2: Commit**

```bash
git add course-info/schedule.qmd
git commit -m "docs(schedule): add Module 1 weekly table"
```

---

## Task 4: Write Module 2 schedule table (Weeks 7-12)

**Files:**
- Modify: `course-info/schedule.qmd`

**Step 1: Add Module 2 section**

```markdown
## Module 2: Stars & Stellar Evolution (Weeks 7-12)

| Week | Dates | Mon & Wed Topics | Fri Activity | Chapters |
|:-----|:------|:-----------------|:-------------|:---------|
| 7 | Mar 2-6 | The Sun, fusion, solar activity | Activity 6 | Ch 16 |
| 8 | Mar 9-13 | Measuring stars: parallax, luminosity, H-R diagram | Activity 7 | Ch 17 |
| 9 | Mar 16-20 | **SPRING BREAK — No class** | — | — |
| 10 | Mar 23-27 | Binary stars, stellar masses; Interstellar medium | Activity 8 | Ch 17-18 |
| 11 | Mar 30 - Apr 3 | Star formation; Stellar evolution, red giants | Activity 9 | Ch 18-19 |
| 12 | Apr 6-10 | **Mon: MODULE 2 EXAM**; Stellar death, white dwarfs | Activity 10 | Ch 19-20 |

---
```

**Step 2: Commit**

```bash
git add course-info/schedule.qmd
git commit -m "docs(schedule): add Module 2 weekly table"
```

---

## Task 5: Write Module 3 schedule table (Weeks 13-16)

**Files:**
- Modify: `course-info/schedule.qmd`

**Step 1: Add Module 3 section**

```markdown
## Module 3: Galaxies & Cosmology (Weeks 13-16)

| Week | Dates | Mon & Wed Topics | Fri Activity | Chapters |
|:-----|:------|:-----------------|:-------------|:---------|
| 13 | Apr 13-17 | Supernovae, neutron stars, black holes | Activity 11 | Ch 20-21 |
| 14 | Apr 20-24 | Milky Way structure, dark matter; Galaxies | Activity 12 | Ch 22-23 |
| 15 | Apr 27 - May 1 | Active galaxies, quasars; Cosmology, Big Bang | Activity 13 | Ch 24-25 |
| 16 | May 4-6 | Early universe, dark energy; **Wed: Review** | — | Ch 26-27 |

---

## Final Exam

**Friday, May 8, 10:30 AM – 12:30 PM**

Comprehensive exam covering all chapters (1-8, 16-27).
```

**Step 2: Commit**

```bash
git add course-info/schedule.qmd
git commit -m "docs(schedule): add Module 3 weekly table and final exam"
```

---

## Task 6: Update syllabus Course Information section

**Files:**
- Modify: `course-info/syllabus.qmd:41-55`

**Step 1: Update course info table**

Replace the existing table with:

```markdown
## Course Information {#sec-course-info}

|  |  |
|---|---|
| **Instructor** | Dr. Anna Rosen |
| **Email** | <alrosen@sdsu.edu> |
| **Office** | Physics 239 |
| **Office Hours** | Fridays 11:00 AM – 12:00 PM (and by appointment) |
| **Class meetings** | MWF 10:00–10:50 AM |
| **Location** | LH 345 |
| **Course website** | <https://astrobytes-edu.github.io/astr101-sp26> |
| **Platforms** | [Canvas](https://sdsu.instructure.com) *(announcements, gradebook)*<br>[Achieve](https://www.macmillanlearning.com/college/us/digital/achieve) *(homework, readings)*<br>[iClicker](https://student.iclicker.com/) *(in-class engagement)* |
```

**Step 2: Commit**

```bash
git add course-info/syllabus.qmd
git commit -m "docs(syllabus): update course info for ASTR 101"
```

---

## Task 7: Update syllabus Required Materials section

**Files:**
- Modify: `course-info/syllabus.qmd:84-92`

**Step 1: Replace required materials**

```markdown
### Required Materials

- **Required textbook:** Seeds & Backman, *Universe: Stars and Galaxies*, 11th Edition (via Macmillan Achieve)

- **Achieve platform access:** Required for homework and LearningCurve reading assignments. Access provided through **Day1Ready** — materials are free through the add/drop date (February 2, 2026). After that, your account is charged unless you opt out by 11:59 PM on Feb 2. See [shopaztecs.com/Day1Ready](https://shopaztecs.com/Day1Ready).

- **iClicker:** Required for in-class engagement. Register at <https://student.iclicker.com/>

- **Calculator:** Non-smartphone calculator for exams.
```

**Step 2: Commit**

```bash
git add course-info/syllabus.qmd
git commit -m "docs(syllabus): update required materials for Achieve/Universe"
```

---

## Task 8: Update syllabus Grading table

**Files:**
- Modify: `course-info/syllabus.qmd:114-124`

**Step 1: Replace grading table**

```markdown
## Grading & Assessments {#sec-grading}

| Component | Weight |
|---|-:|
| LearningCurve Reading (Achieve) | 10% |
| Weekly Homework (Achieve) | 15% |
| Scholarly Engagement (iClicker + Friday activities) | 10% |
| Module Exam 1 | 15% |
| Module Exam 2 | 15% |
| Final Exam (cumulative) | 35% |
```

**Step 2: Commit**

```bash
git add course-info/syllabus.qmd
git commit -m "docs(syllabus): update grading table for ASTR 101"
```

---

## Task 9: Update syllabus Important Dates section

**Files:**
- Modify: `course-info/syllabus.qmd:126-132`

**Step 1: Update exam dates**

```markdown
### Important Dates {#sec-important-dates}

- **Module 1 Exam:** Monday, February 23 (Chapters 1-8)
- **Module 2 Exam:** Monday, April 6 (Chapters 16-21)
- **Final Exam:** Friday, May 8, 10:30 AM – 12:30 PM (Comprehensive)

See the [Course Schedule](./schedule.qmd) for the full weekly calendar.
```

**Step 2: Commit**

```bash
git add course-info/syllabus.qmd
git commit -m "docs(syllabus): update exam dates"
```

---

## Task 10: Simplify syllabus Homework section

**Files:**
- Modify: `course-info/syllabus.qmd:188-224`

**Step 1: Replace homework section with simplified version**

```markdown
#### Weekly Homework (15%) {#sec-homework}

Homework is completed on **Macmillan Achieve** and is auto-graded. Assignments reinforce lecture material and prepare you for exams.

**Details:**
- **10 assignments** throughout the semester
- **Due Tuesdays at 11:59 PM** via Achieve
- **5 attempts allowed** per question
- **Lowest 2 scores dropped** — this policy handles emergencies, so no extensions are granted
- Mix of multiple choice, numerical, and visual questions

**Bottom line:** Consistent practice builds exam readiness. The drop policy means you don't need to stress about one bad week.
```

**Step 2: Commit**

```bash
git add course-info/syllabus.qmd
git commit -m "docs(syllabus): simplify homework section for Achieve"
```

---

## Task 11: Add LearningCurve section and remove Growth Memos

**Files:**
- Modify: `course-info/syllabus.qmd`

**Step 1: Add LearningCurve section after homework**

```markdown
#### LearningCurve Reading (10%) {#sec-learningcurve}

**LearningCurve** is an adaptive reading tool in Achieve. It adjusts to your level and helps you engage with the textbook before lecture.

**Details:**
- **Completion-based grading** — keep working until you reach the target
- **Unlimited attempts** — no penalty for wrong answers
- **All chapters available** throughout the semester
```

**Step 2: Remove Growth Memos section entirely**

Delete the entire "Growth Memos (10%)" section (lines ~226-249 in current file).

**Step 3: Commit**

```bash
git add course-info/syllabus.qmd
git commit -m "docs(syllabus): add LearningCurve section, remove Growth Memos"
```

---

## Task 12: Update Scholarly Engagement section

**Files:**
- Modify: `course-info/syllabus.qmd:167-186`

**Step 1: Simplify engagement section**

```markdown
#### Scholarly Engagement (10%) {#sec-engagement}

Engagement is measured through **iClicker responses** during lecture and **Friday in-class activities**.

**Scoring:**
- **75% participation** — you answered the questions
- **25% correctness** — you got them right

**To earn credit:**
- Must answer at least 75% of questions in a class period
- Attendance is not formally taken, but you cannot earn credit if you're not present

**Friday activities:** Hands-on practice applying lecture concepts. Activities are designed to be completed during class time with your peers.

**Classroom norms:** Phones and off-task devices are not permitted during class. Respect your classmates and contribute to our learning community.
```

**Step 2: Commit**

```bash
git add course-info/syllabus.qmd
git commit -m "docs(syllabus): update scholarly engagement for iClicker + activities"
```

---

## Task 13: Update Start Here callout

**Files:**
- Modify: `course-info/syllabus.qmd:56-63`

**Step 1: Simplify callout for Achieve workflow**

```markdown
::: {.callout-hero}
## Start Here

- **Homework:** Complete on Achieve, due **Tuesdays 11:59 PM**
- **Reading:** LearningCurve on Achieve (completion-based)
- **In class:** Bring iClicker; Fridays are activity days
- **Exams:** Closed-note, calculator allowed, formula sheet provided
- **Questions?** Check Canvas announcements, then [office hours](#sec-getting-help)
:::
```

**Step 2: Commit**

```bash
git add course-info/syllabus.qmd
git commit -m "docs(syllabus): simplify Start Here callout"
```

---

## Task 14: Clean up remaining ASTR 201 references in syllabus

**Files:**
- Modify: `course-info/syllabus.qmd`

**Step 1: Search and replace any remaining references**

Check for:
- "ASTR 201" → "ASTR 101"
- "Fundamentals of Astrophysics" → remove/replace
- "Grade Memo" references → remove
- "Growth Memo" references → remove

**Step 2: Commit**

```bash
git add course-info/syllabus.qmd
git commit -m "docs(syllabus): clean up remaining ASTR 201 references"
```

---

## Task 15: Verify renders correctly

**Step 1: Render syllabus**

Run: `quarto render course-info/syllabus.qmd`
Expected: No errors, HTML + PDF generated

**Step 2: Render schedule**

Run: `quarto render course-info/schedule.qmd`
Expected: No errors (will skip due to draft: true)

**Step 3: Check for ASTR 201 in output**

Run: `grep -r "ASTR 201" _site/ 2>/dev/null | head -5`
Expected: No matches

**Step 4: Final commit**

```bash
git add -A
git commit -m "docs: complete ASTR 101 schedule and syllabus update"
```

---

## Summary

**Total tasks:** 15
**Files modified:**
- `_quarto.yml` (params)
- `course-info/schedule.qmd` (complete rewrite)
- `course-info/syllabus.qmd` (multiple sections)

**Key changes:**
- MWF 10:00-10:50 AM, LH 345
- Universe textbook + Achieve platform
- Simplified grading (100% auto-graded)
- Weekly table format for schedule
- Removed Growth Memos and Grade Memos
