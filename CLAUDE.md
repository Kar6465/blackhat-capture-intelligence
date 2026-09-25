# Claude Code Instructions

Read and follow [`AGENTS.md`](./AGENTS.md) as the canonical project guide. Its architecture, security, evidence, testing, and deployment rules apply to every change.

## Claude-specific checklist

1. Inspect `AGENTS.md` and the files directly relevant to the request before editing.
2. Never inspect or output `.env`; use `.env.example` to understand supported variables.
3. Make server changes in `src/worker.js`, cockpit app changes in `dist/index.html`, and landing-page changes in `dist/landing.html`.
4. Never hand-edit generated `dist/server/index.js`.
5. Rebuild and verify with:

```bash
git diff --check
npm run build
npm test
```

6. Keep public-source facts distinct from strategic inferences.
7. Do not claim CPARS access or fabricate unavailable data.
8. Preserve the existing OpenAI Sites `project_id` and private deployment configuration.
9. Do not adopt LangChain, LangGraph, or any other agent framework without re-reading `AGENTS.md`'s "Why no LangChain / LangGraph" section first — it's a deliberate call, not a gap, given the stateless single-`fetch()` deployment shape and zero-dependency policy.
10. When touching `dist/index.html`, read `AGENTS.md`'s "Design system" section first and preserve it — the UI was deliberately redesigned away from generic dark-SaaS/AI-landing-page conventions (single-accent glow shadows, pill badges, decorative unicode arrows, one typeface everywhere). Don't drift back toward those defaults, including when using a design or Figma skill for inspiration.
11. Use `RequestError` (see AGENTS.md's "Error status codes") for anything that's the caller's fault; don't let client errors and pre-stream/in-stream runtime failures collapse onto the same status code — see AGENTS.md "Streaming progress" for why `POST /api/research` splits these into a real HTTP status (pre-stream) vs. an in-band `error` event (once streaming has started).
12. If you add or change a model-backed step, use the shared `callModelJSON()` helper, degrade to deterministic/template behavior on any failure (no key, timeout, bad output), and report which path actually ran via a `*Mode` field — see `generateStrategiesWithModel()`/`generateSummaryWithModel()` for the pattern.
15. `/api/research` streams NDJSON, not one JSON blob — don't revert `runResearch()` to a plain return-only function or `scripts/dev.mjs`'s streaming pipe back to `await response.arrayBuffer()` buffering. See AGENTS.md "Streaming progress."
16. `.env` is loaded by `scripts/dev.mjs` itself (`process.loadEnvFile()`) — don't assume a user's shell already exports these vars, and don't add the `dotenv` package for this.
13. Never add a nav item, tab, or button that does nothing, and never fill one with data presented as real that isn't — bind new UI to real state (`latestReport`, `localStorage`) or give it an honest empty state. This project treats fabricated-looking placeholder content as a defect, not a stopgap, in both the research output and the UI shell.
14. Before shipping a new text/background color pairing, check contrast against WCAG AA (4.5:1 normal text, 3:1 large text/non-text) rather than eyeballing it — `--muted-dim` shipped at ~3:1 once and had to be fixed.

When adding a new connector, implement it as a bounded server-side tool used by the existing orchestrator. Do not create a new “agent” merely because a new data source was added.
