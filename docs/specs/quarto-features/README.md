# Quarto Features for Course Websites

**Version:** 4.0
**Last Updated:** 2026-01-14

This directory contains comprehensive specifications for seven interconnected systems that reduce maintenance burden for Quarto-based course websites.

## Core Philosophy

**Single source of truth:** Define information once, reference it everywhere.

## Feature Index

| # | Feature | Purpose | File |
|---|---------|---------|------|
| 1 | [Global Variables](01-global-variables.md) | Course metadata defined once, used everywhere | `01-global-variables.md` |
| 2 | [Includes](02-includes.md) | Reusable content blocks (policies, grading, etc.) | `02-includes.md` |
| 3 | [Custom Shortcodes](03-shortcodes.md) | Course-specific markup (`{{< due >}}`, `{{< points >}}`) | `03-shortcodes.md` |
| 4 | [Computed Schedules](04-computed-schedules.md) | Data-driven dates that shift with semester | `04-computed-schedules.md` |
| 5 | [Profiles](05-profiles.md) | Student vs. instructor views from same source | `05-profiles.md` |
| 6 | [Conditional Content](06-conditional-content.md) | Format-specific rendering (HTML vs PDF) | `06-conditional-content.md` |
| 7 | [Cross-References](07-cross-references.md) | Auto-numbered figures, tables, equations | `07-cross-references.md` |

## Quick Start

See the [Migration Checklist](08-migration-checklist.md) for step-by-step instructions to add all features to a new course.

## How These Features Connect

```
┌─────────────────────────────────────────────────────────────────────┐
│                         _quarto.yml                                 │
│                                                                     │
│  Contains:                                                          │
│  • Global variables (params:)                                       │
│  • Profile declarations                                             │
│  • Extension registration (filters:)                                │
│                                                                     │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
        ▼                       ▼                       ▼
┌───────────────┐    ┌───────────────────┐    ┌───────────────────┐
│   _includes/  │    │ _extensions/      │    │ Profile YMLs      │
│               │    │                   │    │                   │
│ Reusable      │    │ Custom            │    │ _quarto-student   │
│ content       │    │ shortcodes        │    │ _quarto-instructor│
│ blocks        │    │                   │    │                   │
└───────────────┘    └───────────────────┘    └───────────────────┘
        │                       │                       │
        │   Reference with      │   Use with            │   Select with
        │   {{< include >}}     │   {{< name >}}        │   --profile
        │                       │                       │
        └───────────────────────┼───────────────────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │    Your .qmd files    │
                    │                       │
                    │ • Use {{< meta >}}    │
                    │ • Use {{< include >}} │
                    │ • Use shortcodes      │
                    │ • Mark with classes   │
                    │ • Add cross-refs      │
                    │ • Format conditionals │
                    └───────────────────────┘
                                │
                ┌───────────────┴───────────────┐
                │                               │
                ▼                               ▼
        ┌───────────────┐               ┌───────────────┐
        │   _site/      │               │ _site-        │
        │   (student)   │               │  instructor/  │
        │               │               │               │
        │ Solutions:    │               │ Solutions:    │
        │ HIDDEN        │               │ VISIBLE       │
        └───────────────┘               └───────────────┘
```

## File Organization

After implementing all features, your project will have:

```
your-course/
├── _quarto.yml                    # Base config with params + profiles
├── _quarto-student.yml            # Student profile overrides
├── _quarto-instructor.yml         # Instructor profile overrides
│
├── _includes/                     # Reusable content blocks
│   ├── instructor-contact.qmd
│   ├── grading-scale.qmd
│   ├── ai-policy.qmd
│   └── ... (13 files total)
│
├── _extensions/course/            # Custom shortcodes
│   ├── _extension.yml
│   └── shortcodes.lua
│
├── data/
│   └── schedule.yml               # Schedule data source
│
├── scripts/
│   └── schedule_generator.py      # Date computation
│
├── _site/                         # Student output (deploy)
└── _site-instructor/              # Instructor output (private)
```

## Reading Order

**New to Quarto?** Start with:
1. Global Variables (simplest, most useful)
2. Includes (builds on global variables)
3. Cross-References (built into Quarto)

**Setting up a complete course site?** Follow the [Migration Checklist](08-migration-checklist.md) which covers all features in order.

**Looking for a specific feature?** Jump directly to that file.

## Changelog

### v4.0 (2026-01-14)
- Split monolithic spec into individual feature files
- Added comprehensive pedagogical explanations
- Added flow diagrams and connection explanations
- Added common pitfalls for each feature

### v3.0 (2026-01-14)
- Expanded Profiles section with full file contents

### v2.0 (2026-01-14)
- Added computed schedules, profiles, conditional content

### v1.0 (2026-01-14)
- Initial specification (global variables, includes, shortcodes)
