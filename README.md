# ASTR 201: Astronomy for Science Majors

Course website for ASTR 201 (Spring 2026) at San Diego State University.

**Instructor:** Dr. Anna Rosen
**Live Site:** [astrobytes-edu.github.io/astr201-sp26](https://astrobytes-edu.github.io/astr201-sp26)

## Quick Start

```bash
# Preview with live reload
quarto preview

# Build the site
quarto render

# Build instructor version (includes answer keys)
quarto render --profile instructor
```

Requires [Quarto](https://quarto.org/) v1.4+.

## Project Structure

```text
astr201-sp26/
├── _quarto.yml              # Main config + course params
├── _extensions/course/      # Custom Lua shortcodes
├── _includes/               # Reusable content blocks
├── assets/
│   ├── figures.yml          # Central figure registry
│   ├── images/              # All images by module
│   ├── slides/              # RevealJS theme
│   └── theme/               # Site SCSS
├── course-info/             # Syllabus, schedule, policies
├── modules/
│   ├── module-01/           # Foundations
│   ├── module-02/           # Inferring Star Properties
│   ├── module-03/           # Stellar Structure & Evolution
│   └── module-04/           # Galaxies & Cosmology
├── handouts/                # Reference sheets
├── homework/                # Assignments
└── exams/                   # Exams
```

Each module follows this structure:

```text
modules/module-NN/
├── index.qmd                # Module hub page
├── _prep/                   # Instructor-only (not published)
│   └── lecture-NN-*.md
├── slides/
│   ├── _metadata.yml        # Shared RevealJS config
│   └── lecture-NN-*.qmd
└── readings/
    └── lecture-NN-*.qmd
```

## Key Features

### Central Figure Registry

All figures are registered in `assets/figures.yml`:

```yaml
figures:
  hr-diagram:
    path: /assets/images/common/hr-diagram.png
    caption: "Hertzsprung-Russell diagram"
    alt: "Plot showing stellar luminosity vs temperature"
    credit: "ESA"
```

Use in content with shortcodes:

```markdown
{{< fig hr-diagram >}}         # Figure with caption
{{< img hr-diagram >}}         # Image only (for slides)
```

### Custom Shortcodes

| Shortcode                          | Output                             |
| ---------------------------------- | ---------------------------------- |
| `{{< fig id >}}`                   | Figure with caption from registry  |
| `{{< img id >}}`                   | Image only (no caption)            |
| `{{< due "2026-02-15" >}}`         | Formatted due date                 |
| `{{< points 10 >}}`                | Point value badge                  |
| `{{< reading "Ch 3" "pp. 45" >}}`  | Reading reference                  |
| `{{< meta params.instructor >}}`   | Course metadata                    |

### Course Parameters

Single source of truth in `_quarto.yml`:

```yaml
params:
  course-code: "ASTR 201"
  instructor: "Dr. Anna Rosen"
  semester: "Spring 2026"
  # ... more params
```

Access anywhere with `{{< meta params.X >}}`.

### Student/Instructor Profiles

Conditional content using Quarto profiles:

```bash
quarto render                      # Student view (default)
quarto render --profile instructor # Includes answer keys
```

## Development Workflow

### Using Templates

Copy templates to create new lectures quickly:

```bash
# Create new slides
cp assets/templates/slides-template.qmd modules/module-02/slides/lecture-03-topic.qmd

# Create new reading
cp assets/templates/reading-template.qmd modules/module-02/readings/lecture-03-topic.qmd
```

Then find/replace all `[BRACKETED]` placeholders with actual content.

| Template | Includes |
|----------|----------|
| `slides-template.qmd` | RevealJS config, extensions (pointer, spotlight, quiz, roughnotation), placeholder sections |
| `reading-template.qmd` | Metadata, "Check Yourself" questions, collapsible solutions, reference tables |

### Standard Workflow

1. **Create slides** from template at `modules/module-NN/slides/lecture-NN-topic.qmd`
2. **Register figures** in `assets/figures.yml` before using `{{< fig >}}`
3. **Preview** with `quarto preview`
4. **Verify** with `quarto render` (check for warnings)

### Dates

Keep ISO format in frontmatter (`date: "2026-01-22"`).
Renders automatically as "January 22, 2026".

### Units Convention

Always use CGS units (cm, g, s, erg) for physics content.
Solar units (M☉, R☉, L☉) for stellar quantities.
Never SI units (meters, kg, Joules).

## CI/CD

GitHub Actions workflow (`.github/workflows/ci.yml`):

- Renders HTML on push/PR to main
- Validates links and images weekly
- Uses [proof-html](https://github.com/anishathalye/proof-html) for link checking

## License

[![CC BY-NC-SA 4.0](https://licensebuttons.net/l/by-nc-sa/4.0/88x31.png)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

This work is licensed under a [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-nc-sa/4.0/).

© 2026 Anna Rosen
