# Syllabus Formatting & Structure Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Improve `course/syllabus.qmd` formatting and navigation (clickable TOC, consistent headings, cleaner tables, better Course Information layout) with user approval for each change.

**Architecture:** Make small, isolated edits to `course/syllabus.qmd` so each change is easy to review and can be accepted/rejected independently.

**Tech Stack:** Quarto / Pandoc Markdown (`.qmd`)

### Task 1: Fix broken “Important Dates” heading

**Files:**
- Modify: `course/syllabus.qmd` (around the Grading & Assessments section)

**Steps:**
1. Replace the malformed line `**Important Dates:** ## Important Dates` with a single proper heading (`### Important Dates`).
2. Remove duplicate TODO comment immediately above/below the heading, keeping one TODO.

### Task 2: Re-enable a clickable TOC (HTML-first)

**Files:**
- Modify: `course/syllabus.qmd` (YAML front matter)

**Steps:**
1. Set `format: html: toc: true` and keep `toc-depth: 2`.
2. Keep `format: pdf: toc: false` (to avoid adding pages/length), unless user requests otherwise.

### Task 3: Reformat “Course Information” into two columns

**Files:**
- Modify: `course/syllabus.qmd` (Course Information section)

**Steps:**
1. Use Quarto columns (`:::: {.columns}` / `::: {.column}`) to place contact/logistics on the left and platforms/resources on the right.
2. Remove duplicated “Official course website” line.
3. Keep “Office Hours — Your Resource for Learning” as a full-width paragraph below columns (readability).

### Task 4: Improve “Grading scale” readability

**Files:**
- Modify: `course/syllabus.qmd` (Grading scale section)

**Steps:**
1. Replace the bullet list with a compact markdown table (easier to scan).

### Task 5: Normalize heading levels for assessment components

**Files:**
- Modify: `course/syllabus.qmd` (Course Components section)

**Steps:**
1. Make “Scholarly Engagement”, “Weekly Homework + Grade Memos”, “Growth Memos”, and “Exams” the same heading level under “Course Components”.

### Quick verification (manual)

Run:
- `quarto render course/syllabus.qmd --to html`

Confirm:
- TOC appears and links jump to sections
- Headings render correctly (no duplicated heading text)
- Course Information columns look good on HTML
