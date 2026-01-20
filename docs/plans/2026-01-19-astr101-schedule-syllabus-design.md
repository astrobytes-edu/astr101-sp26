# ASTR 101 Schedule & Syllabus Update Design

**Date:** 2026-01-19
**Status:** Approved

## Overview

Update the ASTR 101 course website schedule and syllabus to reflect the correct course structure based on instructor planning document.

## Course Identity (Confirmed)

| Aspect | Value |
|--------|-------|
| Course | ASTR 101: Principles of Astronomy |
| Schedule | MWF 10:00–10:50 AM |
| Room | LH 345 |
| Textbook | Seeds & Backman, *Universe: Stars and Galaxies*, 11th Edition |
| Platform | Macmillan Achieve (via Day1Ready) |
| Weekly format | Mon/Wed = lecture, Friday = in-class activity |

## Key Dates

- **First class:** Wed Jan 21, 2026
- **Module 1 Exam:** Mon Feb 23 (Ch 1-8)
- **Module 2 Exam:** Mon Apr 6 (Ch 16-21)
- **Spring Break:** Mar 16-20 (no class)
- **Final Exam:** Fri May 8, 10:30am–12:30pm (Comprehensive)

## Grading Structure (100% Auto-Graded)

| Component | Weight | Details |
|-----------|--------|---------|
| LearningCurve Reading | 10% | Unlimited attempts, completion-based |
| Weekly Homework | 15% | 10 assignments, lowest 2 dropped |
| Scholarly Engagement | 10% | iClicker + Friday activities (75% participation, 25% correctness) |
| Module Exams (2) | 30% | 15% each, Monday in-class, scantron |
| Final Exam | 35% | Comprehensive, scantron |

## Files to Update

### 1. `_quarto.yml` params
- `class-time`: "MWF 10:00–10:50 AM"
- `location`: "LH 345"
- `textbook`: "Seeds & Backman, *Universe: Stars and Galaxies*, 11th Edition"
- Add `textbook-platform`: "Macmillan Achieve"

### 2. `course-info/schedule.qmd`
- Rewrite with weekly table format
- Columns: Week, Dates, Mon & Wed Topics, Fri Activity, Chapters
- Add note: "Friday activities will be updated as semester progresses"
- Include important dates section
- Match instructor doc weekly schedule

### 3. `course-info/syllabus.qmd`

**Keep unchanged:**
- Exam policy language (Missed Exams section)
- Student Learning Outcomes
- Academic Integrity & AI Policy
- Diversity/Inclusivity, Land Acknowledgement, Student Info
- Growth Mindset framing

**Update:**
- Course Information table (MWF, LH 345, Universe textbook)
- Required Materials (Universe + Achieve via Day1Ready)
- Grading table (new weights)
- Start Here callout (simplify for Achieve workflow)
- Remove "Grade Memos" from homework workflow
- Remove "Growth Memos" section entirely

**Simplify:**
- Homework section → Achieve auto-graded, lowest 2 dropped, due Tuesdays 11:59pm
- Scholarly Engagement → iClicker + Friday activities

## Design Decisions

1. **Keep exam policy language** from ASTR 201 syllabus (no 48-hour makeup)
2. **Achieve handles complexity** — no manual grading, no self-assessment workflow
3. **Friday activities noted as TBD** — will be updated as semester progresses
4. **Day1Ready for textbook access** — same opt-out deadline language
