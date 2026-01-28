# The NovaGraph Engineering Playbook

*A concise, living document/checklist you can actually use while coding.*

## Learning objectives

1. Use **invariants + boundaries** to keep NovaGraph coherent as it grows.

2. Turn every change into a **contracted, testable, replay-safe** slice.

3. Ship safely with **idempotent side effects**, strong **observability**, and a disciplined **release pipeline**.

## Concept Throughline

1. **Meaning first:** domain language + boundaries prevent semantic drift.
2. **Truth is small:** canonical logs/stores; everything else is derived and rebuildable.
3. **Side effects are gated:** deterministic orchestration + idempotency + approvals.
4. **Replays are sacred:** you can explain and reproduce what happened.

---

## How to use this (the “2-minute ritual”)

This playbook is not a novel. It’s a **loop**. When you start a coding session, pick the smallest meaningful change, run it through the loop, and ship it behind the right gates.

Use the checklists as **guardrails**, not bureaucracy:

- If a box feels pointless, either **delete it** (explicitly) or **explain why it’s still valuable**.
- If you’re tempted to skip a box because “it’ll probably be fine,” that box is doing its job.

---

## The NovaGraph invariants ledger (the laws of physics)

These are the “never break these casually” statements. Every feature either **respects** them or **includes a deliberate migration plan**.

### I. One truth, many views

- Canonical truth lives in a small set of stores (e.g., DB + append-only logs).
- Everything else is **derived** (indexes, summaries, UI projections, caches).
- Derived data must be **rebuildable** from truth.

### II. Boundaries are real

- Each subsystem has a **bounded context**: terms mean one thing *inside* that context.
- Cross-context integration happens through **translation**, not shared mush.

### III. Aggregates define “what must be consistent together”

- You enforce invariants **inside** an aggregate boundary.
- Across aggregates: use **events / workflows**, accept eventual coordination, avoid “spooky shared state.”

### IV. Orchestration is deterministic; effects are activities

- Orchestrator = pure-ish state machine consuming history and emitting commands.
- Nondeterminism (LLMs, tools, time, randomness, I/O) happens in **activity runners**, and results are recorded.

### V. Side effects are gated and idempotent

- Any write/delete/publish action must have:
  - an explicit **invocationId** (idempotency key),
  - an audit trail,
  - and (if dangerous) an explicit approval step.
- Retrying must not duplicate business effects.

### VI. Single writer, controlled concurrency

- One authoritative writer for canonical stores (typically main process).
- Everyone else requests writes via a boundary (IPC/service layer).

### VII. “No parallel codepaths” rule

- One orchestrator entrypoint.
- One tool registry → one approval model.
- Prefer unifying refactors over “add another path.”

### VIII. Runtime discipline (NovaGraph-specific)

- Treat Codex CLI + Claude CLI as the only model runtimes.
- No API-key SDK sprawl in the app.
- Runtime config lives in `runtime.json` + CLI args/env templates as the single source of truth.

---

## The Change Loop

*Run every feature through this.*

### Step 0 — Name the bounded context and aggregate

**Write one sentence:**

- *“This change lives in the ___ context, and the aggregate boundary is ___.”*

If you can’t say that, the change is probably too big or unclear.

### Step 1 — State the invariants you’re protecting

Write 1–3 **semantic invariants** (not field shapes).

**Examples:**

- “Approval state is monotonic.”
- “A tool result recorded with invocationId is reused on retry.”
- “A doc’s exported artifact always references an existing doc revision.”

### Step 2 — Define contracts and schemas at boundaries

List every boundary this change touches, and for each: **input**, **output**, **versioning**, **failure shape**.

Common NovaGraph boundaries:

- Renderer ↔ main (IPC)
- Orchestrator ↔ runtime CLI output envelope
- Orchestrator ↔ tool invocation schema
- Persistence read/write
- Import/export formats

Rule: **if it crosses a boundary, it must be schematized.**

### Step 3 — Identify side effects and make them safe

For each side effect (write file, update DB, publish, download):

- What’s the **commit point**?
- What’s the **idempotency key**?
- What happens on **retry**?
- What’s the **compensation** if a later step fails?

If you can’t answer these, you don’t have a side effect yet — you have a future incident report.

### Step 4 — Make replay modes explicit

Decide which replay mode(s) apply:

- **Exact replay:** no model/tool calls; reconstruct from history.
- **Drift detection:** rerun nondeterministic steps for comparison.
- **Safe hybrid:** rerun read-only steps, never rerun dangerous ones.

Write the rule as code-worthy policy, not vibes.

### Step 5 — Storage + concurrency

- What is truth? What is derived?
- Who is allowed to write? Who only reads?
- What’s the conflict story (even on one device)?

### Step 6 — Testing plan (before implementation)

Pick the smallest set of tests that enforce your invariants:

- Invariant/unit tests for pure logic
- Contract tests for boundary payloads
- Replay tests for orchestration history
- Golden tests for complex outputs
- Minimal E2E smoke if needed

### Step 7 — Observability + security hooks

- What should be logged as a structured event?
- What trace/correlation IDs connect steps?
- What data must be redacted?
- What’s the STRIDE-ish threat you’re introducing (even locally)?

### Step 8 — Release posture

- Is this a breaking change to data/contracts?
- Do you need a feature flag?
- What goes in `CHANGELOG` “Unreleased”?
- What version bump class is this?

---

## Session checklists (copy/paste into your brain)

### Start-of-session (5 minutes)

- [ ] What is the smallest shippable slice today?
- [ ] Which bounded context + aggregate am I touching?
- [ ] What invariant could I accidentally break?
- [ ] What is the “truth store” for this change?
- [ ] What is the rollback story if I’m wrong?

### Before you open a PR (10 minutes)

- [ ] I can state the invariant(s) this PR enforces.
- [ ] Boundary payloads have schemas/versioning (where applicable).
- [ ] All side effects have invocationIds + idempotent behavior.
- [ ] Replay mode expectations are explicit (exact/drift/hybrid).
- [ ] Tests exist that would fail if the invariant regressed.
- [ ] Logs/telemetry won’t leak sensitive content.
- [ ] Docs/spec notes updated if the contract changed.

### Before merge (2 minutes)

- [ ] CI green.
- [ ] No “temporary flag” without an explicit removal plan.
- [ ] No duplicated codepath where a refactor would unify behavior.
- [ ] Migration path is safe (or change is strictly additive).

### Before release (15 minutes)

- [ ] Changelog updated (Unreleased → version section).
- [ ] Version bumped intentionally.
- [ ] Migration/backups tested on fixture data.
- [ ] Smoke run on a clean profile (launch, open doc, run safe AI action).
- [ ] “Support posture” defined: what happens if users hit a migration error?

---

## A–H quick map (so nothing falls off the table)

### A) DDD beyond aggregates (meaning management)

- Treat language as a constraint: bounded contexts, ubiquitous language.
- Aggregates define where invariants are enforced synchronously.

### B) Event sourcing in practice

- Events are stable facts, append-only.
- Projections are derived, rebuildable.
- Snapshot cadence is a performance choice, not a truth shift.

### C) Deterministic orchestration

- Orchestrator is deterministic state machine; activity runner performs nondeterministic work and records results.
- Replay modes are explicit.

### D) Idempotency + side-effect safety

- Assume at-least-once somewhere; defend with idempotency keys + dedupe + compensation.

### E) Storage + concurrency strategy

- Single writer for truth.
- Choose storage that makes invariants enforceable and queries boring.
- Derived views are rebuildable.

### F) Testing as a system

- Many small tests, fewer medium, very few large.
- Contract + replay tests are first-class for NovaGraph.

### G) Observability + security

- Correlate logs/traces; capture evidence without leaking data.
- Threat model each new capability; enforce least privilege.

### H) Release engineering

- Deployment pipeline mindset even for desktop.
- Versioning + changelog discipline + flags + rollback story.

---

## Agile Software (the real, intentional version)

**Agile** isn’t “move fast and skip thinking.” It’s **short feedback loops** with **evidence**.

**Agile engineering = the engineering practices that keep changes cheap.**

*Cheap to implement, cheap to test, cheap to deploy, cheap to rollback, cheap to explain.*

### The Agile North Star (values + principles as constraints)

We align with the Agile Manifesto’s core idea: prioritize people and collaboration, deliver working increments frequently, and adapt to change based on feedback. ([Agile Manifesto][1])

### Empiricism (what actually makes Agile work)

Adopt a simple scientific method loop:

1. **Hypothesis:** “This PR will improve X without breaking Y.”
2. **Experiment:** ship a small increment.
3. **Measurement:** tests + traces + user experience.
4. **Revision:** retrospective + next slice.

**Scrum** is one concrete embodiment of this “inspect and adapt” approach through its events and artifacts (Sprint as container; regular review/adaptation cadence). ([Scrum Guides][2])

### Practical Agile for a solo/early team NovaGraph

**Keep it lightweight, but explicit:**

**Backlog (continuous):**

- One list of work items, each with:

  - invariant at stake,
  - definition of done,
  - risk class (data/contract/UI).

**Cadence (repeatable):**

- Weekly: pick 1–3 “outcomes” (not 20 tasks).
- Daily: pick one smallest shippable slice.
- End of week: demo to yourself (or a friend) + write a 5-bullet retro.

**Definition of Done (NovaGraph flavored)**
A slice is “done” only if:

- invariants preserved,
- tests added,
- migrations safe (if needed),
- logs make failures explainable,
- feature is behind the right gate (flag/approval) if risky.

### Agile anti-patterns to actively avoid

- “Agile means no docs” → you still need **contracts** and **invariants**.
- “We’ll fix it later” → later is where data corruption becomes permanent.
- “Big-bang PRs” → they destroy feedback loops and make review meaningless.
- “Everything is urgent” → you lose prioritization and ship chaos.

**Check yourself:** If you can’t describe how you’ll learn whether a change helped (tests/metrics/user experience), it’s not Agile — it’s roulette.

---

## Glossary (small but sharp)

**Invariant:** must-always-hold rule (semantic > structural).

**Contract:** stable boundary agreement (inputs/outputs/errors/versioning).

**Schema:** machine-checkable shape/validation for a contract.

**Bounded context:** where words mean one thing.

**Aggregate:** consistency boundary; root controls invariant enforcement.

**Event:** immutable fact (“X happened”), append-only.

**Projection/view:** derived read model, rebuildable.

**Snapshot:** cached state-as-of-event-N, never the source of truth.

**Idempotency key / invocationId:** “same operation” identifier for safe retries.

**Dedupe cache:** remembers processed invocationIds/results to prevent duplicate effects.

**Saga/compensation:** multi-step workflow with undo-like corrective steps.

**Replay:** reconstruct state/decisions from recorded history.

**Feature flag:** ship code with behavior gated; remove flags deliberately.

**Deployment pipeline:** automated path from change → releasable artifact.

---

## Grounding sources (high-signal references)

Agile + process:

- Agile Manifesto values and principles. ([Agile Manifesto][1])
- Scrum Guide (framework definition, events/artifacts). ([Scrum Guides][2])

DDD + boundaries:

- Bounded Context + Ubiquitous Language (Fowler). ([martinfowler.com][3])
- Domain model vs application vs infrastructure (Microsoft guidance). ([Microsoft Learn][4])

Event sourcing:

- Event Sourcing (Fowler). ([martinfowler.com][5])

Determinism + replay:

- Durable Functions deterministic constraints (replay, orchestration limits). ([Microsoft Learn][6])
- Temporal Side Effects (record nondeterministic results in history). ([Temporal][7])

Idempotency:

- Stripe idempotent requests (same key → same result). ([Stripe Docs][8])

Storage + concurrency:

- SQLite WAL + Atomic Commit + FTS5 (official docs). ([SQLite][9])
- Electron IPC and security guidance (official docs). ([Electron][10])

Testing:

- Practical Test Pyramid (Fowler) + test sizes and flakiness (Google). ([martinfowler.com][11])

Observability + security:

- OpenTelemetry logs/specs and correlation context. ([OpenTelemetry][12])
- W3C Trace Context (traceparent/tracestate). ([W3C][13])
- STRIDE threat categories (Microsoft + OWASP). ([Microsoft Learn][14])
- Least privilege (NIST glossary). ([NIST Computer Security Resource Center][15])
- OWASP Logging Cheat Sheet. ([OWASP Cheat Sheet Series][16])

Release engineering:

- Deployment pipeline (Fowler) + SemVer + changelog discipline + feature toggles. ([martinfowler.com][17])
- Trunk-based development (Atlassian). ([atlassian.com][18])

[1]: https://agilemanifesto.org/?utm_source=chatgpt.com "Manifesto for Agile Software Development"
[2]: https://scrumguides.org/docs/scrumguide/v2020/2020-Scrum-Guide-US.pdf?utm_source=chatgpt.com "2020 Scrum Guide"
[3]: https://www.martinfowler.com/bliki/BoundedContext.html?utm_source=chatgpt.com "Bounded Context"
[4]: https://learn.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/ddd-oriented-microservice?utm_source=chatgpt.com "Designing a DDD-oriented microservice - .NET"
[5]: https://martinfowler.com/eaaDev/EventSourcing.html?utm_source=chatgpt.com "Event Sourcing"
[6]: https://learn.microsoft.com/en-us/azure/azure-functions/durable/durable-functions-code-constraints?utm_source=chatgpt.com "Durable orchestrator code constraints - Azure Functions"
[7]: https://docs.temporal.io/develop/go/side-effects?utm_source=chatgpt.com "Side Effects - Go SDK | Temporal Platform Documentation"
[8]: https://docs.stripe.com/api/idempotent_requests?utm_source=chatgpt.com "Idempotent requests | Stripe API Reference"
[9]: https://sqlite.org/wal.html?utm_source=chatgpt.com "Write-Ahead Logging"
[10]: https://electronjs.org/docs/latest/tutorial/ipc?utm_source=chatgpt.com "Inter-Process Communication"
[11]: https://martinfowler.com/articles/practical-test-pyramid.html?utm_source=chatgpt.com "The Practical Test Pyramid"
[12]: https://opentelemetry.io/docs/specs/otel/logs/?utm_source=chatgpt.com "OpenTelemetry Logging"
[13]: https://www.w3.org/TR/trace-context/?utm_source=chatgpt.com "Trace Context"
[14]: https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool-threats?utm_source=chatgpt.com "Microsoft Threat Modeling Tool - Azure"
[15]: https://csrc.nist.gov/glossary/term/least_privilege?utm_source=chatgpt.com "least privilege - Glossary | CSRC"
[16]: https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html?utm_source=chatgpt.com "Logging - OWASP Cheat Sheet Series"
[17]: https://martinfowler.com/bliki/DeploymentPipeline.html?utm_source=chatgpt.com "Deployment Pipeline"
[18]: https://www.atlassian.com/continuous-delivery/continuous-integration/trunk-based-development?utm_source=chatgpt.com "Trunk-based Development"
