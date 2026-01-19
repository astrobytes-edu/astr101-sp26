# Lecture 01 — Spoiler Alerts (Slides Outline / Map)

**Scope:** instructor-only planning map for co-editing `modules/module-01/slides/lecture-01-spoiler-alerts-slides.qmd` using (but not copying) `modules/module-01/readings/lecture-01-spoiler-alerts-reading.qmd`.

## Non-negotiables (this outline enforces)

- No invented facts/citations/numbers; mark `VERIFY` / `[TBD]` where needed.
- Maintain course throughline: **Measure → Infer → Balance → Evolve**.
- Each slide has a job: *one idea, teachable live*, with speaker notes sufficient to teach.
- Use slide theme utilities + registries:
  - Figures: `{{< fig ... >}}` / `{{< img ... >}}` from `assets/figures.yml`
  - Media: `{{< media ... >}}` from `assets/media.yml`
  - Layout primitives from `assets/theme/slides/README.md`

## Narrative spine (high-level)

1) **Hook:** “Look up” → Rubin zoom-out → “those aren’t stars” wonder + stakes.
2) **Trailer disclaimer:** recognition over mastery; set expectations (including math/equations).
3) **Course thesis:** pretty pictures → measurements → models → inferences.
4) **Hard constraint:** only four direct observables; everything else is inferred.
5) **Spoiler reel:** 10 images, each as the same move (Measure → Infer → Physics); interleave light retrieval/prediction.
6) **Synthesis:** make one cross-cutting idea explicit (Doppler shift as reusable tool).
7) **Light as messenger:** orientation equations (`c = \lambda\nu`, `E=h\nu`) as relationship maps.
8) **Lookback time:** distance as a time dial.
9) **Method named:** decoder-ring pipeline + how science updates models.
10) **Close:** recognition not retention; next steps (Math Boot Camp) + one final quick check.

## Slide patterns (defaults to keep the deck coherent)

- **Hook / mood slides:** full-bleed background + one prompt line; notes carry pacing.
- **Core idea slides:** short declarative headline + 1–3 supporting lines (≤ ~35 words).
- **Spoiler slides:** prefer a consistent “evidence panel” pattern:
  - left: the image (registry `img`/`fig`)
  - right: triad card (**Measure / Infer / Physics**) using `.layout-triad` (or a 2-col layout + triad sub-block)
- **Retrieval cadence:** quick checks after thesis + mid-spoiler + near end; at least one TPS/prediction in the spoiler reel.
- **Equations:** treat as *readable stories*:
  - on-slide: the equation + 1 sentence “what it’s saying”
  - notes: symbol meanings + units sanity check + the one inference we’ll later use it for

## Map: current deck → reading sections

Note: slide numbering includes the auto-generated title slide at the top of the deck.

| Deck location (current) | What the slide should do | Reading anchor |
|---|---|---|
| **Title slide (auto)** | Set identity + stakes; make “spoilers first” feel intentional | LO + “Note on first exposure” |
| Look up prompt | Quiet observation + buy-in: “we all see the same sky” | Opening + “why this course” vibe |
| Rubin zoom-out video | Wonder + “galaxies” reveal; transition to inference | Trailer/roadmap framing |
| Three big questions image | Put the semester’s questions on screen | “Three big questions” figure |
| Trailer disclaimer | Recognition not mastery; sets norms | “A Note on First Exposure” |
| Thesis slide | Pretty pictures → … → inferences | Section 1.1 thesis |
| Four observables (image) | Name the 4 observables; commit to constraint | §1.1 “Four things we can measure” |
| Not directly measurable (table) | Make the gap explicit; cue “physics lives here” | §1.1 “What’s NOT…” + §1.3 table (lite) |
| Quick Check #1 | Retrieval: “what’s directly measurable?” | Self-assess / check-yourself style |
| HR diagram media | Show pattern-from-observables; preview H–R diagram meaning later | §1.1 “pattern hunters” idea |
| Spoiler reel intro | Explain the 3-question move (Measure/Infer/Physics) | §1.2 intro |
| Spoiler 1 (nebulae) | Colors = atomic physics; dust blocks | §1.2 Spoiler 1 |
| Spoiler 1 (Rubin nebula video) | Reinforce: color is data; set up “wavelength matters” | §1.2 Spoiler 1 transition |
| Quick Check #2 | Retrieval: connect “color/spectrum” to inference | §1.2 checkpoints |
| Spoiler 2 (distance ladder) | Brightness + standard candles → distance | §1.2 Spoiler 2 |
| Spoiler 2 (ladder details) | Keep it conceptual; avoid rung overload | §1.2 Spoiler 2 deep dive (optional) |
| Spoiler 3 (elements) | Spectra → composition; “you are starstuff” | §1.2 Spoiler 3 |
| Spoiler 4 (spectroscopy) | Prism → spectrum; “quantum barcode” | §1.2 Spoiler 4 |
| TPS (prism/spectrum) | Prediction: what changes when source moves? | Doppler foreshadow (end of Spoiler 4) |
| Spoiler 5 (EM spectrum) | Wavelength maps temperature/violence | §1.2 Spoiler 5 + §1.4 |
| Spoilers 6–8 | Same object, different physics; IR beats dust; multiwavelength truth | §1.2 Spoilers 6–8 |
| Spoiler 9 + cosmic web | Doppler + gravity → dark matter; structure still evolving | §1.2 Spoiler 9 |
| Spoiler 10 | Expansion history; acceleration (qualitative) | §1.2 Spoiler 10 |
| Connecting dots | Make Doppler “one idea, many uses” explicit | §1.2 + §1.3 bridge |
| Doppler explanation slide | Fingerprint shifts; toward/away | §1.2 Spoiler 4 Doppler |
| Where Doppler appears (bullets) | Retrieval: map applications | §1.2 / course arc preview |
| Lookback time image | Distance as time dial (few anchor examples) | §1.5 |
| Equation: `c = \lambda\nu` | Relationship map + units sanity check | §1.4 wave relation |
| Equation: `E = h\nu = hc/\lambda` | Why wavelengths reveal different physics | §1.4 photon energy |
| Decoder ring image | Name the method; include predict/test loop | §1.3 |
| Big questions (closing image) | Reconnect to motivation + “tools will answer these” | §1.3 + closing |
| Recognition not retention | Affect check; normalize overwhelm | §1.6 closing |
| Quick Check #3 | Retrieval: what was actually measured? | §1.6 final check Q2 |
| Math Boot Camp | Next-step expectation + “math is microscope” | §1.6 “next class” |
| Questions | Leave space for Q&A | — |

## Open issues to resolve during slide-by-slide editing

- `VERIFY`: any exact numbers in speaker notes (e.g., Rubin video counts, percentages, “20 billion”, etc.).
- Align the repeated “spoiler triad” language with the course throughline (where “Balance” and “Evolve” are previewed vs. used explicitly).
- Decide whether to add an explicit “Learning Objectives” slide early (or keep it in notes only).
