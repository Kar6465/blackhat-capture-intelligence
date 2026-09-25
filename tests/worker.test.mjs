import test from "node:test";
import assert from "node:assert/strict";
import worker from "../dist/server/index.js";

test("serves the landing page at the root", async () => {
  const response = await worker.fetch(new Request("https://example.test/"), {});
  assert.equal(response.status, 200);
  assert.match(await response.text(), /Launch cockpit/);
});

test("serves the research cockpit at /app", async () => {
  const response = await worker.fetch(new Request("https://example.test/app"), {});
  assert.equal(response.status, 200);
  assert.match(await response.text(), /Opportunity review/);
});

test("health reports optional SAM and model configuration", async () => {
  const response = await worker.fetch(new Request("https://example.test/api/health"), {});
  assert.deepEqual(await response.json(), { ok: true, samConfigured: false, modelConfigured: false, version: "0.4.0" });
});

test("rejects incomplete research requests", async () => {
  const response = await worker.fetch(new Request("https://example.test/api/research", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ opportunity: "", agency: "" }),
  }), {});
  assert.equal(response.status, 400);
  assert.match((await response.json()).error, /required/);
});

test("rejects malformed JSON bodies", async () => {
  const response = await worker.fetch(new Request("https://example.test/api/research", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "not json",
  }), {});
  assert.equal(response.status, 400);
  assert.match((await response.json()).error, /valid JSON/);
});

test("streams stage progress and a terminal result event for a live run", async () => {
  const response = await worker.fetch(new Request("https://example.test/api/research", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      opportunity: "GSA OASIS+ Total Small Business — Domain 5",
      agency: "General Services Administration",
      incumbent: "Booz Allen Hamilton",
    }),
  }), {});
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "application/x-ndjson; charset=utf-8");

  const lines = (await response.text()).trim().split("\n");
  const events = lines.map((line) => JSON.parse(line));

  const stageAgents = events.filter((e) => e.type === "stage").map((e) => e.agent);
  assert.deepEqual([...new Set(stageAgents)], [
    "Opportunity Analyst",
    "Market Researcher",
    "Black Hat Strategist",
    "Evidence Reviewer",
  ]);

  const terminal = events.at(-1);
  assert.equal(terminal.type, "result");
  assert.ok(terminal.report.competitors.length > 0);
  assert.equal(terminal.report.meta.strategistMode, "template");
  assert.equal(terminal.report.meta.reviewerMode, "template");
  assert.ok(typeof terminal.report.summary === "string" && terminal.report.summary.length > 0);
  assert.equal(terminal.report.decision.bidderCount, terminal.report.competitors.length);
});
