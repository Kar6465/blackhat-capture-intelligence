# BlackHat Capture Intelligence

A private research cockpit for federal capture teams. Enter an opportunity, agency, and optional
incumbent; the server scans public federal award history, ranks the competitors most likely to
bid, separates evidence from inference, drafts counter-strategies, and exports a gate-review brief.

This is decision support, not an authoritative source-selection system. A ranked competitor is a
market signal from public award data, never a confirmed bidder.

## Quick start

```bash
npm run build   # embeds dist/landing.html and dist/index.html into src/worker.js
npm run dev     # serves the build at http://127.0.0.1:4173/
npm test        # runs server and client tests (rebuild first — server tests import dist/server/index.js)
```

`npm run dev` loads `.env` itself (Node's built-in `process.loadEnvFile()`) — copy
`.env.example` to `.env` and fill in whichever keys you have. Everything in it is optional; the
app runs on public data alone with none of them set.

## Routes

| Route | Serves |
|---|---|
| `GET /` | Public landing page |
| `GET /app` | The research cockpit |
| `GET /api/health` | `{ ok, samConfigured, modelConfigured, version }` |
| `POST /api/research` | Runs a review; streams NDJSON stage-progress events, ending in a `result` or `error` event |

## Data sources

| Source | Requires a key? | Role |
|---|---|---|
| USAspending | No | Default live source — five-year award/recipient history for the selected agency |
| SAM.gov | `SAM_API_KEY` | Open opportunity enrichment |
| GDELT | No | Best-effort recent news on the top-ranked competitor |
| SEC EDGAR | No | Best-effort recent filings for the top-ranked competitor |
| OpenAI Responses API | `OPENAI_API_KEY` | Optional model-backed reasoning for two of the four agents (see below) |

Every source is queried server-side with a bounded timeout and reported honestly when it's
unavailable — nothing is silently swapped for demo data mid-run.

## Agent pipeline

One request runs four logical agent stages, streamed to the client as they complete — not
independent long-running processes:

1. **Opportunity Analyst** — validates and normalizes the input.
2. **Market Researcher** — resolves the agency and pulls award/recipient history.
3. **Black Hat Strategist** — ranks competitors; drafts counter-strategies.
4. **Evidence Reviewer** — checks every connector and writes a gate-review summary.

Steps 3 and 4 reason over the gathered evidence with a real model call when `OPENAI_API_KEY` is
set, and fall back to deterministic templates otherwise — a run never fails because a model call
did. The UI discloses which path actually ran for a given result.

## Cockpit workflows

The cockpit starts without illustrative results. Run a review to populate the decision, competitors,
strategies and evidence. Persistent progress and error details reflect the server's real stages.

- **Competitors:** search by company or UEI, filter threats, sort, inspect source facts and compare up to three companies. Original rank is retained.
- **Evidence:** inspect connector availability, recipient facts, SAM notices, news, SEC filings, inference basis and limitations.
- **Win themes:** track status, owner and validation notes, with a ready count. Notes and status are stored only in this browser; save failures retain a temporary in-tab draft.
- **Past reviews:** reuse prior inputs for a fresh run. History contains summaries, not full saved reports.

JSON exports retain the report; Markdown briefs include source status, public references, model/template provenance and limitations. Workboard notes are separate browser-only state and are not included in report exports.

See [`Plan.md`](./Plan.md) for external design references, use cases and implementation scope.

## Project layout

See [`AGENTS.md`](./AGENTS.md) for the full architecture, orchestration rationale, evidence rules,
and API contract — it's the canonical guide this repo is built and reviewed against (by both human
and AI contributors).

- `src/worker.js` — server entry and research orchestration (Cloudflare Workers-style `fetch` handler).
- `dist/landing.html` / `dist/index.html` — landing page and cockpit app sources.
- `dist/server/index.js` — generated deployable Worker (`npm run build` output — don't hand-edit).
- `scripts/build.mjs` / `scripts/dev.mjs` — build and local dev server.
- `tests/worker.test.mjs` — server tests (these hit real public APIs; no mocking layer).
- `tests/interface.test.mjs` — deterministic client helper and state-reset tests.
- `Plan.md` — researched interface plan and delivery notes.

## Deployment

Deployed with OpenAI Sites as a server-backed Worker (`.openai/hosting.json`). The deployable
entry is `dist/server/index.js`, exporting a default object with an async `fetch(request, env)`
method. Configure secrets through the hosting environment, not the manifest.
