# BlackHat Capture Intelligence — Agent Guide

This file is the canonical working guide for AI coding agents in this repository.

## Product

BlackHat Capture Intelligence is a private research cockpit for federal capture teams. A user enters an opportunity, agency, and optional incumbent. The server queries public federal-market sources, ranks likely competitors, separates evidence from inference, recommends counter-strategies, and exports a gate-review brief.

This is decision support, not an authoritative source-selection system. Never describe a ranked company as a confirmed bidder without direct evidence.

## Repository layout

- `src/worker.js` — Cloudflare-compatible server entry and research orchestration.
- `dist/landing.html` — source for the public marketing/landing page, served at `/`.
- `dist/index.html` — source for the research cockpit app, served at `/app`.
- `dist/server/index.js` — generated deployable Worker. Do not edit by hand.
- `scripts/build.mjs` — embeds both `dist/landing.html` and `dist/index.html` into `src/worker.js` and writes the deployable Worker.
- `scripts/dev.mjs` — local Node adapter for the Worker.
- `tests/worker.test.mjs` — server smoke and validation tests.
- `.openai/hosting.json` — Sites project identity. Preserve `project_id` exactly.
- `.env.example` — documented optional environment variables.

## Commands

```bash
npm run build
npm test
npm run dev
```

The local app runs at `http://127.0.0.1:4173/`. `scripts/dev.mjs` loads `.env` itself via Node's built-in `process.loadEnvFile()` (no `dotenv` dependency) and forwards `SAM_API_KEY`/`OPENAI_API_KEY`/`OPENAI_MODEL` into `env` — don't assume the shell already has these exported; edit `.env` and restart `npm run dev`.

Always run `npm run build` before tests because tests import `dist/server/index.js`. Before finishing a change, run:

```bash
git diff --check
npm run build
npm test
```

## Agent architecture

The orchestrator is `runResearch(input, env, emit)` in `src/worker.js`. It coordinates four specialized logical agents:

1. **Opportunity Analyst** — validates and normalizes the opportunity, agency, and incumbent.
2. **Market Researcher** — resolves the agency and collects award/recipient signals.
3. **Black Hat Strategist** — ranks competitors and produces clearly labeled strategic inferences.
4. **Evidence Reviewer** — checks every connector, writes an evidence-bound gate-review summary, and preserves limitations.

These are logical workflow components, not independent long-running processes: a single `fetch()` call runs the whole pipeline sequentially/in parallel and returns one response. That response is streamed, though — see "Streaming progress" below — so the client's `.pipeline` bar reflects *real* stage transitions from `emit()`, not a decorative timer. Keep that distinction ("one request, real streamed progress" — not "independent long-running agents") clear in UI copy and documentation.

### Streaming progress

`POST /api/research` returns newline-delimited JSON (NDJSON, `content-type: application/x-ndjson`), not one JSON blob. `runResearch()` calls `emit(event)` at each stage transition via the `stageEvent()` helper:

```json
{"type":"stage","agent":"Market Researcher","status":"running","detail":"..."}
{"type":"stage","agent":"Market Researcher","status":"complete","detail":"..."}
```

followed by exactly one terminal event — either

```json
{"type":"result","report":{ ...the full report object, same shape as before... }}
```

or

```json
{"type":"error","message":"...","status":422}
```

**Status-code contract, split in two:**
- *Pre-stream* validation (`validateResearchInput()`, malformed JSON, the 50KB size cap) is checked synchronously in the fetch handler **before** the `ReadableStream` is constructed, so it still returns a real, immediate HTTP 400/413 — exactly like any other error. This is deliberately duplicated with the same check inside `runResearch()` (both call `validateResearchInput()`) rather than trusted to only the handler, so `runResearch()` stays safe to call directly (e.g. from a test) without bypassing validation.
- Once the stream starts, the HTTP status is fixed at 200 — you cannot retroactively send a 422/502/504 after bytes have been written. A `RequestError` or upstream timeout thrown inside `runResearch()` is caught by the handler's `start()` callback and reported as the terminal `{"type":"error", status: ...}` event instead. The client throws on that event and shows the message the same way it would a rejected fetch.

The **client** (`dist/index.html`, in the `run` click handler) reads `response.body.getReader()`, buffers partial lines across chunks (`TextDecoder` with `{stream: true}`), and dispatches on `event.type` via `applyStageEvent()`. **`scripts/dev.mjs`** pipes the Worker's `ReadableStream` to the Node response chunk-by-chunk (not `await response.arrayBuffer()`) so local dev actually demonstrates real streaming — don't reintroduce buffering there.

Model calls themselves are **not** token-streamed — JSON-schema structured output isn't valid mid-stream JSON, so the Strategist/Evidence-Reviewer model calls remain single atomic `await`s. Only stage-level progress streams.

### Why no LangChain / LangGraph (revisit only if this changes)

This is a deliberate architecture decision, not an oversight:

- **Deployment shape.** The deployable unit is a single stateless `export default { fetch(request, env) }` handler (Cloudflare-Workers-style, hosted on OpenAI Sites). One HTTP request in, one JSON response out, no persistent process, no filesystem. LangGraph's value (durable execution, checkpointers, resumable threads, human-in-the-loop interrupts) requires state that survives across requests — none of that exists here, so adopting it would add a large dependency for zero benefit.
- **Dependency budget.** `package.json` intentionally has zero dependencies. LangChain/LangGraph pull in a large transitive tree, which grows cold-start time and the supply-chain surface of a tool that handles capture-sensitive data. Don't add either without a concrete requirement that a ~150-line hand-rolled orchestrator can't satisfy.
- **Actual orchestration need is small.** Four sequential/parallel steps, a handful of bounded `fetch()` calls to public data sources, and at most one model call (see below). That is well within reach of plain `async`/`await` with explicit timeouts, which also makes it easy to enforce the evidence/inference rules below precisely — a framework's abstractions would make that harder to audit, not easier.
- **When to revisit:** if the product grows real multi-turn state — background/long-running capture campaigns, multi-day research with memory, human-in-the-loop gate approvals that pause and resume — that is when a durable-execution framework (LangGraph or otherwise) starts earning its cost. Until then, keep the orchestrator hand-rolled.

### Model-backed steps (optional)

`callModelJSON({ instructions, input, schema, schemaName, env, timeoutMs })` in `src/worker.js` is the one shared helper for every optional model call (OpenAI Responses API, structured JSON-schema output). It returns `null` on **any** failure — no key, timeout, malformed output — never throws. Two agents currently use it:

- **Black Hat Strategist** — `generateStrategiesWithModel()`, falls back to the fixed templates in `createStrategies()`. Reports which path ran via `meta.strategistMode` (`"model"` | `"template"`).
- **Evidence Reviewer** — `generateSummaryWithModel()`, falls back to the deterministic sentence in `createSummary()`. Reports which path ran via `meta.reviewerMode` (`"model"` | `"template"`), rendered in `report.summary`.

Both are gated by the same `OPENAI_API_KEY` (optional, same pattern as `SAM_API_KEY` — unset by default) and `OPENAI_MODEL` (optional override, defaults to `gpt-4o-mini`). **A research run must never fail because a model call failed** — this is enforced by `callModelJSON()` returning `null` on any error and every caller treating `null` as "use the deterministic path."

Both prompts instruct the model to use only the evidence it's given, to label everything as inference, and to never claim a confirmed bidder, invented contract vehicle, or fabricated performance rating — the same rules that apply to every deterministic path. Do not loosen either system prompt without updating the Evidence rules section below to match.

The `"Model reasoning (OpenAI)"` entry in `evidence.sources` and the `#strategyFlag`/`#summaryFlag` UI elements tell the client (and the capture team) which path actually ran. Keep these truthful — never report `"model"` when a fallback ran.

If you add a third model-backed step, follow the same shape: call `callModelJSON()`, hard-fallback to a deterministic function on `null`, and add a `*Mode` field to the response so failures are visible rather than silent.

## External data sources

- **USAspending** is the default live source and requires no key.
- **SAM.gov** is optional and uses the server-side `SAM_API_KEY` secret.
- **GDELT** is best-effort news enrichment and may rate-limit requests.
- **SEC EDGAR** (`searchSecFilings()`) is a real, public, no-key full-text search connector (`efts.sec.gov`) for the top-ranked competitor's filings — best-effort like GDELT, empty list on any failure. Filing URLs are reconstructed from the search hit's CIK + accession number + filename (`https://www.sec.gov/Archives/edgar/data/{cik}/{accession}/{filename}`); if you change this, verify the constructed URL actually resolves (200) before shipping — a broken "evidence" link is worse than none.
- **CPARS** is restricted. Do not scrape, simulate access to, or claim to retrieve CPARS evaluations.
- **OpenAI Responses API** is optional model-backed reasoning for the Strategist and Evidence Reviewer agents (see Model-backed steps above), gated by `OPENAI_API_KEY`.

All external requests must:

- originate server-side;
- use bounded timeouts;
- tolerate upstream failure without fabricating evidence;
- store or return the source name and URL;
- avoid exposing credentials to browser code;
- avoid treating search results as proof that a company will bid.

## Evidence rules

Maintain the boundary between facts and inferences:

- A **fact** must identify a source and contain a reproducible public-data statement.
- An **inference** must be labeled as an inference and include a confidence score or basis.
- Never invent citations, award values, incumbents, bidders, contract vehicles, or performance ratings.
- If a source fails, mark it unavailable or limited. Do not silently substitute demo data after a user starts a live run.
- Preserve the existing limitations returned by the API unless a verified implementation makes one obsolete.

## Security and privacy

- Never read, print, log, commit, or expose `.env` contents.
- Never put `SAM_API_KEY`, `OPENAI_API_KEY`, or any future secret into `dist/index.html` — they must only ever be read server-side from `env` inside `src/worker.js`.
- Do not commit credentials, tokens, downloaded restricted records, or user-uploaded solicitations.
- Sanitize user-controlled strings before inserting them into HTML.
- Keep request-size checks, timeouts, and response security headers intact.
- Treat opportunity and capture data as potentially sensitive even when the underlying sources are public.

## Editing guidance

- Edit `src/worker.js` for server behavior.
- Edit `dist/index.html` for cockpit app behavior and styling; edit `dist/landing.html` for the public marketing page.
- Rebuild instead of directly editing `dist/server/index.js`.
- Preserve the current dark, high-density analyst-cockpit design unless a redesign is explicitly requested.
- The cockpit app (`dist/index.html`) is a tabbed workspace, not a single screen: `Review cockpit` (intake → agent progress → decision → competitors → strategies) is the default view, plus `Competitors` (full-precision roster table), `Win themes` (a capture workboard), and `Past reviews` (locally-stored run history). Views are switched client-side via `data-view` attributes and `showView()` — no server round-trip, no new route. Keep every tab genuinely functional; never add a nav item that does nothing when clicked, and never seed a tab with fabricated data presented as real — bind it to `latestReport` or to `localStorage`, or give it an honest empty state.
- `localStorage` is used for `Win themes` status and `Past reviews` history (keys `blackhat.workboard.v1` / `blackhat.history.v1`). This is client-only, per-browser state — the worker stays stateless and this data is never sent to the server. Say so explicitly in the UI wherever it's shown (see `.history-caveat`), since capture-sensitive opportunity data persisting anywhere deserves disclosure even when it never leaves the user's device.
- Maintain mobile responsiveness and accessible labels.
- Avoid adding dependencies unless they solve a concrete requirement.

### Design system ("analyst terminal", not generic AI-SaaS)

The UI was deliberately moved away from generic dark-dashboard/AI-landing-page conventions. When touching `dist/index.html`, preserve these choices rather than drifting back toward the defaults below — they were removed on purpose:

- **Typography is a deliberate sans/mono pair**, not one font everywhere. Body text, headings, and buttons use the system sans stack (`var(--font-sans)`); anything that is *data* — metric values, scores, money amounts, badges, timestamps, nav captions, pipeline stage labels — uses `var(--font-mono)`. Do not collapse this back to a single typeface, and do not add an external font (Inter or otherwise) — no external network requests are loaded by this page, and the CSP has no `font-src` for one.
- **The accent color (`--accent`, burnt orange) is reserved** for the primary CTA, the active nav indicator, and the brand mark only. It is not a decoration — don't add glow `box-shadow`s, gradient panel backgrounds, or apply the accent to arbitrary UI chrome. Status meaning (threat level, connector health) uses the separate `--good`/`--warn`/`--critical` trio, which is intentionally distinct from the accent and from the sequential bar hues (`--seq-1`/`--seq-2`) so no color does double duty.
- **No decorative unicode arrows** (↗ ↓ → etc.) on buttons or headings. The only unicode glyph kept is the `›` row-chevron, which is a real affordance (opens an external evidence link) — restyle it, don't multiply it.
- **The win-probability ring (`.go-ring`) is real data**, bound via the `--pct` and `--ring-color` CSS custom properties set in `renderReport()`, not a static decorative circle. If you change its markup, keep it computed from `decision.winProbability`/`decision.recommendation` rather than hardcoding an arc.
- **Corners are restrained**: cards ~9px, inputs/buttons/badges ~5px. Don't reintroduce large pill-shaped badges or heavily rounded (14px+) cards — that reads as generic template UI for this product's audience (federal capture teams), which benefits from a more instrument-panel, less consumer-SaaS feel.
- **Badges must cover all three threat states** the backend can emit — `High threat` / `Medium` / `Watch` — via the `badgeClass` map in the script. Don't go back to a two-way ternary that collapses `Watch` into the `Medium` style; that was a real bug (a low-urgency competitor rendered with the same amber "Medium" badge as an actual medium threat).
- Keep the subtle fixed background grid (`body::before`) — it's pure CSS (no image asset), low-opacity, and is what most avoids the flat single-color-panel "AI dashboard mockup" look. Don't raise its opacity enough to compete with content.
- **Type and spacing are on fixed scales** — `--fs-1` through `--fs-6` (11/12/13/14/20/24px) and `--sp-1` through `--sp-10` (4px steps). Use the existing tokens; don't introduce a one-off font-size or an eyeballed margin/padding value outside the scale.
- **`--muted-dim` (#78818d) is contrast-checked against `--bg`** — computed at ~5.1:1, clears WCAG AA (4.5:1) for the small mono captions it's used on (nav labels, mini-labels, eyebrow text). If you darken it, recompute contrast; a prior value (`#545c67`, ~3:1) was a real AA failure that shipped before this was checked.
- **Never use a bare `transition: <duration> <easing>` shorthand** — it silently animates `all`. Name the properties explicitly (see `.toast`, `.nav-item` for the pattern).
- **`report.limitations` must be rendered**, not just carried in the API response — see `#caveatsList` in the cockpit view. It was silently dropped by the UI before this was caught; don't let that regress.
- **When the Strategist or Evidence Reviewer runs on a real model vs. the template fallback, disclose which** — see `#strategyFlag`/`#summaryFlag` and `report.meta.strategistMode`/`reviewerMode` in `renderReport()`. Don't remove this disclosure to simplify the UI; it's the product's main AI-trust signal.
- Respect `prefers-reduced-motion` (see the media query near `.pulse`) for any new motion you add.
- The pipeline stage bar (`.stage` elements, updated via `applyStageEvent()`) reflects **real** streamed backend progress, not a timer — see AGENTS.md "Streaming progress." Don't reintroduce a `setInterval`-driven fake animation.
- Export offers both JSON (`#exportBrief`) and a plain-Markdown gate-review brief (`#exportMarkdown`, built by `buildMarkdownBrief()`) — keep both in sync with the report shape if you add fields.

### Landing page (`dist/landing.html`)

Researched against current award-winning site patterns (Awwwards, notably Jeton's black/white-plus-orange restraint) before building. Keep these choices:

- **No stock photography or generic illustration.** For this product, real interface visuals beat stock imagery — that's also what current design-trend research shows converts better. The hero graphic is a custom canvas radar-sweep animation (on-theme: it's literally a "scan"), and the product section is a faithful miniature of the real cockpit's actual components and tokens, not a fake mockup.
- **The radar animation is decorative, not data** — it's explicitly captioned "Illustrative scan — not live data" and must stay that way; never wire it to imply it shows real results.
- **It has a real pause control** (`#radarToggle`), not just a `prefers-reduced-motion` fallback — WCAG 2.2.2 requires a user-facing way to stop auto-playing motion that isn't essential to the content, regardless of OS setting. Keep this if you add any other autoplaying animation.
- **Animated stat counters and scroll-reveal are gated behind `IntersectionObserver`** and skip straight to the end state under `prefers-reduced-motion` — don't replace with a library; it's ~20 lines of vanilla JS and adding a dependency for this is unjustified per the zero-dependency policy.
- Shares the app's design tokens (`--bg`, `--accent`, `--font-mono`, the `--fs-*`/`--sp-*` scales) so the two pages read as one product, not a marketing site bolted onto a different-looking app.

## API behavior

- `GET /` serves the public landing page (`dist/landing.html`).
- `GET /app` serves the research cockpit (`dist/index.html`).
- `GET /api/health` reports `{ ok, samConfigured, modelConfigured, version }`.
- `POST /api/research` accepts:

```json
{
  "opportunity": "Opportunity title or solicitation",
  "agency": "Full agency name",
  "incumbent": "Optional incumbent"
}
```

...and responds with NDJSON (see "Streaming progress" above), ending in a terminal `result` event whose `report` must retain these top-level sections:

- `meta` (includes `strategistMode` and `reviewerMode`, each `"model"` or `"template"`)
- `decision`
- `competitors`
- `strategies`
- `summary` — the Evidence Reviewer's gate-review paragraph
- `evidence` (now includes `evidence.sec`, alongside the existing `evidence.news`/`evidence.sam`)
- `agents`
- `limitations`

Add fields compatibly where possible because the browser renders this contract directly.

### Error status codes

`RequestError` (defined near the top of `src/worker.js`) carries an explicit HTTP status; throw it instead of a plain `Error` for anything that is the caller's fault. Pre-stream, the fetch handler maps errors to status codes as follows — preserve this distinction when adding new failure paths:

- **400** — malformed request body, or missing required fields (`opportunity`/`agency`).
- **413** — request body exceeds the 50 KB size cap.

Once `POST /api/research` starts streaming (i.e. `validateResearchInput()` passed), the HTTP status is fixed at 200 and a semantic status instead rides in the terminal `{"type":"error", status, message}` event:

- **422** — the request was well-formed but produced no usable result (e.g. no matching recipients found).
- **502** — an upstream data source returned an error or bad data.
- **504** — an upstream data source timed out (`AbortError`).

Don't collapse client errors (400) back into a runtime status — that was a real bug (a missing `agency` field and a genuine USAspending outage were indistinguishable to the client) and also leaked the raw `JSON.parse` error text for malformed bodies before it was fixed. Don't collapse the streaming-era 422/502/504 back onto the HTTP status either — bytes are already committed by the time those are known.

## Deployment

This project is deployed with OpenAI Sites as a server-backed Worker. Preserve `.openai/hosting.json` and the existing private audience. The deployable entry must remain at:

```text
dist/server/index.js
```

It must export a default object with an async `fetch(request, env)` method. Configure secrets through the hosting environment; do not add secrets to the manifest.

## Definition of done

A change is complete when:

- the UI still loads;
- affected API paths are tested;
- evidence/inference labeling remains accurate;
- `npm run build` succeeds;
- `npm test` passes;
- no secret or generated local state is staged;
- user-visible changes are published unless the user requested local-only work.
