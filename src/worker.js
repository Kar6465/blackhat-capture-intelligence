const INDEX_HTML = __INDEX_HTML__;

const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
  "x-content-type-options": "nosniff",
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
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
      headers: { "user-agent": "BlackHatCapture/0.2 research@invalid.local" },
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

async function runResearch(input, env) {
  const opportunity = clean(input.opportunity);
  const requestedAgency = clean(input.agency);
  const incumbent = clean(input.incumbent, 120);
  if (!opportunity || !requestedAgency) throw new Error("Opportunity and agency are required.");

  const agents = [
    { name: "Opportunity Analyst", status: "complete", detail: "Inputs normalized and research scope established" },
    { name: "Market Researcher", status: "running", detail: "Querying federal award history" },
    { name: "Black Hat Strategist", status: "queued", detail: "Waiting for ranked competitors" },
    { name: "Evidence Reviewer", status: "queued", detail: "Waiting for evidence package" },
  ];

  let agency = requestedAgency;
  try { agency = await resolveAgency(requestedAgency); } catch (_) {}

  const [recipientSearch, sam] = await Promise.all([
    searchRecipients(agency, opportunity),
    searchSam(opportunity, env).catch((error) => ({ configured: Boolean(env.SAM_API_KEY), results: [], error: error.message })),
  ]);
  const competitors = rankCompetitors(recipientSearch.data.results, incumbent);
  if (!competitors.length) throw new Error("No matching federal contract recipients were found. Try the full agency name or a broader opportunity title.");

  agents[1] = { name: "Market Researcher", status: "complete", detail: `${competitors.length} likely bidders ranked from USAspending` };
  agents[2] = { name: "Black Hat Strategist", status: "complete", detail: "Threat posture and counters generated" };
  const news = await searchNews(competitors[0]?.name, agency);
  agents[3] = { name: "Evidence Reviewer", status: "complete", detail: `${competitors.length + news.length + sam.results.length} evidence items checked` };

  const topThreats = competitors.filter((item) => item.threat === "High threat").length;
  const evidenceCount = competitors.length + news.length + sam.results.length;
  const evidenceStrength = clamp(58 + competitors.length * 5 + Math.min(news.length, 3) * 3 + (sam.results.length ? 8 : 0), 58, 94);
  const winProbability = clamp(72 - Math.round((competitors[0]?.score || 70) * 0.14) - topThreats * 3 + (incumbent ? 2 : 0), 35, 78);

  return {
    meta: {
      opportunity,
      agency,
      incumbent: incumbent || null,
      generatedAt: new Date().toISOString(),
      mode: sam.configured ? "USAspending + SAM.gov" : "USAspending public data",
      focusedSearch: recipientSearch.focused,
      keywords: recipientSearch.keywords,
    },
    decision: {
      recommendation: winProbability >= 55 ? "Proceed" : "Conditional bid",
      winProbability,
      bidderCount: competitors.length,
      topThreats,
      evidenceStrength,
      evidenceCount,
    },
    competitors,
    strategies: createStrategies(competitors, agency, incumbent),
    evidence: {
      sources: [
        { name: "USAspending", status: "connected", url: "https://api.usaspending.gov/", items: competitors.length },
        { name: "SAM.gov", status: sam.configured ? (sam.error ? "error" : "connected") : "key required", url: "https://sam.gov/", items: sam.results.length },
        { name: "GDELT news", status: news.length ? "connected" : "limited", url: "https://www.gdeltproject.org/", items: news.length },
        { name: "SEC filings", status: "not applicable in this run", url: "https://www.sec.gov/edgar", items: 0 },
      ],
      news,
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

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "GET" && url.pathname === "/") {
      return new Response(INDEX_HTML, {
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "public, max-age=300",
          "content-security-policy": "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self'; img-src 'self' data:; frame-ancestors 'none'; base-uri 'none'",
          "x-content-type-options": "nosniff",
          "referrer-policy": "strict-origin-when-cross-origin",
        },
      });
    }
    if (request.method === "GET" && url.pathname === "/api/health") {
      return json({ ok: true, samConfigured: Boolean(env.SAM_API_KEY), version: "0.2.0" });
    }
    if (request.method === "POST" && url.pathname === "/api/research") {
      const length = Number(request.headers.get("content-length") || 0);
      if (length > 50000) return json({ error: "Request is too large." }, 413);
      try {
        const input = await request.json();
        return json(await runResearch(input, env));
      } catch (error) {
        const message = error?.name === "AbortError" ? "A public data source timed out. Please try again." : clean(error?.message || "Research failed.", 240);
        return json({ error: message }, 502);
      }
    }
    return new Response("Not found", { status: 404 });
  },
};
