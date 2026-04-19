# Reteaching Notes — ASTR 101 (Spring 2026)

**Author:** Anna Rosen
**Last updated:** 2026-04-19
**Purpose:** Notes-to-future-self. Written while the semester is still fresh, under the correct interpretive frame: this was a **first-time prep, authored mid-semester, under a 150% teaching load, in a dysfunctional administrative environment, with an 8/80 enrollment and chronic absenteeism**. The sections below are organized so that future-me in 2028 (or whenever) opens this doc and does not misread the outcomes of this semester as a verdict on the course.

---

## The conditions this was authored under

For the record, because future-me will have sanitized these by then:

- **Teaching load was 3 courses**, not the 2 that science faculty normally carry at SDSU. The 3rd course landed on me because **COMP 521 was cancelled less than a week before the start of Fall 2025**, and the make-good was a Spring overload. I was writing ASTR 101 from scratch while teaching two other courses.
- **ASTR 101 was a brand-new prep.** No prior offering of mine to iterate against. Every reading, every activity, every rubric, every callout type was authored without student feedback from a previous semester.
- **Enrollment was 8 students against a cap of 80.** This is a signal about GE-catalog routing, time-slot scheduling, or departmental prioritization — not a signal about the course. Most of those 72 empty seats never saw the website.
- **Attendance was roughly 50% of the 8.** At n ≈ 4 per session, nothing in the classroom produced a statistically meaningful signal. Faces, questions, exam distributions, office-hours traffic — the normal instruments a professor uses to evaluate their own teaching were not functional this semester.
- **Institutional context:** COMP is administered by someone who, in my assessment, does not care about course structure or quality so long as a body is teaching the course. The Astro department chair situation is complicated and not in my favor. SDSU generally was operating as "a shit show" (direct quote from Spring 2026 me). Reteaching is uncertain and is not primarily under my control.

These conditions are the frame. Everything below inherits them.

---

## What this semester was NOT a test of

**Future-me, read this section first.** These are the things the Spring 2026 offering cannot tell you about — do not draw conclusions about them from this semester's outcomes:

- Whether the two-stage homework workflow actually produces metacognitive gains in students. Sample too small and too unattended.
- Whether the Observable / Model / Inference framing lands with non-major intro students. Same reason.
- Whether the reading length is right, wrong, or tolerable. With chronic absence, I cannot tell which readings were read, skimmed, or ignored.
- Whether the Cosmic Playground demos work as pre-class priming. Demo analytics at n=4 are noise.
- Whether Friday activities would work at attendance rates above ~50%. Never tested.
- Whether the discourse kit changes how students talk about evidence. Never tested at a cohort size where discussion was viable.
- Whether the course sequence pacing is correct (Module 1 six weeks, Module 2 seven weeks, Module 3 three weeks). Can't tell.
- Whether I am good at teaching this course. Also can't tell.

If I reteach under normal conditions, I will find out some of the answers. Until then, do not let the n=4 experience overwrite the pedagogy.

---

## What got built anyway

The baseline for a first-time prep under a 150%-load semester is "Canvas shell, a syllabus, assigned OpenStax chapters, and slides inherited from whoever taught it last." Against that baseline, what exists in this repo is unusual. Not as a boast — as a record so future-me doesn't forget the starting point:

- A Quarto website with a full course structure (syllabus, schedule, homework hub, handouts, modules, demos, activities) and theming infrastructure (`_brand.yml`, custom SCSS, custom callout taxonomy).
- **25 bespoke lecture readings** with Observable/Model/Inference framing, Check-Yourself questions with collapsible solutions, and per-lecture learning objectives.
- A **two-stage homework workflow** with rubric, self-scoring system, and reflection prompts, fully documented in `handouts/`.
- A **discourse kit** (claim / evidence / reasoning / assumptions / alternatives / uncertainty / discriminating tests) that is genuinely graduate-seminar quality.
- An integrated **interactive demo suite** (`demos/` + Cosmic Playground) registered to specific lectures via `assets/figures.yml` and `assets/media.yml`.
- An **LLM lab protocol** (`docs/llm-lab-protocol.md`) and software-engineering-playbook that enforced authorship discipline on both me and any AI collaborator. Without these, the Module 3 readings would not have survived the adversarial-correctness pass.
- A **publication-grade callout taxonomy** (key-insight, check-yourself, misconception, roadmap, summary, frontier) that is portable to other courses.

That this exists at all, authored under these conditions, is the fact I want future-me to see first.

---

## What Module 3 told us about Modules 1–2

Module 3 readings are shorter (~400 lines) than Module 1-2 readings (~600-1280 lines). That is not a quality gap. It is the normal authoring curve of a new course, compressed into one semester instead of three. I couldn't compress Modules 1-2 until I had written them and seen what "too much" looked like.

The correct interpretation: **Module 3 is the shape that emerged once I'd learned what these readings should be.** Modules 1-2 are legacy of authoring-without-iteration.

Decision rule: **don't re-edit Modules 1-2 now.** If reteaching, use Module 3 as the template and compress Modules 1-2 in that pass — with the benefit of whatever student signal the next offering actually produces. A speculative compression done now, without signal, would just be more authoring-without-iteration.

---

## If I reteach — decision rules

Conditional on reteaching actually happening, which I am treating as a real uncertainty:

1. **Use Module 3's shape as the template everywhere.** Compress Modules 1-2 readings toward ~400 lines. Move Deep Dives into optional reference pages.
2. **Do not build slides unless class size ≥ 15 and the room doesn't support reading-on-screen.** Slides were correctly abandoned this semester. Don't restart the effort speculatively.
3. **Do not write new activities speculatively.** One published activity that runs well beats four that go unused. Build activities only when confirmed attendance supports them.
4. **Run an adversarial-correctness pass on Modules 1-2** as a focused pre-semester sprint. Use the prompt structure that caught the Module 3 errors.
5. **Ship HW 7-10 before Week 1**, not during the semester.
6. **Syllabus text fix:** change "most Fridays include an in-class group activity" to "occasional Friday activities as scheduled." One-line edit.
7. **Publish `why-astr101-is-different.qmd`** (currently `draft: true`) with softer growth-mindset claims, or remove it. Don't leave it dangling.
8. **Leave the durable infrastructure alone.** Two-stage HW, discourse kit, callout system, demo suite, LLM lab protocol. These do not need rebuilding.

---

## If I don't reteach — what still matters

The durable infrastructure is **portable out of this course**. Even if ASTR 101 never runs under my name again, the following artifacts belong in a shared location and are reusable in ASTR 201, COMP 536, or any quantitative-reasoning class I teach:

- `handouts/astr101-hw-rubric.qmd` and `handouts/astr101-how-hw-works.qmd` → generalize to any two-stage HW workflow.
- `handouts/astr101-discourse-kit.qmd` → works in any discussion-based course.
- `assets/theme/callouts.scss` and the callout taxonomy → move into a reusable `_extensions/` bundle or a Quarto plugin.
- `docs/llm-lab-protocol.md` and `docs/software-engineering-playbook.md` → these survive every future course I author with LLM assistance.
- `demos/` + Cosmic Playground → interactive artifacts that outlive the course that commissioned them.

The Module 3 readings (L22-L26) are the ones I would carry forward to ASTR 201 or a cosmology-flavored GE course as-is. They are the one piece of content authoring I am unambiguously willing to stand behind.

---

## Honest debrief prompts — only I can fill these in

Claude cannot write these for me. Most of them will have thin or absent answers this semester because attendance was ~4; that's fine. Capture what's capturable before May is over and the signal decays further.

### On the 8 students

- Of the 8 who enrolled, how many actually engaged with the website? (Canvas analytics if available.)
- Of the ~4 who attended regularly, what did they say about the readings, on-record or off-record?
- Did anyone in the cohort express that the course mattered to them? That single data point is worth preserving.

### On the homework

- Of the 6 HWs that shipped, which problems did the majority get? Which tripped them up? (Note: at n ≈ 4-8, "majority" is 3-5 students — weak signal, but the only signal available.)
- Did grade-memo reflections produce visible metacognition in any student's trajectory over the semester?
- Did anyone submit a grade memo that demonstrated they were actually learning from the posted solutions, as the two-stage system predicts? If yes — keep that memo, anonymized, as evidence the design works.

### On the exams

- Midterm 1 (March 2): within a week of grading, write a half-page on what students got, what they missed, and what surprised me. Do not wait until August.
- Final (May 8): same.

### On me

- What did I actually enjoy authoring? What was drudgery? (Signal for what to keep vs. outsource vs. drop if reteaching.)
- What did I do in class after slides were abandoned? Capture the delivery pattern that emerged — that's the thing I'll want to reproduce.
- Hours spent on course this semester, roughly. As a sanity check against the "150% load was real" claim for any future workload conversation.

---

## What I'm explicitly not doing right now

All conditional on reteaching. Park them without guilt:

- Not polishing the syllabus.
- Not finishing HW 7-10.
- Not publishing `why-astr101-is-different.qmd`.
- Not building Module 2-3 slides.
- Not compressing Module 1-2 reading length.
- Not running the adversarial-correctness pass on Modules 1-2.
- Not writing new Friday activities.

---

## For the record

This course was authored under conditions no new faculty member should be asked to author a course under: a brand-new prep forced by a late COMP 521 cancellation, on top of a 50% teaching overload, inside a department where the chair's relationship to my file is adversarial, and inside a sister department whose administration does not care about course design. The 8-student enrollment was not my fault. The attendance was not my fault. The "meh" feeling at the end of the semester is, in my assessment, a correct read of the experience — and an incorrect read of the work.

If future-me reopens this doc while deciding whether to re-run the course or migrate its best pieces into ASTR 201 or something else: the work is good. The conditions were bad. Those are separable facts, and they should stay separated.
