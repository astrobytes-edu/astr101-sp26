# Slide Utility Classes

Tailwind-style utility classes for ASTR 201 RevealJS slides.

## Usage

```markdown
::: {.text-sm .text-muted}
Smaller, gray text
:::

[Key term]{.text-accent .font-bold}
```

## Typography

| Class | Effect |
|-------|--------|
| `.text-xs` | 0.65em |
| `.text-sm` | 0.8em |
| `.text-base` | 1em (default) |
| `.text-lg` | 1.2em |
| `.text-xl` | 1.5em |
| `.font-normal` | 400 weight |
| `.font-medium` | 500 weight |
| `.font-semibold` | 600 weight |
| `.font-bold` | 700 weight |
| `.italic` | Italic |
| `.uppercase` | ALL CAPS |
| `.leading-none` | Line height 1.0 |
| `.leading-tight` | Line height 1.15 |
| `.leading-normal` | Line height 1.4 |
| `.leading-relaxed` | Line height 1.65 |

## Colors

| Class | Color |
|-------|-------|
| `.text-primary` | Cosmic blue (headings) |
| `.text-secondary` | Stellar blue (links) |
| `.text-accent` | Aurora teal (highlights) |
| `.text-muted` | Gray (de-emphasized) |
| `.text-warning` | Nova orange (important) |
| `.text-success` | Aurora teal (correct) |
| `.opacity-25/50/75` | Transparency |
| `.bg-highlight` | Yellow background |
| `.bg-muted` | Gray background |
| `.bg-primary` | Blue background |
| `.bg-accent` | Teal background |

## Layout

### Alignment

| Class | Effect |
|-------|--------|
| `.text-left` | Left align |
| `.text-center` | Center align |
| `.text-right` | Right align |
| `.mx-auto` | Center block |

### Flexbox

| Class | Effect |
|-------|--------|
| `.flex` | Display flex |
| `.flex-col` | Column direction |
| `.items-center` | Vertical center |
| `.justify-center` | Horizontal center |
| `.justify-between` | Space between |
| `.gap-1/2/4` | Gap (0.5/1/2rem) |

### Spacing

| Class | Effect |
|-------|--------|
| `.mt-1/2/4` | Margin top |
| `.mb-1/2/4` | Margin bottom |
| `.my-1/2/4` | Margin Y |
| `.mx-1/2/4` | Margin X |
| `.pt-1/2/4` | Padding top |
| `.pb-1/2/4` | Padding bottom |
| `.p-1/2/4` | Padding all |

Scale: `1` = 0.5rem, `2` = 1rem, `4` = 2rem

### Width

| Class | Effect |
|-------|--------|
| `.w-full` | 100% |
| `.w-half` | 50% |
| `.w-third` | 33% |
| `.w-two-thirds` | 66% |
| `.w-quarter` | 25% |
| `.w-auto` | Auto |
| `.max-w-prose` | ~65 characters |

## Examples

### Smaller title text

```markdown
## {.text-lg}

Slide Title Here
```

### Side-by-side content

```markdown
::: {.flex .gap-4 .items-center}
![](image.png){width="300px"}

Description text here
:::
```

### De-emphasized note

```markdown
::: {.text-sm .text-muted .mt-4}
*Note: This is additional context*
:::
```

### Highlighted key term

```markdown
The [Stefan-Boltzmann law]{.text-accent .font-bold} tells us...
```
