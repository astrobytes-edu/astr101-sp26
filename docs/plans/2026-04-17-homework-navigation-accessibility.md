# Homework Navigation Accessibility Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make every released homework and homework solution path easy for students to find from the homepage, sidebar, and homework hub.

**Architecture:** Promote the homework area in global navigation, add a first-class homework entry point on the homepage, and turn the homework hub into the canonical assignment-and-solutions landing page. Keep solution detail links centralized on the hub page so the sidebar stays short and readable.

**Tech Stack:** Quarto website configuration, Markdown/Quarto content pages

---

### Task 1: Promote homework in site navigation

**Files:**
- Modify: `_quarto.yml`

**Step 1:** Move the `Homework` section higher in `website.sidebar.contents`, directly after course information so students encounter it early.

**Step 2:** Rename the hub link text so it reads as the main landing page for assignments and solutions.

**Step 3:** Keep direct links to each released homework page in the same section.

### Task 2: Add a homepage homework entry point

**Files:**
- Modify: `index.qmd`

**Step 1:** Add a `Homework` tile to the Quick Navigation dashboard.

**Step 2:** Add a short student-facing sentence in the Start Here callout pointing students to the homework hub for assignments and solution links.

### Task 3: Strengthen the homework hub

**Files:**
- Modify: `homework/index.qmd`

**Step 1:** Add a short top-level explanation that this page is the central place for released homework and linked reading solutions.

**Step 2:** Add a brief "start here" callout with links to the assignment list and the solutions section on the page.

**Step 3:** Keep the existing homework listing table, then reorganize the solutions section heading/text so students can scan it more quickly.

### Task 4: Verify the public student build

**Files:**
- Verify: `_site/`

**Step 1:** Run `conda run -n astro quarto render`.

**Step 2:** Confirm the render succeeds without errors.

**Step 3:** Spot-check the rendered homepage and homework hub HTML output for the new navigation text and links.
