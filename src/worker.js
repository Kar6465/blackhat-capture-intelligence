const APP_HTML = __APP_HTML__;
const LANDING_HTML = __LANDING_HTML__;

const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
  "x-content-type-options": "nosniff",
};

const NDJSON_HEADERS = {
  "content-type": "application/x-ndjson; charset=utf-8",
  "cache-control": "no-store",
  "x-content-type-options": "nosniff",
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
}

class RequestError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

function clean(value, max = 180) {
  return String(value || "").replace(/[<>]/g, "").replace(/\s+/g, " ").trim().slice(0, max);
}

function clamp(value, low, high) {
  return Math.max(low, Math.min(high, value));
}

function compactMoney(value) {
  const amount = Number(value || 0);
  if (amount >= 1e9) return `$${(amount / 1e9).toFixed(1)}B`;
  if (amount >= 1e6) return `$${(amount / 1e6).toFixed(1)}M`;
  if (amount >= 1e3) return `$${(amount / 1e3).toFixed(0)}K`;
  return `$${amount.toFixed(0)}`;
}

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

async function fetchJson(url, options = {}, timeoutMs = 18000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    const text = await response.text();
    if (!response.ok) throw new Error(`Source returned ${response.status}`);
    return text ? JSON.parse(text) : {};
  } finally {
    clearTimeout(timer);
  }
}

function keywordsFrom(text) {
  const stop = new Set(["and", "the", "for", "with", "from", "into", "total", "small", "business", "contract", "services", "service", "opportunity", "solicitation"]);
  return [...new Set(clean(text).toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter((word) => word.length >= 4 && !stop.has(word)))].slice(0, 3);
}

function validateResearchInput(input) {
  const opportunity = clean(input?.opportunity);
  const agency = clean(input?.agency);
  const incumbent = clean(input?.incumbent, 120);
  if (!opportunity || !agency) throw new RequestError("Opportunity and agency are required.", 400);
  return { opportunity, agency, incumbent };
}

async function resolveAgency(agency) {
  const data = await fetchJson("https://api.usaspending.gov/api/v2/autocomplete/awarding_agency/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ search_text: agency }),
  }, 9000);
  const result = data.results?.[0];
  return result?.toptier_agency?.name || agency;
}

async function searchRecipients(agency, opportunity) {
  const now = new Date();
  const start = new Date(now);
  start.setUTCFullYear(now.getUTCFullYear() - 5);
  const baseFilters = {
    award_type_codes: ["A", "B", "C", "D"],
    time_period: [{ start_date: isoDate(start), end_date: isoDate(now) }],
    agencies: [{ type: "awarding", tier: "toptier", name: agency }],
  };
  const words = keywordsFrom(opportunity);

  async function query(filters) {
    return fetchJson("https://api.usaspending.gov/api/v2/search/spending_by_category/recipient/", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ filters, category: "recipient", limit: 12, page: 1, spending_level: "transactions" }),
    }, 22000);
  }

  if (words.length) {
    try {
      const focused = await query({ ...baseFilters, keywords: words });
      if (focused.results?.length >= 3) return { data: focused, focused: true, keywords: words };
    } catch (_) {
      // The broader agency query below remains a valid public-data fallback.
    }
  }
  return { data: await query(baseFilters), focused: false, keywords: words };
}

async function searchSam(opportunity, env) {
  if (!env.SAM_API_KEY) return { configured: false, results: [] };
  const now = new Date();
  const start = new Date(now);
  start.setUTCFullYear(now.getUTCFullYear() - 1);
  const params = new URLSearchParams({
    api_key: env.SAM_API_KEY,
    postedFrom: `${String(start.getUTCMonth() + 1).padStart(2, "0")}/${String(start.getUTCDate()).padStart(2, "0")}/${start.getUTCFullYear()}`,
    postedTo: `${String(now.getUTCMonth() + 1).padStart(2, "0")}/${String(now.getUTCDate()).padStart(2, "0")}/${now.getUTCFullYear()}`,
    limit: "10",
    offset: "0",
    title: clean(opportunity, 100),
  });
  const data = await fetchJson(`https://api.sam.gov/opportunities/v2/search?${params}`, {}, 16000);
  return { configured: true, results: data.opportunitiesData || [] };
}

async function searchNews(name, agency) {
  if (!name) return [];
  const params = new URLSearchParams({
    query: `\"${name}\" \"${agency}\"`,
    mode: "artlist",
    maxrecords: "5",
    format: "json",
    sort: "datedesc",
  });
  try {
    const data = await fetchJson(`https://api.gdeltproject.org/api/v2/doc/doc?${params}`, {
      headers: { "user-agent": "BlackHatCapture-Research/0.4 research@invalid.local" },
    }, 9000);
    return (data.articles || []).slice(0, 5).map((item) => ({
      title: clean(item.title, 180),
      url: item.url,
      source: clean(item.domain || item.sourcecountry || "News source", 80),
      date: item.seendate || null,
    }));
  } catch (_) {
    return [];
  }
}

// Public SEC EDGAR full-text search — no API key required. Best-effort like
// searchNews(): any failure returns an empty list rather than breaking a run.
async function searchSecFilings(name) {
  if (!name) return [];
  const params = new URLSearchParams({ q: `"${name}"`, forms: "10-K,10-Q,8-K" });
  try {
    const data = await fetchJson(`https://efts.sec.gov/LATEST/search-index?${params}`, {
      headers: { "user-agent": "BlackHatCapture-Research/0.4 research@invalid.local" },
    }, 9000);
    const hits = data.hits?.hits || [];
    return hits
      .slice(0, 5)
      .map((hit) => {
        const source = hit._source || {};
        const cik = String(source.ciks?.[0] || "").replace(/^0+/, "");
        const accession = String(source.adsh || "").replace(/-/g, "");
        const filename = String(hit._id || "").split(":")[1] || "";
        const url = cik && accession && filename
          ? `https://www.sec.gov/Archives/edgar/data/${cik}/${accession}/${filename}`
          : null;
        return {
          company: clean((source.display_names || [])[0] || name, 140),
          form: source.form || null,
          filedAt: source.file_date || null,
          url,
        };
      })
      .filter((item) => item.url);
  } catch (_) {
    return [];
  }
}

function rankCompetitors(results, incumbent) {
  const cleaned = (results || []).filter((item) => item.name && item.name !== "MULTIPLE RECIPIENTS" && Number(item.amount) > 0);
  const max = Math.max(...cleaned.map((item) => Number(item.amount)), 1);
  return cleaned.slice(0, 8).map((item) => {
    const isIncumbent = incumbent && item.name.toLowerCase().includes(incumbent.toLowerCase().split(" ")[0]);
    const spendSignal = Math.sqrt(Number(item.amount) / max);
    const score = clamp(Math.round(55 + spendSignal * 30 + (isIncumbent ? 12 : 0)), 51, 97);
    return {
      name: item.name.replace(/\s+/g, " ").trim(),
      uei: item.uei || null,
      amount: Number(item.amount),
      amountLabel: compactMoney(item.amount),
      score,
      threat: score >= 84 ? "High threat" : score >= 70 ? "Medium" : "Watch",
      posture: score >= 88 ? "Incumbent-scale" : score >= 76 ? "Aggressive" : "Selective",
      evidence: {
        source: "USAspending",
        url: "https://www.usaspending.gov/search",
        fact: `${item.name} received ${compactMoney(item.amount)} from the selected agency during the five-year analysis window.`,
      },
    };
  }).slice(0, 5);
}

function createStrategies(competitors, agency, incumbent) {
  const leader = competitors[0]?.name || incumbent || "the market leader";
  return [
    {
      title: `Neutralize ${leader}'s access advantage`,
      text: `Lead with a low-risk transition plan, named accountable personnel, and measurable first-90-day outcomes for ${agency}.`,
      confidence: 78,
      basis: "Inference from agency award concentration",
    },
    {
      title: "Make price predictability the discriminator",
      text: "Show a transparent labor mix, automation savings, and scenario-based pricing. Compete on total execution risk, not headline rate alone.",
      confidence: 74,
      basis: "Capture strategy inference",
    },
    {
      title: "Prove specific mission depth",
      text: "Map every win theme to an evaluation factor and support it with two directly comparable outcomes rather than generic transformation claims.",
      confidence: 82,
      basis: "Proposal best-practice inference",
    },
  ];
}

function createSummary(competitors, agency, counts) {
  const totalEvidence = counts.competitors + counts.news + counts.sam + counts.sec;
  const leader = competitors[0];
  const leaderText = leader
    ? `${leader.name} shows the strongest market signal (${leader.amountLabel} in agency obligations, ${leader.threat.toLowerCase()}).`
    : "No dominant competitor emerged from award history.";
  return `${competitors.length} likely bidders were ranked from ${totalEvidence} evidence items gathered against ${agency}'s public award history. ${leaderText} Review each ranked entry's cited source before treating this as a final capture position.`;
}

const STRATEGY_SCHEMA = {
  type: "object",
  properties: {
    strategies: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          text: { type: "string" },
          confidence: { type: "integer", minimum: 50, maximum: 95 },
          basis: { type: "string" },
        },
        required: ["title", "text", "confidence", "basis"],
        additionalProperties: false,
      },
    },
  },
  required: ["strategies"],
  additionalProperties: false,
};

const SUMMARY_SCHEMA = {
  type: "object",
  properties: { summary: { type: "string" } },
  required: ["summary"],
  additionalProperties: false,
};

// Shared plumbing for every optional model-backed step. Returns null on any
// failure — no key, timeout, malformed output — so a caller can always treat
// null as "fall back to the deterministic path." Never throws.
async function callModelJSON({ instructions, input, schema, schemaName, env, timeoutMs = 12000 }) {
  if (!env.OPENAI_API_KEY) return null;
  const model = env.OPENAI_MODEL || "gpt-4o-mini";
  const payload = {
    model,
    instructions,
    input,
    text: { format: { type: "json_schema", name: schemaName, schema, strict: true } },
  };
  try {
    const data = await fetchJson("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${env.OPENAI_API_KEY}` },
      body: JSON.stringify(payload),
    }, timeoutMs);
    const text = data.output_text
      || data.output?.flatMap((item) => item.content || []).find((part) => part.type === "output_text")?.text;
    return text ? JSON.parse(text) : null;
  } catch (_) {
    return null;
  }
}

// Optional: the Black Hat Strategist reasons over evidence with a real model call
// instead of the fixed templates above. Off by default; requires OPENAI_API_KEY.
// Any failure (no key, timeout, bad output) falls back to createStrategies() so a
// research run never breaks on a model outage.
async function generateStrategiesWithModel(competitors, agency, opportunity, incumbent, env) {
  const evidenceSummary = competitors
    .map((c, i) => `${i + 1}. ${c.name} — ${c.amountLabel} in agency obligations over the last 5 years (market-signal score ${c.score}/100, ${c.threat}).`)
    .join("\n");
  const instructions = [
    "You are the Black Hat Strategist inside a federal capture-intelligence tool.",
    "Using ONLY the evidence given, produce exactly 3 counter-strategies a bid team could use to win.",
    "Every strategy is a labeled INFERENCE, not a fact: never claim a company has confirmed it will bid,",
    "and never invent contract vehicles, incumbents, award values, or performance ratings beyond what is given.",
    "Keep 'text' to 1-2 concrete, actionable sentences. 'basis' names the inference type in a few words",
    "(e.g. 'Capture strategy inference').",
  ].join(" ");
  const input = `Opportunity: ${opportunity}\nAgency: ${agency}\nIncumbent: ${incumbent || "unknown"}\n\nRanked competitors (from USAspending award history — market signal, not confirmed bidders):\n${evidenceSummary}`;
  const parsed = await callModelJSON({ instructions, input, schema: STRATEGY_SCHEMA, schemaName: "strategies", env });
  if (!parsed) return null;
  const strategies = (parsed.strategies || []).slice(0, 3).map((s) => ({
    title: clean(s.title, 120),
    text: clean(s.text, 320),
    confidence: clamp(Math.round(Number(s.confidence) || 70), 50, 95),
    basis: clean(s.basis, 80),
  }));
  return strategies.length === 3 ? strategies : null;
}

// Optional: the Evidence Reviewer writes one evidence-bound gate-review summary
// paragraph instead of the fixed sentence template below. Same optional/fallback
// contract as the Strategist above — never throws, never breaks a run.
async function generateSummaryWithModel(competitors, agency, opportunity, incumbent, counts, env) {
  const evidenceSummary = competitors
    .map((c, i) => `${i + 1}. ${c.name} — ${c.amountLabel}, ${c.threat}.`)
    .join("\n");
  const instructions = [
    "You are the Evidence Reviewer inside a federal capture-intelligence tool.",
    "Using ONLY the evidence given, write one paragraph (2-4 sentences) summarizing the gate-review picture for a capture team.",
    "State only what the evidence supports. Never claim a company has confirmed it will bid, and never invent",
    "contract vehicles, award values, incumbents, or performance ratings beyond what is given.",
    "If the evidence is thin, say so plainly instead of padding the summary.",
  ].join(" ");
  const input = `Opportunity: ${opportunity}\nAgency: ${agency}\nIncumbent: ${incumbent || "unknown"}\n`
    + `Evidence gathered: ${counts.competitors} ranked competitors, ${counts.news} news items, ${counts.sam} open opportunities, ${counts.sec} SEC filing references.\n\n`
    + `Ranked competitors:\n${evidenceSummary}`;
  const parsed = await callModelJSON({ instructions, input, schema: SUMMARY_SCHEMA, schemaName: "gate_review_summary", env });
  if (!parsed || !parsed.summary) return null;
  return clean(parsed.summary, 600);
}

function stageEvent(agent) {
  return { type: "stage", agent: agent.name, status: agent.status, detail: agent.detail };
}

// The orchestrator. Four logical agent stages, run sequentially/in parallel in
// a single request — not independent processes. `emit(event)` (optional) is
// called at each stage transition so the caller can stream real progress to
// the client instead of faking it. See AGENTS.md "Agent architecture".
async function runResearch(input, env, emit = () => {}) {
  const { opportunity, agency: requestedAgency, incumbent } = validateResearchInput(input);

  const agents = [
    { name: "Opportunity Analyst", status: "complete", detail: "Inputs normalized and research scope established" },
    { name: "Market Researcher", status: "queued", detail: "Waiting to query federal award history" },
    { name: "Black Hat Strategist", status: "queued", detail: "Waiting for ranked competitors" },
    { name: "Evidence Reviewer", status: "queued", detail: "Waiting for evidence package" },
  ];
  emit(stageEvent(agents[0]));

  agents[1] = { name: "Market Researcher", status: "running", detail: "Querying federal award history" };
  emit(stageEvent(agents[1]));

  let agency = requestedAgency;
  try { agency = await resolveAgency(requestedAgency); } catch (_) {}

  const [recipientSearch, sam] = await Promise.all([
    searchRecipients(agency, opportunity),
    searchSam(opportunity, env).catch((error) => ({ configured: Boolean(env.SAM_API_KEY), results: [], error: error.message })),
  ]);
  const competitors = rankCompetitors(recipientSearch.data.results, incumbent);
  if (!competitors.length) throw new RequestError("No matching federal contract recipients were found. Try the full agency name or a broader opportunity title.", 422);

  agents[1] = { name: "Market Researcher", status: "complete", detail: `${competitors.length} likely bidders ranked from USAspending` };
  emit(stageEvent(agents[1]));

  agents[2] = { name: "Black Hat Strategist", status: "running", detail: "Ranking threat posture and drafting counters" };
  emit(stageEvent(agents[2]));

  const modelStrategies = await generateStrategiesWithModel(competitors, agency, opportunity, incumbent, env);
  const strategies = modelStrategies || createStrategies(competitors, agency, incumbent);
  const strategistMode = modelStrategies ? "model" : "template";
  agents[2] = {
    name: "Black Hat Strategist",
    status: "complete",
    detail: strategistMode === "model"
      ? `Threat posture and counters generated by ${env.OPENAI_MODEL || "gpt-4o-mini"}`
      : "Threat posture and counters generated from deterministic templates",
  };
  emit(stageEvent(agents[2]));

  agents[3] = { name: "Evidence Reviewer", status: "running", detail: "Checking sources and assembling the evidence package" };
  emit(stageEvent(agents[3]));

  const [news, sec] = await Promise.all([
    searchNews(competitors[0]?.name, agency),
    searchSecFilings(competitors[0]?.name),
  ]);

  const counts = { competitors: competitors.length, news: news.length, sam: sam.results.length, sec: sec.length };
  const modelSummary = await generateSummaryWithModel(competitors, agency, opportunity, incumbent, counts, env);
  const summary = modelSummary || createSummary(competitors, agency, counts);
  const reviewerMode = modelSummary ? "model" : "template";

  const evidenceItemsChecked = counts.competitors + counts.news + counts.sam + counts.sec;
  agents[3] = { name: "Evidence Reviewer", status: "complete", detail: `${evidenceItemsChecked} evidence items checked` };
  emit(stageEvent(agents[3]));

  const topThreats = competitors.filter((item) => item.threat === "High threat").length;
  const evidenceStrength = clamp(58 + competitors.length * 5 + Math.min(news.length, 3) * 3 + (sam.results.length ? 8 : 0) + (sec.length ? 4 : 0), 58, 96);
  const winProbability = clamp(72 - Math.round((competitors[0]?.score || 70) * 0.14) - topThreats * 3 + (incumbent ? 2 : 0), 35, 78);
  const modelReasoningUsed = strategistMode === "model" || reviewerMode === "model";

  return {
    meta: {
      opportunity,
      agency,
      incumbent: incumbent || null,
      generatedAt: new Date().toISOString(),
      mode: sam.configured ? "USAspending + SAM.gov" : "USAspending public data",
      strategistMode,
      reviewerMode,
      focusedSearch: recipientSearch.focused,
      keywords: recipientSearch.keywords,
    },
    decision: {
      recommendation: winProbability >= 55 ? "Proceed" : "Conditional bid",
      winProbability,
      bidderCount: competitors.length,
      topThreats,
      evidenceStrength,
      evidenceCount: evidenceItemsChecked,
    },
    competitors,
    strategies,
    summary,
    evidence: {
      sources: [
        { name: "USAspending", status: "connected", url: "https://api.usaspending.gov/", items: competitors.length },
        { name: "SAM.gov", status: sam.configured ? (sam.error ? "error" : "connected") : "key required", url: "https://sam.gov/", items: sam.results.length },
        { name: "GDELT news", status: news.length ? "connected" : "limited", url: "https://www.gdeltproject.org/", items: news.length },
        { name: "SEC EDGAR", status: sec.length ? "connected" : "limited", url: "https://www.sec.gov/edgar/search/", items: sec.length },
        {
          name: "Model reasoning (OpenAI)",
          status: !env.OPENAI_API_KEY ? "key required" : (modelReasoningUsed ? "connected" : "error"),
          url: "https://platform.openai.com/docs/api-reference/responses",
          items: (strategistMode === "model" ? strategies.length : 0) + (reviewerMode === "model" ? 1 : 0),
        },
      ],
      news,
      sec,
      sam: sam.results.slice(0, 5).map((item) => ({
        title: clean(item.title, 180),
        solicitationNumber: item.solicitationNumber || null,
        postedDate: item.postedDate || null,
        url: item.uiLink || item.additionalInfoLink || null,
      })),
    },
    agents,
    limitations: [
      "Competitor ranking is an evidence-backed market signal, not proof that a company will bid.",
      "CPARS evaluations are restricted and are not accessed by this application.",
      "Strategic recommendations are labeled inferences and require capture-team review.",
    ],
  };
}

const HTML_SECURITY_HEADERS = {
  "content-type": "text/html; charset=utf-8",
  "cache-control": "public, max-age=300",
  "content-security-policy": "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self'; img-src 'self' data:; frame-ancestors 'none'; base-uri 'none'",
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "GET" && url.pathname === "/") {
      return new Response(LANDING_HTML, { headers: HTML_SECURITY_HEADERS });
    }
    if (request.method === "GET" && url.pathname === "/app") {
      return new Response(APP_HTML, { headers: HTML_SECURITY_HEADERS });
    }
    if (request.method === "GET" && url.pathname === "/api/health") {
      return json({
        ok: true,
        samConfigured: Boolean(env.SAM_API_KEY),
        modelConfigured: Boolean(env.OPENAI_API_KEY),
        version: "0.4.0",
      });
    }
    if (request.method === "POST" && url.pathname === "/api/research") {
      const length = Number(request.headers.get("content-length") || 0);
      if (length > 50000) return json({ error: "Request is too large." }, 413);

      let input;
      try {
        input = await request.json();
      } catch (_) {
        return json({ error: "Request body must be valid JSON." }, 400);
      }

      // Validated synchronously, before any streaming starts, so a bad request
      // still gets a real 400 — see AGENTS.md "Error status codes".
      try {
        validateResearchInput(input);
      } catch (error) {
        return json({ error: clean(error.message, 240) }, error.status);
      }

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          const emit = (event) => controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
          try {
            const report = await runResearch(input, env, emit);
            emit({ type: "result", report });
          } catch (error) {
            const status = error instanceof RequestError
              ? error.status
              : (error?.name === "AbortError" ? 504 : 502);
            const message = error?.name === "AbortError"
              ? "A public data source timed out. Please try again."
              : clean(error?.message || "Research failed.", 240);
            emit({ type: "error", message, status });
          } finally {
            controller.close();
          }
        },
      });
      return new Response(stream, { headers: NDJSON_HEADERS });
    }
    return new Response("Not found", { status: 404 });
  },
};
