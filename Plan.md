# Interface improvement plan

Prepared October 6, 2026. Scope: the existing `/app` research cockpit. Preserve the dark analyst terminal, zero dependencies, public-evidence rules, real NDJSON progress, private audience, and existing local edits. `AGENTS.md` is canonical; `CLAUDE.md` reinforces it.

## Research and design direction

Make every decision inspectable: keep compact metrics for scanning, put source records one click away, and turn strategies into follow-up work. Research and an independent risk audit were delegated to subagents; implementation and publication stay with the owning agent.

- [Carbon data tables](https://www.carbondesignsystem.com/building-blocks/core/components/data-table/guidelines): use a table toolbar, selection, filtering and progressive detail. Adapt these patterns to the small competitor roster without importing a component library.
- [USWDS tables](https://designsystem.digital.gov/components/table/): preserve semantic headers/captions and contain wide tables in a keyboard-accessible scroll region.
- [USWDS alerts](https://designsystem.digital.gov/components/alert/): make actionable status and failures persistent and concise.
- [GOV.UK task lists](https://design-system.service.gov.uk/components/task-list/): show task status for work resumed across sessions. Owners and validation notes are our capture-workflow adaptation.

## Workflows and implementation

1. **First-time analyst / new pursuit:** show honest awaiting-review values, empty evidence and strategies, and idle stages. Use input placeholders. Keep a persistent report context and streamed stage detail. Clear stale reports when starting again; prevent intake changes while research runs. Surface errors beyond a transient toast.
2. **Competitive analyst:** add company/UEI search, threat filter, explicit sort control, result count and reset. Preserve original rank; select up to three companies for a side-by-side comparison of observed obligations and inferred market signals. Include public evidence in both roster and comparison. Base obligation bars on amounts, not scores.
3. **Gate reviewer:** add an Evidence view with connector outcomes, public recipient facts, SAM notices, news, SEC filings, strategic inference/confidence/basis and all limitations. Existing connector/rationale buttons open it. Keep model reasoning distinct from public records; validate HTTP(S) links. Include evidence and reasoning provenance in Markdown export.
4. **Capture lead:** extend existing browser-only workboard with owner, validation notes and ready count. Migrate existing status strings on use, retain storage keys, disclose local persistence, and show save failures. Label history actions “Use inputs” because full reports are not stored.

## Acceptance checks

- No invented result or active pipeline before a run; no old result associated with new inputs.
- All navigation, filters, comparison, source links and workboard controls work with keyboard access and meaningful empty states.
- Comparison selection survives filtering but resets for new reports; maximum three selections.
- Report limitations and model/template provenance remain visible and exportable; no API contract changes.
- Existing local workboard values migrate without loss; storage failure is visible.
- Desktop and narrow layouts contain tables without page overflow; existing palette/type/spacing tokens remain.
- Run `git diff --check`, `npm run build`, `npm test`, client behavior verification, and publish to the same private Site.

## Visual refresh (Purity UI reference)

Prepared October 6, 2026 from the Purity UI Dashboard Figma file. The Figma node was a cover board of light, teal-accent screens, so only structural patterns were borrowed (KPI icon tiles, chart card, avatar tiles, inline progress bars, rail status card). The light theme, teal accent and large soft cards were rejected to keep the analyst-terminal system in `AGENTS.md`.

Shipped: KPI icon tiles; real-data obligations bar chart; initials tiles; roster signal bars; nav icon tiles; rail connector-status card from `/api/health`; "Copy summary"; "Fill in a sample pursuit". Verified by 13 passing tests and headless-Chrome screenshots of the empty state and a fixture-populated state (fixture used only in a scratch copy, never in the repo). Mobile layout and keyboard flows were not visually verified.

Candidate next steps: save full reports locally for history diffs, a threat-mix summary strip, and a printable brief view.

## Deferred

Cross-device collaboration, full historical snapshots/diffs, background campaigns and document uploads need deliberate persistence/privacy design and are outside this interface iteration. No new connectors, dependencies, secret handling or fabricated evidence.

## Delivery status

Implemented all four workflow improvements in `dist/index.html`; README and agent guidance are synchronized. Public API shape and server orchestration are unchanged by this interface work. Existing user edits were preserved.

Verification: `git diff --check` and `npm run build` passed; all 11 tests passed, including the live public-source NDJSON test and five deterministic client tests. An independent subagent reviewed the implementation; its storage-failure findings were addressed with an in-tab draft and guarded history-clear feedback.

Visual QA limitation: the local server started, but browser automation surfaces were unavailable and native Chrome inspection failed with a screen-capture error. Desktop/mobile visual appearance and manual keyboard flows have not been verified. Responsive layouts use contained table scrolling and existing design tokens; automated tests are not a substitute for that visual check.

Publication: prepared for the existing owner-private Site using the unchanged project identity. The final handoff reports the deployment outcome.
