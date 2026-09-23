# BlackHat Capture Intelligence — Agent Guide

This file is the canonical working guide for AI coding agents in this repository.

## Product

BlackHat Capture Intelligence is a private research cockpit for federal capture teams. A user enters an opportunity, agency, and optional incumbent. The server queries public federal-market sources, ranks likely competitors, separates evidence from inference, recommends counter-strategies, and exports a gate-review brief.

This is decision support, not an authoritative source-selection system. Never describe a ranked company as a confirmed bidder without direct evidence.

## Repository layout

- `src/worker.js` — Cloudflare-compatible server entry and research orchestration.
- `dist/index.html` — source HTML, CSS, and browser-side application code.
- `dist/server/index.js` — generated deployable Worker. Do not edit by hand.
- `scripts/build.mjs` — embeds `dist/index.html` into `src/worker.js` and writes the deployable Worker.
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

The local app runs at `http://127.0.0.1:4173/`.

Always run `npm run build` before tests because tests import `dist/server/index.js`. Before finishing a change, run:

```bash
git diff --check
npm run build
npm test
```

## Agent architecture

The orchestrator is `runResearch()` in `src/worker.js`. It coordinates four specialized logical agents:

1. **Opportunity Analyst** — validates and normalizes the opportunity, agency, and incumbent.
2. **Market Researcher** — resolves the agency and collects award/recipient signals.
3. **Black Hat Strategist** — ranks competitors and produces clearly labeled strategic inferences.
4. **Evidence Reviewer** — counts sources, reports connector status, and preserves limitations.

These are logical workflow components, not independent long-running processes. Keep that distinction clear in UI copy and documentation.

## External data sources

- **USAspending** is the default live source and requires no key.
- **SAM.gov** is optional and uses the server-side `SAM_API_KEY` secret.
- **GDELT** is best-effort news enrichment and may rate-limit requests.
- **SEC EDGAR** is represented in the evidence model but is not yet queried.
- **CPARS** is restricted. Do not scrape, simulate access to, or claim to retrieve CPARS evaluations.

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
- Never put `SAM_API_KEY` or future model keys into `dist/index.html`.
- Do not commit credentials, tokens, downloaded restricted records, or user-uploaded solicitations.
- Sanitize user-controlled strings before inserting them into HTML.
- Keep request-size checks, timeouts, and response security headers intact.
- Treat opportunity and capture data as potentially sensitive even when the underlying sources are public.

## Editing guidance

- Edit `src/worker.js` for server behavior.
- Edit `dist/index.html` for interface behavior and styling.
- Rebuild instead of directly editing `dist/server/index.js`.
- Preserve the current dark, high-density analyst-cockpit design unless a redesign is explicitly requested.
- Keep the primary workflow on one screen: intake → agent progress → decision → competitors → strategies.
- Maintain mobile responsiveness and accessible labels.
- Avoid adding dependencies unless they solve a concrete requirement.

## API behavior

- `GET /` serves the cockpit.
- `GET /api/health` reports version and optional SAM configuration.
- `POST /api/research` accepts:

```json
{
  "opportunity": "Opportunity title or solicitation",
  "agency": "Full agency name",
  "incumbent": "Optional incumbent"
}
```

Successful research responses must retain these top-level sections:

- `meta`
- `decision`
- `competitors`
- `strategies`
- `evidence`
- `agents`
- `limitations`

Add fields compatibly where possible because the browser renders this contract directly.

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
