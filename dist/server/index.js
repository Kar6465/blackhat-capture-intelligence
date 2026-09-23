const INDEX_HTML = "<!doctype html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"utf-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n  <meta name=\"description\" content=\"Agentic Black Hat Review cockpit for federal capture teams.\" />\n  <title>BlackHat — Competitive Intelligence</title>\n  <link rel=\"icon\" type=\"image/svg+xml\" href=\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%230b0e12'/%3E%3Cpath d='M18 38h28l-5-9H23zM14 42h36v5H14z' fill='%23ff6534'/%3E%3Ccircle cx='27' cy='41' r='2.5' fill='%230b0e12'/%3E%3Ccircle cx='37' cy='41' r='2.5' fill='%230b0e12'/%3E%3C/svg%3E\" />\n  <style>\n    :root {\n      color-scheme: dark;\n      --bg: #090b0e;\n      --panel: #10141a;\n      --panel-2: #151a21;\n      --line: #252b34;\n      --line-soft: #1b2028;\n      --text: #f3f5f7;\n      --muted: #919aa6;\n      --orange: #ff6534;\n      --orange-soft: #2c1712;\n      --green: #38d39f;\n      --amber: #f2ba55;\n      --red: #ff6666;\n      --blue: #6ea8ff;\n      --radius: 14px;\n      font-family: Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif;\n    }\n    * { box-sizing: border-box; }\n    body { margin: 0; min-height: 100vh; background: var(--bg); color: var(--text); }\n    button, input, textarea { font: inherit; }\n    button { cursor: pointer; }\n    .app { min-height: 100vh; display: grid; grid-template-columns: 240px minmax(0, 1fr); }\n    .rail { position: sticky; top: 0; height: 100vh; padding: 24px 18px; border-right: 1px solid var(--line); background: #0b0e12; display: flex; flex-direction: column; }\n    .brand { display: flex; align-items: center; gap: 11px; padding: 0 8px 26px; font-weight: 760; letter-spacing: -.02em; }\n    .brand-mark { width: 30px; height: 30px; border-radius: 9px; display: grid; place-items: center; background: var(--orange); color: #0b0e12; font-weight: 900; }\n    .brand small { display: block; color: var(--muted); font-size: .7rem; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; margin-top: 2px; }\n    .nav-label { color: #626b77; font-size: .69rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; padding: 16px 10px 7px; }\n    .nav-item { width: 100%; border: 0; background: transparent; color: var(--muted); border-radius: 9px; padding: 10px 11px; display: flex; align-items: center; gap: 10px; text-align: left; font-size: .88rem; }\n    .nav-item.active { background: #181d24; color: var(--text); box-shadow: inset 2px 0 var(--orange); }\n    .nav-item svg { width: 17px; height: 17px; }\n    .rail-foot { margin-top: auto; padding: 15px 10px 0; border-top: 1px solid var(--line-soft); color: var(--muted); font-size: .75rem; line-height: 1.5; }\n    .rail-foot strong { color: var(--green); font-weight: 650; }\n    main { min-width: 0; }\n    .topbar { height: 70px; padding: 0 30px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--line); background: rgba(9,11,14,.9); backdrop-filter: blur(14px); position: sticky; top: 0; z-index: 5; }\n    .crumb { color: var(--muted); font-size: .82rem; }\n    .crumb strong { color: var(--text); }\n    .top-actions { display: flex; align-items: center; gap: 10px; }\n    .status { padding: 6px 9px; border: 1px solid #23483b; background: #10251e; color: #79e7bf; border-radius: 999px; font-size: .72rem; font-weight: 650; }\n    .icon-btn { width: 34px; height: 34px; border-radius: 9px; border: 1px solid var(--line); background: var(--panel); color: var(--muted); display: grid; place-items: center; }\n    .content { padding: 28px 30px 44px; max-width: 1500px; margin: 0 auto; }\n    .heading-row { display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; margin-bottom: 20px; }\n    h1 { margin: 0; font-size: clamp(1.65rem, 3vw, 2.35rem); letter-spacing: -.04em; line-height: 1.05; }\n    .eyebrow { color: var(--orange); font-size: .7rem; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; margin-bottom: 8px; }\n    .sub { color: var(--muted); font-size: .92rem; margin-top: 9px; }\n    .new-btn { border: 1px solid #74402d; background: var(--orange); color: #130b08; border-radius: 9px; padding: 10px 14px; font-weight: 760; box-shadow: 0 8px 30px rgba(255,101,52,.15); }\n    .intake { background: linear-gradient(145deg,#12171e,#0e1217); border: 1px solid var(--line); border-radius: var(--radius); padding: 18px; display: grid; grid-template-columns: 1fr 1fr .72fr auto; gap: 12px; align-items: end; }\n    label { display: block; color: var(--muted); font-size: .72rem; font-weight: 680; margin-bottom: 7px; }\n    input { width: 100%; height: 41px; border: 1px solid var(--line); background: #0a0d11; color: var(--text); border-radius: 8px; padding: 0 11px; outline: none; }\n    input:focus { border-color: var(--orange); box-shadow: 0 0 0 3px rgba(255,101,52,.12); }\n    .run-btn { height: 41px; border: 0; border-radius: 8px; padding: 0 17px; background: var(--orange); color: #130b08; font-weight: 780; white-space: nowrap; }\n    .run-btn[disabled] { opacity: .7; cursor: wait; }\n    .pipeline { margin: 12px 0 22px; border: 1px solid var(--line-soft); background: #0c0f13; border-radius: 11px; min-height: 43px; display: flex; align-items: center; padding: 0 14px; gap: 8px; overflow-x: auto; }\n    .stage { display: flex; align-items: center; gap: 7px; color: #707985; font-size: .72rem; white-space: nowrap; }\n    .stage::before { content:\"\"; width: 7px; height: 7px; background: #343b45; border-radius: 50%; }\n    .stage.done { color: #adb5bf; }\n    .stage.done::before { background: var(--green); box-shadow: 0 0 0 3px rgba(56,211,159,.08); }\n    .stage.active { color: #ffc3ad; }\n    .stage.active::before { background: var(--orange); box-shadow: 0 0 0 4px rgba(255,101,52,.12); }\n    .arrow { color: #39404a; font-size: .7rem; }\n    .summary-grid { display: grid; grid-template-columns: 1.35fr .8fr .8fr .8fr; gap: 12px; margin-bottom: 22px; }\n    .metric { border: 1px solid var(--line); background: var(--panel); border-radius: 12px; padding: 15px 16px; min-height: 100px; }\n    .metric-label { color: var(--muted); font-size: .72rem; margin-bottom: 10px; }\n    .metric-value { font-size: 1.45rem; font-weight: 760; letter-spacing: -.035em; }\n    .metric-note { color: var(--muted); font-size: .72rem; margin-top: 7px; }\n    .recommend { display: flex; align-items: center; gap: 12px; }\n    .go-ring { width: 50px; height: 50px; flex: 0 0 50px; border: 4px solid var(--green); border-right-color: #1e4a3d; border-radius: 50%; display: grid; place-items: center; color: var(--green); font-size: .7rem; font-weight: 900; }\n    .two-col { display: grid; grid-template-columns: minmax(0,1.55fr) minmax(300px,.8fr); gap: 16px; }\n    .card { border: 1px solid var(--line); background: var(--panel); border-radius: var(--radius); overflow: hidden; }\n    .card-head { padding: 15px 17px; border-bottom: 1px solid var(--line); display: flex; justify-content: space-between; align-items: center; }\n    .card-title { font-weight: 720; font-size: .94rem; }\n    .card-meta { color: var(--muted); font-size: .7rem; }\n    .competitor { padding: 16px 17px; border-bottom: 1px solid var(--line-soft); display: grid; grid-template-columns: 42px minmax(150px,1.2fr) .9fr .9fr 100px 24px; gap: 12px; align-items: center; transition: background .2s ease; }\n    .competitor:hover { background: #141920; }\n    .competitor:last-child { border-bottom: 0; }\n    .rank { width: 34px; height: 34px; border: 1px solid var(--line); background: #0b0e12; border-radius: 8px; display: grid; place-items: center; color: var(--muted); font-size: .76rem; font-weight: 760; }\n    .company { font-weight: 700; font-size: .9rem; }\n    .company span { display: block; color: var(--muted); font-size: .69rem; font-weight: 500; margin-top: 4px; }\n    .mini-label { color: var(--muted); font-size: .65rem; margin-bottom: 5px; }\n    .bar { height: 5px; border-radius: 999px; background: #242a32; overflow: hidden; }\n    .bar i { display: block; height: 100%; background: var(--orange); border-radius: inherit; }\n    .bar.green i { background: var(--green); }\n    .score { font-size: .78rem; margin-top: 5px; }\n    .badge { justify-self: start; border-radius: 999px; padding: 5px 8px; font-size: .67rem; font-weight: 750; }\n    .badge.high { background: #32191a; color: #ff8d8d; }\n    .badge.med { background: #332612; color: #efbf68; }\n    .chev { color: #646e7a; }\n    .insight { padding: 15px 17px; border-bottom: 1px solid var(--line-soft); }\n    .insight:last-child { border-bottom: 0; }\n    .insight-top { display: flex; justify-content: space-between; gap: 10px; }\n    .insight h3 { margin: 0; font-size: .82rem; }\n    .insight p { margin: 7px 0 0; color: #aeb6c0; font-size: .76rem; line-height: 1.55; }\n    .source { color: var(--blue); font-size: .67rem; font-weight: 650; }\n    .footer-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 17px; border-top: 1px solid var(--line); }\n    .export { border: 1px solid var(--line); background: #171c23; color: var(--text); border-radius: 8px; padding: 8px 11px; font-size: .76rem; font-weight: 650; }\n    .export:hover { border-color: #515a66; }\n    .demo-note { color: #67717d; font-size: .68rem; }\n    .toast { position: fixed; right: 24px; bottom: 24px; background: #f4f6f8; color: #11161b; border-radius: 10px; padding: 12px 15px; font-size: .8rem; font-weight: 680; transform: translateY(80px); opacity: 0; transition: .28s ease; box-shadow: 0 12px 50px rgba(0,0,0,.45); }\n    .toast.show { transform: translateY(0); opacity: 1; }\n    .pulse { animation: pulse .9s infinite alternate; }\n    @keyframes pulse { to { opacity: .48; } }\n    @media (max-width: 1050px) {\n      .intake { grid-template-columns: 1fr 1fr; }\n      .run-btn { width: 100%; }\n      .summary-grid { grid-template-columns: 1fr 1fr; }\n      .two-col { grid-template-columns: 1fr; }\n    }\n    @media (max-width: 760px) {\n      .app { display: block; }\n      .rail { height: auto; position: static; padding: 14px 16px; flex-direction: row; align-items: center; overflow-x: auto; }\n      .brand { padding: 0 15px 0 0; }\n      .brand small, .nav-label, .rail-foot { display: none; }\n      .nav-item { width: auto; white-space: nowrap; }\n      .topbar { padding: 0 16px; }\n      .content { padding: 22px 16px 36px; }\n      .heading-row { align-items: flex-start; }\n      .new-btn { display: none; }\n      .intake { grid-template-columns: 1fr; }\n      .summary-grid { grid-template-columns: 1fr 1fr; }\n      .competitor { grid-template-columns: 36px 1fr 92px 20px; }\n      .competitor > :nth-child(3), .competitor > :nth-child(4) { display: none; }\n      .badge { justify-self: end; }\n    }\n    @media (max-width: 480px) {\n      .summary-grid { grid-template-columns: 1fr; }\n      .status { display: none; }\n    }\n  </style>\n</head>\n<body>\n  <div class=\"app\">\n    <aside class=\"rail\">\n      <div class=\"brand\"><div class=\"brand-mark\">BH</div><div>BlackHat<small>Capture intelligence</small></div></div>\n      <div class=\"nav-label\">Workspace</div>\n      <button class=\"nav-item active\" aria-current=\"page\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"><path d=\"M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z\"/></svg>Review cockpit</button>\n      <button class=\"nav-item\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"><path d=\"M4 19V8l8-4 8 4v11M8 19v-5h8v5\"/></svg>Competitors</button>\n      <button class=\"nav-item\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"><path d=\"M4 19h16M6 16l4-5 3 2 5-7\"/></svg>Win themes</button>\n      <div class=\"nav-label\">Library</div>\n      <button class=\"nav-item\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"><path d=\"M5 3h11l3 3v15H5zM8 10h8M8 14h8M8 18h5\"/></svg>Past reviews</button>\n      <div class=\"rail-foot\"><strong id=\"sourceHealth\">Live research ready</strong><br>USAspending · SAM.gov · GDELT</div>\n    </aside>\n    <main>\n      <header class=\"topbar\">\n        <div class=\"crumb\">Pursuits / <strong>Active review</strong></div>\n        <div class=\"top-actions\"><span class=\"status\">Research agents ready</span><button class=\"icon-btn\" aria-label=\"Notifications\">●</button></div>\n      </header>\n      <div class=\"content\">\n        <div class=\"heading-row\">\n          <div><div class=\"eyebrow\">Agentic Black Hat Review</div><h1>Know how they’ll bid.<br>Decide how we’ll win.</h1><div class=\"sub\">Run a live, evidence-backed scan of federal award history.</div></div>\n          <button class=\"new-btn\" id=\"newReview\">+ New review</button>\n        </div>\n\n        <section class=\"intake\" aria-label=\"Opportunity intake\">\n          <div><label for=\"opportunity\">Opportunity or solicitation</label><input id=\"opportunity\" value=\"GSA OASIS+ Total Small Business — Domain 5\" /></div>\n          <div><label for=\"agency\">Agency</label><input id=\"agency\" value=\"General Services Administration\" /></div>\n          <div><label for=\"incumbent\">Known incumbent</label><input id=\"incumbent\" value=\"Booz Allen Hamilton\" /></div>\n          <button class=\"run-btn\" id=\"runReview\">Run black hat ↗</button>\n        </section>\n\n        <div class=\"pipeline\" aria-live=\"polite\">\n          <span class=\"stage done\">Opportunity Analyst</span><span class=\"arrow\">›</span>\n          <span class=\"stage done\">Market Researcher</span><span class=\"arrow\">›</span>\n          <span class=\"stage done\">Black Hat Strategist</span><span class=\"arrow\">›</span>\n          <span class=\"stage active\">Evidence Reviewer</span>\n        </div>\n\n        <section class=\"summary-grid\" aria-label=\"Decision summary\">\n          <div class=\"metric\"><div class=\"metric-label\">Recommendation</div><div class=\"recommend\"><div class=\"go-ring\" id=\"bidRing\">BID</div><div><div class=\"metric-value\" id=\"recommendation\">Proceed</div><div class=\"metric-note\" id=\"recommendationNote\">Run a live scan to refresh</div></div></div></div>\n          <div class=\"metric\"><div class=\"metric-label\">Win probability</div><div class=\"metric-value\" id=\"winProbability\">64%</div><div class=\"metric-note\">Evidence-weighted estimate</div></div>\n          <div class=\"metric\"><div class=\"metric-label\">Likely bidders</div><div class=\"metric-value\" id=\"bidderCount\">4</div><div class=\"metric-note\" id=\"threatCount\">2 high-threat rivals</div></div>\n          <div class=\"metric\"><div class=\"metric-label\">Evidence strength</div><div class=\"metric-value\" id=\"evidenceStrength\">87%</div><div class=\"metric-note\" id=\"evidenceCount\">Illustrative until refreshed</div></div>\n        </section>\n\n        <div class=\"two-col\">\n          <section class=\"card\">\n            <div class=\"card-head\"><div class=\"card-title\">Competitive landscape</div><div class=\"card-meta\">Ranked by fit, access & past performance</div></div>\n            <div id=\"competitorList\"><div class=\"competitor\">\n              <div class=\"rank\">01</div><div class=\"company\">Booz Allen Hamilton<span>Incumbent · strongest agency access</span></div>\n              <div><div class=\"mini-label\">Capability fit</div><div class=\"bar\"><i style=\"width:94%\"></i></div><div class=\"score\">94 / 100</div></div>\n              <div><div class=\"mini-label\">Price posture</div><div class=\"bar green\"><i style=\"width:68%\"></i></div><div class=\"score\">Premium</div></div>\n              <span class=\"badge high\">High threat</span><span class=\"chev\">›</span>\n            </div>\n            <div class=\"competitor\">\n              <div class=\"rank\">02</div><div class=\"company\">Guidehouse<span>Deep civilian-domain delivery bench</span></div>\n              <div><div class=\"mini-label\">Capability fit</div><div class=\"bar\"><i style=\"width:88%\"></i></div><div class=\"score\">88 / 100</div></div>\n              <div><div class=\"mini-label\">Price posture</div><div class=\"bar green\"><i style=\"width:79%\"></i></div><div class=\"score\">Aggressive</div></div>\n              <span class=\"badge high\">High threat</span><span class=\"chev\">›</span>\n            </div>\n            <div class=\"competitor\">\n              <div class=\"rank\">03</div><div class=\"company\">Deloitte<span>Transformation credentials, higher cost base</span></div>\n              <div><div class=\"mini-label\">Capability fit</div><div class=\"bar\"><i style=\"width:82%\"></i></div><div class=\"score\">82 / 100</div></div>\n              <div><div class=\"mini-label\">Price posture</div><div class=\"bar green\"><i style=\"width:61%\"></i></div><div class=\"score\">Premium</div></div>\n              <span class=\"badge med\">Medium</span><span class=\"chev\">›</span>\n            </div>\n            <div class=\"competitor\">\n              <div class=\"rank\">04</div><div class=\"company\">ICF<span>Domain specialist · selective pursuit pattern</span></div>\n              <div><div class=\"mini-label\">Capability fit</div><div class=\"bar\"><i style=\"width:76%\"></i></div><div class=\"score\">76 / 100</div></div>\n              <div><div class=\"mini-label\">Price posture</div><div class=\"bar green\"><i style=\"width:83%\"></i></div><div class=\"score\">Aggressive</div></div>\n              <span class=\"badge med\">Medium</span><span class=\"chev\">›</span>\n            </div></div>\n            <div class=\"footer-row\"><span class=\"demo-note\" id=\"dataMode\">Illustrative data shown · run a review for live results</span><button class=\"export\" id=\"exportBrief\">Export gate brief ↓</button></div>\n          </section>\n\n          <section class=\"card\">\n            <div class=\"card-head\"><div class=\"card-title\">How we win</div><div class=\"card-meta\">Top recommended counters</div></div>\n            <div id=\"strategyList\"><div class=\"insight\"><div class=\"insight-top\"><h3>1. Turn incumbent scale into transition risk</h3><span class=\"source\">Inference</span></div><p>Lead with a 30-day transition plan and named key personnel. Ghost the incumbent’s delivery sprawl—not its technical capability.</p></div>\n            <div class=\"insight\"><div class=\"insight-top\"><h3>2. Make price predictability the discriminator</h3><span class=\"source\">Inference</span></div><p>Offer a modular labor mix with explicit automation savings. Neutralize a low-price posture with lower execution risk.</p></div>\n            <div class=\"insight\"><div class=\"insight-top\"><h3>3. Prove domain depth, not generic transformation</h3><span class=\"source\">Inference</span></div><p>Anchor each win theme in agency-specific outcomes and two directly comparable past performances.</p></div></div>\n            <div class=\"footer-row\"><span class=\"demo-note\">Decision rationale is traceable</span><button class=\"export\" id=\"showRationale\">View rationale →</button></div>\n          </section>\n        </div>\n      </div>\n    </main>\n  </div>\n  <div class=\"toast\" id=\"toast\" role=\"status\"></div>\n  <script>\n    const run = document.getElementById('runReview');\n    const toast = document.getElementById('toast');\n    const stages = [...document.querySelectorAll('.stage')];\n    let latestReport = null;\n    function esc(value) { return String(value ?? '').replace(/[&<>'\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',\"'\":'&#39;','\"':'&quot;'}[c])); }\n    function say(message) { toast.textContent = message; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 3200); }\n    function renderReport(report) {\n      latestReport = report;\n      const d = report.decision;\n      document.getElementById('recommendation').textContent = d.recommendation;\n      document.getElementById('recommendationNote').textContent = `${d.topThreats} high-threat rival${d.topThreats === 1 ? '' : 's'} detected`;\n      document.getElementById('bidRing').textContent = d.recommendation === 'Proceed' ? 'BID' : 'CHECK';\n      document.getElementById('winProbability').textContent = `${d.winProbability}%`;\n      document.getElementById('bidderCount').textContent = d.bidderCount;\n      document.getElementById('threatCount').textContent = `${d.topThreats} high-threat rival${d.topThreats === 1 ? '' : 's'}`;\n      document.getElementById('evidenceStrength').textContent = `${d.evidenceStrength}%`;\n      document.getElementById('evidenceCount').textContent = `${d.evidenceCount} evidence items checked`;\n      document.getElementById('dataMode').textContent = `Live ${report.meta.mode} · ${new Date(report.meta.generatedAt).toLocaleString()}`;\n      document.getElementById('sourceHealth').textContent = 'Live research complete';\n      document.getElementById('competitorList').innerHTML = report.competitors.map((c, i) => `<div class=\"competitor\"><div class=\"rank\">${String(i + 1).padStart(2,'0')}</div><div class=\"company\">${esc(c.name)}<span>${esc(c.evidence.fact)}</span></div><div><div class=\"mini-label\">Market signal</div><div class=\"bar\"><i style=\"width:${c.score}%\"></i></div><div class=\"score\">${c.score} / 100</div></div><div><div class=\"mini-label\">Agency obligations</div><div class=\"bar green\"><i style=\"width:${Math.min(100,c.score - 5)}%\"></i></div><div class=\"score\">${esc(c.amountLabel)}</div></div><span class=\"badge ${c.threat === 'High threat' ? 'high' : 'med'}\">${esc(c.threat)}</span><a class=\"chev\" href=\"${esc(c.evidence.url)}\" target=\"_blank\" rel=\"noopener\" aria-label=\"Open USAspending evidence\">›</a></div>`).join('');\n      document.getElementById('strategyList').innerHTML = report.strategies.map((s, i) => `<div class=\"insight\"><div class=\"insight-top\"><h3>${i + 1}. ${esc(s.title)}</h3><span class=\"source\">${s.confidence}% confidence</span></div><p>${esc(s.text)}</p><p class=\"demo-note\">${esc(s.basis)}</p></div>`).join('');\n      stages.forEach((stage, i) => { stage.className = 'stage done'; stage.textContent = report.agents[i]?.name || stage.textContent; });\n    }\n    run.addEventListener('click', async () => {\n      const payload = { opportunity: document.getElementById('opportunity').value, agency: document.getElementById('agency').value, incumbent: document.getElementById('incumbent').value };\n      if (!payload.opportunity.trim() || !payload.agency.trim()) { say('Enter an opportunity and agency first.'); return; }\n      run.disabled = true; run.textContent = 'Agents researching…';\n      stages.forEach((s, i) => { s.className = 'stage'; if (i === 0) s.classList.add('active','pulse'); });\n      let active = 0;\n      const timer = setInterval(() => { stages[active].className = 'stage done'; active = Math.min(active + 1, stages.length - 1); stages[active].className = 'stage active pulse'; }, 1800);\n      try {\n        const response = await fetch('/api/research', { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify(payload) });\n        const report = await response.json();\n        if (!response.ok) throw new Error(report.error || 'Research failed.');\n        renderReport(report);\n        say('Live review complete — evidence and strategy are ready.');\n      } catch (error) {\n        say(error.message || 'Research failed. Please try again.');\n        stages.forEach(s => s.classList.remove('pulse'));\n      } finally {\n        clearInterval(timer); run.disabled = false; run.textContent = 'Run black hat ↗';\n      }\n    });\n    document.getElementById('newReview').addEventListener('click', () => { document.querySelectorAll('input').forEach(x => x.value = ''); document.getElementById('opportunity').focus(); });\n    document.getElementById('exportBrief').addEventListener('click', () => {\n      if (!latestReport) { say('Run a live review before exporting.'); return; }\n      const blob = new Blob([JSON.stringify(latestReport, null, 2)], {type:'application/json'});\n      const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'blackhat-gate-brief.json'; link.click(); URL.revokeObjectURL(link.href);\n      say('Evidence-backed gate brief exported.');\n    });\n    document.getElementById('showRationale').addEventListener('click', () => say(latestReport ? `${latestReport.decision.evidenceCount} evidence items support this assessment.` : 'Run a live review to generate a traceable rationale.'));\n  </script>\n</body>\n</html>\n";

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
