# Claude Code Instructions

Read and follow [`AGENTS.md`](./AGENTS.md) as the canonical project guide. Its architecture, security, evidence, testing, and deployment rules apply to every change.

## Claude-specific checklist

1. Inspect `AGENTS.md` and the files directly relevant to the request before editing.
2. Never inspect or output `.env`; use `.env.example` to understand supported variables.
3. Make server changes in `src/worker.js` and browser changes in `dist/index.html`.
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

When adding a new connector, implement it as a bounded server-side tool used by the existing orchestrator. Do not create a new “agent” merely because a new data source was added.
