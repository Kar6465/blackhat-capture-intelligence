import test from "node:test";
import assert from "node:assert/strict";
import worker from "../dist/server/index.js";

test("serves the research cockpit", async () => {
  const response = await worker.fetch(new Request("https://example.test/"), {});
  assert.equal(response.status, 200);
  assert.match(await response.text(), /Agentic Black Hat Review/);
});

test("health reports optional SAM configuration", async () => {
  const response = await worker.fetch(new Request("https://example.test/api/health"), {});
  assert.deepEqual(await response.json(), { ok: true, samConfigured: false, version: "0.2.0" });
});

test("rejects incomplete research requests", async () => {
  const response = await worker.fetch(new Request("https://example.test/api/research", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ opportunity: "", agency: "" }),
  }), {});
  assert.equal(response.status, 502);
  assert.match((await response.json()).error, /required/);
});
