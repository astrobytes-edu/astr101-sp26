# Demos Compute Provider Contract

*A durable, enforceable quality bar for “compute backends” used by interactive demos (local JS, WebWorker, WASM, or a remote API).*  
Version: v0.1 • Status: Proposed → Active upon adoption • Owner: Instructor

---

## 0) Why this exists (the problem it solves)

Cosmic Playground demos start as lightweight, browser-native models. Over time, you may want:

- **Heavier computation** (N-body, star clusters, long integrations, parameter sweeps)
- **Higher fidelity** models (extra terms, perturbations, better numerics)
- **More verification** (invariants, regression tests, “truth model” comparisons)

This contract defines a single interface for “do the math” that can be implemented by:

- **Local compute** (ESM JS/TS running in the main thread)
- **Worker compute** (WebWorker to avoid UI jank)
- **WASM compute** (performance-critical kernels)
- **Remote compute** (a server endpoint; future option)

So demos can evolve from “toy model” → “research-adjacent model” without rewriting UI.

---

## 1) Scope

This contract applies to:
- any shared compute provider implementation under `demos/_assets/` (or future `src/` for Cosmic Playground)
- demo controllers that call a provider for model outputs
- any remote compute API used by a demo

It does **not** apply to:
- CSS/theme assets
- page layout and marketing site content (unless they directly implement compute)

Related contracts:
- `docs/contracts/demos-physics-library-contract.md` (constants, units, pure physics code)
- `docs/contracts/demo-pedagogy-contract.md` (learning design + instructor resources)

---

## 2) Core design invariants (non-negotiable)

### 2.1 Pluggable compute (local ↔ remote)

Every demo that uses compute must be able to swap providers with **no UI rewrite**:

- `LocalComputeProvider` (default; runs in browser)
- `RemoteComputeProvider` (future; `fetch()` to your API)

**Constraint:** provider selection must not change the meaning of inputs/outputs; only performance and fidelity.

### 2.2 Deterministic, testable outputs

Given the same request payload, the provider must return the same result **up to a documented tolerance**.

- If stochastic elements exist, the request must include an explicit `seed`.
- If results depend on a “constants set,” the response must report which one was used.

### 2.3 Units are explicit in field names

All numeric fields crossing the provider boundary must encode units in the field name:

- examples: `tS`, `dtS`, `xCm`, `vxCms`, `massG`, `latDeg`, `lonDeg`, `tiltDeg`, `distanceKm`

This rule keeps the contract **demo-agnostic** while remaining scientifically safe.

If a value is dimensionless, use a clear suffix:

- `ecc` (eccentricity)
- `phaseFrac` (0–1)
- `illuminationFrac` (0–1)

### 2.4 No hidden global state

Compute must be a pure transformation of input → output:

- no reliance on DOM
- no reliance on global demo state
- no hidden caches that change results (caching is allowed, but must be transparent and correctness-preserving)

---

## 3) The interface (the minimum “API surface”)

### 3.1 Canonical interface (JS/TS pseudo-types)

```ts
type ComputeSeverity = "info" | "warning" | "error";

type ComputeMessage = {
  code: string;          // stable identifier (e.g., "INVARIANT_ENERGY_DRIFT")
  severity: ComputeSeverity;
  message: string;       // human-readable
  details?: unknown;     // optional structured info for logs
};

type ComputeProvenance = {
  providerId: string;        // e.g., "local-js", "worker-js", "remote-api"
  providerVersion: string;   // semver-ish
  modelId: string;
  modelVersion: string;      // semver-ish; aligns with demo/model code version
  constantsVersion?: string; // e.g., git sha or "AstroConstants@v0.1"
};

type ComputeRequest = {
  apiVersion: "v0";
  modelId: string;           // e.g., "two-body", "seasons", "eclipse-geometry"
  operationId: string;       // e.g., "simulate", "sample", "solve"
  params: Record<string, unknown>;  // model/operation-specific (but unit-bearing keys!)
  options?: {
    seed?: number;
    fidelity?: "fast" | "default" | "accurate";
    maxOutputPoints?: number;   // avoid huge payloads for remote provider
  };
};

type ComputeResponse = {
  ok: boolean;
  result?: Record<string, unknown>;
  diagnostics?: Record<string, unknown>;
  messages?: ComputeMessage[];
  provenance: ComputeProvenance;
  error?: {
    code: string;
    message: string;
  };
};

type ComputeContext = {
  signal?: AbortSignal;     // supports cancellation (required for remote + long runs)
};

interface ComputeProvider {
  compute(req: ComputeRequest, ctx?: ComputeContext): Promise<ComputeResponse>;
}
```

### 3.2 Required behavior

- Provider must return `provenance` on every response (success or failure).
- Provider must return `ok=false` with a stable `error.code` for validation failures.
- Provider must surface “model limitation” notices as `messages[]` when relevant (e.g., toy-model approximations).

---

## 4) Contract for model/operation schemas (how we stay flexible)

Because this provider supports **many demos**, we do not hard-code one schema.
Instead, each `(modelId, operationId)` must have a short schema doc in one place:

- **Now (in this repo):** `docs/specs/demos-physics-library-spec.md` may host these mini-schemas.
- **Future (separate Cosmic Playground repo):** create `docs/specs/compute-operations/`.

Each mini-schema must specify:

1. **Purpose:** what this operation computes (observable → model → inference)
2. **Inputs:** required `params` keys (with units and valid ranges)
3. **Outputs:** `result` keys (with units and shapes)
4. **Diagnostics:** what invariants / sanity checks are returned (if any)
5. **Approximation disclosure:** what is *not* modeled (`toy`/`approx`)
6. **Performance intent:** interactive (frame‑budget scale) vs batch (multi‑second scale)

---

## 5) Error handling + safety

### 5.1 Validation

Providers must validate inputs and fail loudly:

- missing required params → `error.code = "INVALID_REQUEST_MISSING_PARAM"`
- invalid ranges (e.g., negative mass) → `error.code = "INVALID_REQUEST_RANGE"`

### 5.2 Cancellation

Long-running operations must be cancelable using `AbortSignal`.

### 5.3 Remote provider safety (future)

If/when a remote provider exists:

- Never accept arbitrary code execution.
- Strictly validate JSON payload size and numeric ranges.
- Provide rate limiting and caching (same request → cached response).

---

## 6) Verification gates (required before claiming “done”)

All provider implementations must have tests.

Minimum:

- **Unit tests** for each operation’s core math (Node)
- **Property tests / sanity checks** (e.g., conservation laws for integrators where applicable)
- **Golden-vector regression tests** (future): generated by Python/JAX truth models

Before declaring the compute provider “production-ready” in this repo:

```bash
node --test
conda run -n astro python scripts/check_demo_polish.py
conda run -n astro python scripts/demo_static_checks.py
conda run -n astro make render
```

---

## 7) Roadmap hooks (planned, not required in v0)

These are explicitly “future-ready” hooks we may add later without breaking the contract:

- **Streaming results** for realtime sims (chunked time series)
- **Progress callbacks** (`onProgress({pct, stage})`)
- **Server-side batching** for parameter sweeps
- **Cross-check endpoints** (`operationId="validate"`) that return invariant drift summaries

---

## 8) Example (illustrative only)

### Example request (two-body orbit sampling)

```json
{
  "apiVersion": "v0",
  "modelId": "two-body",
  "operationId": "sample-orbit",
  "params": {
    "aCm": "<number>",
    "ecc": "<number: 0 <= ecc < 1>",
    "muCgs": "<number>",
    "nSamples": "<integer>"
  },
  "options": { "fidelity": "default" }
}
```

### Example response (shape sketch)

```json
{
  "ok": true,
  "result": {
    "thetaRad": ["<number>", "<number>", "..."],
    "rCm": ["<number>", "<number>", "..."],
    "xCm": ["<number>", "<number>", "..."],
    "yCm": ["<number>", "<number>", "..."]
  },
  "diagnostics": {
    "minRCm": "<number>",
    "maxRCm": "<number>"
  },
  "messages": [],
  "provenance": {
    "providerId": "local-js",
    "providerVersion": "v0.1",
    "modelId": "two-body",
    "modelVersion": "v0.1",
    "constantsVersion": "AstroConstants@v0.1"
  }
}
```
