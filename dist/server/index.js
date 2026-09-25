const APP_HTML = "<!doctype html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"utf-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n  <meta name=\"description\" content=\"Agentic Black Hat Review cockpit for federal capture teams.\" />\n  <title>BlackHat — Competitive Intelligence</title>\n  <link rel=\"icon\" type=\"image/svg+xml\" href=\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='10' fill='%23070809'/%3E%3Cpath d='M18 38h28l-5-9H23zM14 42h36v5H14z' fill='%23e2632c'/%3E%3Ccircle cx='27' cy='41' r='2.5' fill='%23070809'/%3E%3Ccircle cx='37' cy='41' r='2.5' fill='%23070809'/%3E%3C/svg%3E\" />\n  <style>\n    :root {\n      color-scheme: dark;\n      --bg: #07080a;\n      --panel: #0d1014;\n      --panel-2: #10141a;\n      --line: #1d232c;\n      --line-soft: #171c23;\n      --text: #eef1f4;\n      --muted: #7c8794;\n      --muted-dim: #78818d;\n      --accent: #e2632c;\n      --accent-ink: #14100c;\n      --good: #2fae7a;\n      --good-soft: #12241d;\n      --warn: #d6a53a;\n      --warn-soft: #241d10;\n      --critical: #cf4f4f;\n      --critical-soft: #251314;\n      --seq-1: #3f7cc9;\n      --seq-2: #2fae7a;\n      --radius: 9px;\n      --radius-sm: 5px;\n      --font-sans: -apple-system, BlinkMacSystemFont, \"Segoe UI\", system-ui, sans-serif;\n      --font-mono: ui-monospace, \"SF Mono\", \"Cascadia Mono\", \"Roboto Mono\", Menlo, Consolas, monospace;\n      /* Type scale: 6 sizes, no one-offs. R9. */\n      --fs-1: .6875rem;  /* 11px — micro mono labels */\n      --fs-2: .75rem;    /* 12px — meta / captions */\n      --fs-3: .8125rem;  /* 13px — secondary body */\n      --fs-4: .875rem;   /* 14px — body / titles */\n      --fs-5: 1.25rem;   /* 20px — emphasized values */\n      --fs-6: 1.5rem;    /* 24px — page heading */\n      /* Spacing scale: 4px base. R8. */\n      --sp-1: 4px; --sp-2: 8px; --sp-3: 12px; --sp-4: 16px; --sp-5: 20px;\n      --sp-6: 24px; --sp-7: 28px; --sp-8: 32px; --sp-9: 40px; --sp-10: 48px;\n      font-family: var(--font-sans);\n    }\n    * { box-sizing: border-box; }\n    body { margin: 0; min-height: 100vh; background: var(--bg); color: var(--text); position: relative; }\n    body::before {\n      content: \"\"; position: fixed; inset: 0; pointer-events: none; z-index: 0;\n      background-image:\n        linear-gradient(rgba(255,255,255,.028) 1px, transparent 1px),\n        linear-gradient(90deg, rgba(255,255,255,.028) 1px, transparent 1px);\n      background-size: 44px 44px;\n      mask-image: radial-gradient(ellipse 75% 55% at 50% 0%, black 30%, transparent 85%);\n    }\n    button, input, textarea, select { font: inherit; }\n    button, select { cursor: pointer; }\n    a { color: inherit; }\n    .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }\n    :focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }\n    .app { position: relative; z-index: 1; min-height: 100vh; display: grid; grid-template-columns: 236px minmax(0, 1fr); }\n    .rail { isolation: isolate; position: sticky; top: 0; height: 100vh; padding: var(--sp-6) var(--sp-4); border-right: 1px solid var(--line); background: #08090b; display: flex; flex-direction: column; }\n    .brand { display: flex; align-items: center; gap: var(--sp-2); padding: 0 var(--sp-2) var(--sp-6); letter-spacing: -.01em; text-decoration: none; }\n    .brand-mark { width: 28px; height: 28px; border-radius: var(--radius-sm); display: grid; place-items: center; background: var(--accent); color: var(--accent-ink); font-family: var(--font-mono); font-weight: 700; font-size: var(--fs-2); }\n    .brand-name { font-weight: 650; font-size: var(--fs-4); color: var(--text); }\n    .brand small { display: block; color: var(--muted); font-family: var(--font-mono); font-size: var(--fs-1); font-weight: 500; letter-spacing: .07em; text-transform: uppercase; margin-top: 2px; }\n    .nav-label { color: var(--muted-dim); font-family: var(--font-mono); font-size: var(--fs-1); font-weight: 600; letter-spacing: .1em; text-transform: uppercase; padding: var(--sp-4) var(--sp-2) var(--sp-2); }\n    .nav-item { width: 100%; border: 0; border-left: 2px solid transparent; background: transparent; color: var(--muted); border-radius: 0 var(--radius-sm) var(--radius-sm) 0; padding: var(--sp-2) var(--sp-3); display: flex; align-items: center; gap: var(--sp-2); text-align: left; font-size: var(--fs-3); transition: background-color 120ms ease-out, color 120ms ease-out, border-color 120ms ease-out; }\n    .nav-item.active { background: #12161c; color: var(--text); border-left-color: var(--accent); }\n    .nav-item:not(.active):hover { color: var(--text); background: #0f1217; }\n    .nav-item svg { width: 16px; height: 16px; stroke-width: 1.5; flex: none; }\n    .rail-foot { margin-top: auto; padding: var(--sp-3) var(--sp-2) 0; border-top: 1px solid var(--line-soft); color: var(--muted-dim); font-family: var(--font-mono); font-size: var(--fs-1); line-height: 1.6; }\n    .rail-foot strong { color: var(--good); font-weight: 600; }\n    main { min-width: 0; }\n    .topbar { isolation: isolate; height: 56px; padding: 0 var(--sp-7); display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--line); background: var(--bg); position: sticky; top: 0; z-index: 5; }\n    .crumb { color: var(--muted); font-family: var(--font-mono); font-size: var(--fs-2); }\n    .crumb strong { color: var(--text); font-weight: 500; }\n    .top-actions { display: flex; align-items: center; gap: var(--sp-2); }\n    .status { padding: 5px 9px; border: 1px solid #1e3a30; background: var(--good-soft); color: #6fd3ac; border-radius: var(--radius-sm); font-family: var(--font-mono); font-size: var(--fs-1); font-weight: 600; }\n    .icon-btn { width: 30px; height: 30px; border-radius: var(--radius-sm); border: 1px solid var(--line); background: var(--panel); color: var(--muted); display: grid; place-items: center; transition: border-color 120ms ease-out, color 120ms ease-out; }\n    .icon-btn:hover { border-color: #333b46; color: var(--text); }\n    .content { padding: var(--sp-8) var(--sp-7) var(--sp-9); max-width: 1480px; margin: 0 auto; }\n    .view[hidden] { display: none; }\n    .heading-row { display: flex; align-items: flex-end; justify-content: space-between; gap: var(--sp-5); margin-bottom: var(--sp-6); }\n    h1 { margin: 0; font-size: var(--fs-6); font-weight: 650; letter-spacing: -.02em; line-height: 1.15; }\n    h2.view-title { margin: 0; font-size: var(--fs-6); font-weight: 650; letter-spacing: -.02em; }\n    .eyebrow { color: var(--muted-dim); font-family: var(--font-mono); font-size: var(--fs-2); font-weight: 500; letter-spacing: .1em; text-transform: uppercase; margin-bottom: var(--sp-2); }\n    .sub { color: var(--muted); font-size: var(--fs-3); margin-top: var(--sp-2); max-width: 46ch; }\n    .new-btn { border: 1px solid var(--line); background: var(--panel-2); color: var(--text); border-radius: var(--radius-sm); padding: var(--sp-2) var(--sp-3); font-weight: 600; font-size: var(--fs-3); transition: border-color 120ms ease-out; }\n    .new-btn:hover { border-color: #333b46; }\n    .intake { background: var(--panel); border: 1px solid var(--line); border-radius: var(--radius); padding: var(--sp-4); display: grid; grid-template-columns: 1fr 1fr .72fr auto; gap: var(--sp-3); align-items: end; }\n    label { display: block; color: var(--muted); font-size: var(--fs-2); font-weight: 550; margin-bottom: var(--sp-2); }\n    input { width: 100%; height: 38px; border: 1px solid var(--line); background: var(--bg); color: var(--text); border-radius: var(--radius-sm); padding: 0 var(--sp-3); outline: none; transition: border-color 120ms ease-out, box-shadow 120ms ease-out; }\n    input:focus-visible { border-color: var(--accent); box-shadow: 0 0 0 1px var(--accent); outline: none; }\n    .run-btn { height: 38px; border: 1px solid #7a3a1e; border-radius: var(--radius-sm); padding: 0 var(--sp-4); background: var(--accent); color: var(--accent-ink); font-weight: 650; font-size: var(--fs-3); white-space: nowrap; transition: background-color 120ms ease-out; }\n    .run-btn:hover:not([disabled]) { background: #ee7040; }\n    .run-btn[disabled] { opacity: .65; cursor: wait; }\n    .pipeline { margin: var(--sp-3) 0 var(--sp-6); border: 1px solid var(--line-soft); background: #0a0c0f; border-radius: var(--radius-sm); min-height: 40px; display: flex; align-items: center; padding: 0 var(--sp-4); gap: var(--sp-2); overflow-x: auto; font-family: var(--font-mono); }\n    .stage { display: flex; align-items: center; gap: 7px; color: var(--muted-dim); font-size: var(--fs-1); white-space: nowrap; }\n    .stage::before { content:\"\"; width: 6px; height: 6px; background: #333a44; border-radius: 1px; }\n    .stage.done { color: var(--muted); }\n    .stage.done::before { background: var(--good); }\n    .stage.active { color: #f2b18e; }\n    .stage.active::before { background: var(--accent); }\n    .arrow { color: #2a303a; font-size: var(--fs-1); }\n    .summary-grid { display: grid; grid-template-columns: 1.35fr .8fr .8fr .8fr; gap: var(--sp-3); margin-bottom: var(--sp-6); }\n    .metric { border: 1px solid var(--line); background: var(--panel); border-radius: var(--radius); padding: var(--sp-4); min-height: 96px; }\n    .metric-primary { background: var(--panel-2); border-left: 2px solid var(--accent); }\n    .metric-label { color: var(--muted); font-family: var(--font-mono); font-size: var(--fs-2); text-transform: uppercase; letter-spacing: .04em; margin-bottom: var(--sp-3); }\n    .metric-value { font-family: var(--font-mono); font-size: var(--fs-5); font-weight: 650; letter-spacing: -.01em; font-variant-numeric: tabular-nums; }\n    .metric-note { color: var(--muted); font-size: var(--fs-2); margin-top: var(--sp-2); }\n    .recommend { display: flex; align-items: center; gap: var(--sp-3); }\n    .go-ring {\n      isolation: isolate;\n      --pct: 64; --ring-color: var(--good);\n      width: 48px; height: 48px; flex: 0 0 48px; border-radius: 50%;\n      display: grid; place-items: center;\n      font-family: var(--font-mono); font-size: var(--fs-1); font-weight: 700; letter-spacing: .02em;\n      color: var(--ring-color);\n      background:\n        radial-gradient(closest-side, var(--panel-2) 76%, transparent 78% 100%),\n        conic-gradient(var(--ring-color) calc(var(--pct) * 1%), var(--line) 0);\n    }\n    .two-col { display: grid; grid-template-columns: minmax(0,1.55fr) minmax(300px,.8fr); gap: var(--sp-4); }\n    .card { border: 1px solid var(--line); background: var(--panel); border-radius: var(--radius); overflow: hidden; }\n    .card-head { padding: var(--sp-3) var(--sp-4); border-bottom: 1px solid var(--line); display: flex; justify-content: space-between; align-items: center; gap: var(--sp-2); flex-wrap: wrap; }\n    .card-head-text { display: flex; align-items: center; gap: var(--sp-2); flex-wrap: wrap; }\n    .card-title { font-weight: 650; font-size: var(--fs-4); }\n    .card-meta { color: var(--muted); font-family: var(--font-mono); font-size: var(--fs-1); }\n    .flag { font-family: var(--font-mono); font-size: var(--fs-1); text-transform: uppercase; letter-spacing: .03em; padding: 3px 7px; border-radius: var(--radius-sm); border: 1px solid var(--line); color: var(--muted-dim); }\n    .flag.model { color: #8fc7ff; border-color: #253a52; background: #101a26; }\n    .competitor { padding: var(--sp-4); border-bottom: 1px solid var(--line-soft); display: grid; grid-template-columns: 40px minmax(150px,1.2fr) .9fr .9fr 100px 20px; gap: var(--sp-3); align-items: center; transition: background-color 150ms ease-out; }\n    .competitor:hover { background: var(--panel-2); }\n    .competitor:last-child { border-bottom: 0; }\n    .rank { width: 32px; height: 32px; border: 1px solid var(--line); background: var(--bg); border-radius: var(--radius-sm); display: grid; place-items: center; color: var(--muted); font-family: var(--font-mono); font-size: var(--fs-2); font-weight: 600; }\n    .company { font-weight: 600; font-size: var(--fs-4); }\n    .company span { display: block; color: var(--muted); font-size: var(--fs-2); font-weight: 400; margin-top: var(--sp-1); }\n    .mini-label { color: var(--muted-dim); font-family: var(--font-mono); font-size: var(--fs-1); text-transform: uppercase; letter-spacing: .03em; margin-bottom: 5px; }\n    .bar { height: 4px; border-radius: 2px; background: var(--line); overflow: hidden; }\n    .bar i { display: block; height: 100%; background: var(--seq-1); border-radius: inherit; }\n    .bar.green i { background: var(--seq-2); }\n    .score { font-family: var(--font-mono); font-size: var(--fs-2); margin-top: 5px; font-variant-numeric: tabular-nums; color: var(--muted); }\n    .badge { justify-self: start; border-radius: var(--radius-sm); padding: 4px 7px; font-family: var(--font-mono); font-size: var(--fs-1); font-weight: 600; text-transform: uppercase; letter-spacing: .02em; border: 1px solid transparent; }\n    .badge.high { background: var(--critical-soft); color: #f0a2a2; border-color: #4a2226; }\n    .badge.med { background: var(--warn-soft); color: #e7c069; border-color: #4a3a17; }\n    .badge.watch { background: transparent; color: var(--muted); border-color: var(--line); }\n    .chev { color: var(--muted-dim); text-decoration: none; }\n    .chev:hover { color: var(--muted); }\n    .insight { padding: var(--sp-4); border-bottom: 1px solid var(--line-soft); }\n    .insight:last-child { border-bottom: 0; }\n    .insight-top { display: flex; justify-content: space-between; gap: var(--sp-3); }\n    .insight h3 { margin: 0; font-size: var(--fs-3); font-weight: 600; }\n    .insight p { margin: var(--sp-2) 0 0; color: #aab1ba; font-size: var(--fs-3); line-height: 1.55; }\n    .source { color: var(--muted); font-family: var(--font-mono); font-size: var(--fs-1); white-space: nowrap; }\n    .footer-row { display: flex; align-items: center; justify-content: space-between; gap: var(--sp-3); padding: var(--sp-3) var(--sp-4); border-top: 1px solid var(--line); flex-wrap: wrap; }\n    .export { border: 1px solid var(--line); background: var(--panel-2); color: var(--text); border-radius: var(--radius-sm); padding: 7px 10px; font-size: var(--fs-2); font-weight: 550; display: inline-flex; align-items: center; gap: 6px; transition: border-color 120ms ease-out; }\n    .export svg { width: 13px; height: 13px; stroke-width: 1.75; }\n    .export:hover { border-color: #333b46; }\n    .demo-note { color: var(--muted-dim); font-family: var(--font-mono); font-size: var(--fs-1); }\n    .summary-card { margin-bottom: var(--sp-4); }\n    .summary-body { padding: var(--sp-4); margin: 0; color: #aab1ba; font-size: var(--fs-3); line-height: 1.6; }\n    .caveats { border: 1px solid var(--line); background: var(--panel); border-radius: var(--radius); padding: var(--sp-4); margin-top: var(--sp-4); }\n    .caveats h2 { margin: 0 0 var(--sp-3); font-size: var(--fs-3); font-weight: 650; }\n    .caveats ul { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: var(--sp-2); }\n    .caveats li { font-size: var(--fs-3); color: var(--muted); line-height: 1.55; padding-left: var(--sp-3); border-left: 2px solid var(--line); }\n    .toast { isolation: isolate; position: fixed; right: 22px; bottom: 22px; background: #eef1f4; color: #14171b; border-radius: var(--radius-sm); padding: 11px 14px; font-size: var(--fs-3); font-weight: 550; transform: translateY(80px); opacity: 0; box-shadow: 0 10px 30px rgba(0,0,0,.35); transition: transform 200ms ease-out, opacity 200ms ease-out; max-width: 380px; }\n    .toast.show { transform: translateY(0); opacity: 1; }\n    .pulse { animation: pulse .9s infinite alternate; }\n    @keyframes pulse { to { opacity: .45; } }\n    @media (prefers-reduced-motion: reduce) {\n      .pulse { animation: none; opacity: .75; }\n      html { scroll-behavior: auto; }\n      * { transition-duration: 0.01ms !important; }\n    }\n    /* View-specific content */\n    .view-sub { color: var(--muted); font-size: var(--fs-3); margin: var(--sp-2) 0 var(--sp-6); max-width: 60ch; }\n    .empty-state { border: 1px dashed var(--line); border-radius: var(--radius); padding: var(--sp-9) var(--sp-6); text-align: center; color: var(--muted); }\n    .empty-state p { margin: 0 auto; max-width: 44ch; font-size: var(--fs-3); line-height: 1.6; }\n    .empty-state .export { margin-top: var(--sp-4); }\n    table.data-table { width: 100%; border-collapse: collapse; }\n    table.data-table th { text-align: left; font-family: var(--font-mono); font-size: var(--fs-1); text-transform: uppercase; letter-spacing: .03em; color: var(--muted-dim); font-weight: 600; padding: var(--sp-3) var(--sp-4); border-bottom: 1px solid var(--line); }\n    table.data-table td { padding: var(--sp-3) var(--sp-4); border-bottom: 1px solid var(--line-soft); font-size: var(--fs-3); vertical-align: top; }\n    table.data-table tr:last-child td { border-bottom: 0; }\n    table.data-table td.num { font-family: var(--font-mono); font-variant-numeric: tabular-nums; color: var(--muted); }\n    .workboard-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: var(--sp-3); }\n    .work-card { border: 1px solid var(--line); background: var(--panel); border-radius: var(--radius); padding: var(--sp-4); display: flex; flex-direction: column; gap: var(--sp-3); }\n    .work-card h3 { margin: 0; font-size: var(--fs-4); font-weight: 600; }\n    .work-card p { margin: 0; font-size: var(--fs-3); color: var(--muted); line-height: 1.55; }\n    .work-status { display: flex; align-items: center; gap: var(--sp-2); margin-top: auto; }\n    .work-status label { margin: 0; }\n    .work-status select { border: 1px solid var(--line); background: var(--bg); color: var(--text); border-radius: var(--radius-sm); padding: 6px 8px; font-size: var(--fs-2); }\n    .history-row-actions { display: flex; gap: var(--sp-2); }\n    .link-btn { background: transparent; border: 0; color: var(--seq-1); font-size: var(--fs-3); padding: 0; text-decoration: underline; text-underline-offset: 2px; }\n    .link-btn.danger { color: var(--critical); }\n    .history-caveat { color: var(--muted-dim); font-family: var(--font-mono); font-size: var(--fs-1); margin: var(--sp-2) 0 var(--sp-5); }\n    @media (max-width: 1050px) {\n      .intake { grid-template-columns: 1fr 1fr; }\n      .run-btn { width: 100%; }\n      .summary-grid { grid-template-columns: 1fr 1fr; }\n      .two-col { grid-template-columns: 1fr; }\n    }\n    @media (max-width: 760px) {\n      .app { display: block; }\n      .rail { height: auto; position: static; padding: var(--sp-3) var(--sp-4); flex-direction: row; align-items: center; overflow-x: auto; }\n      .brand { padding: 0 var(--sp-4) 0 0; }\n      .brand small, .nav-label, .rail-foot { display: none; }\n      .nav-item { width: auto; white-space: nowrap; border-left: 0; border-bottom: 2px solid transparent; }\n      .nav-item.active { border-left: 0; border-bottom-color: var(--accent); }\n      .topbar { padding: 0 var(--sp-4); }\n      .content { padding: var(--sp-6) var(--sp-4) var(--sp-8); }\n      .heading-row { align-items: flex-start; }\n      .new-btn { display: none; }\n      .intake { grid-template-columns: 1fr; }\n      .summary-grid { grid-template-columns: 1fr 1fr; }\n      .competitor { grid-template-columns: 34px 1fr 88px 18px; }\n      .competitor > :nth-child(3), .competitor > :nth-child(4) { display: none; }\n      .badge { justify-self: end; }\n    }\n    @media (max-width: 480px) {\n      .summary-grid { grid-template-columns: 1fr; }\n      .status { display: none; }\n    }\n  </style>\n</head>\n<body>\n  <div class=\"app\">\n    <aside class=\"rail\">\n      <a class=\"brand\" href=\"/\"><div class=\"brand-mark\">BH</div><div><div class=\"brand-name\">BlackHat</div><small>Capture intelligence</small></div></a>\n      <div class=\"nav-label\">Workspace</div>\n      <button class=\"nav-item active\" data-view=\"cockpit\" aria-current=\"page\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"><path d=\"M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z\"/></svg>Review cockpit</button>\n      <button class=\"nav-item\" data-view=\"competitors\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"><path d=\"M4 19V8l8-4 8 4v11M8 19v-5h8v5\"/></svg>Competitors</button>\n      <button class=\"nav-item\" data-view=\"themes\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"><path d=\"M4 19h16M6 16l4-5 3 2 5-7\"/></svg>Win themes</button>\n      <div class=\"nav-label\">Library</div>\n      <button class=\"nav-item\" data-view=\"history\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"><path d=\"M5 3h11l3 3v15H5zM8 10h8M8 14h8M8 18h5\"/></svg>Past reviews</button>\n      <div class=\"rail-foot\"><strong id=\"sourceHealth\">Live research ready</strong><br>USAspending · SAM.gov · GDELT</div>\n    </aside>\n    <main>\n      <header class=\"topbar\">\n        <div class=\"crumb\">Pursuits / <strong id=\"crumbLabel\">Active review</strong></div>\n        <div class=\"top-actions\"><span class=\"status\">Research agents ready</span><button class=\"icon-btn\" id=\"connectorStatusBtn\" aria-label=\"Connector status\">●</button></div>\n      </header>\n      <div class=\"content\">\n\n        <section class=\"view\" data-view=\"cockpit\">\n          <div class=\"heading-row\">\n            <div><div class=\"eyebrow\">Agentic black hat review</div><h1>Opportunity review</h1><div class=\"sub\">Evidence-backed competitor scan against public federal award history.</div></div>\n            <button class=\"new-btn\" id=\"newReview\">New review</button>\n          </div>\n\n          <section class=\"intake\" aria-label=\"Opportunity intake\">\n            <div><label for=\"opportunity\">Opportunity or solicitation</label><input id=\"opportunity\" value=\"GSA OASIS+ Total Small Business — Domain 5\" /></div>\n            <div><label for=\"agency\">Agency</label><input id=\"agency\" value=\"General Services Administration\" /></div>\n            <div><label for=\"incumbent\">Known incumbent</label><input id=\"incumbent\" value=\"Booz Allen Hamilton\" /></div>\n            <button class=\"run-btn\" id=\"runReview\">Run black hat</button>\n          </section>\n\n          <div class=\"pipeline\" aria-live=\"polite\">\n            <span class=\"stage done\">Opportunity Analyst</span><span class=\"arrow\">›</span>\n            <span class=\"stage done\">Market Researcher</span><span class=\"arrow\">›</span>\n            <span class=\"stage done\">Black Hat Strategist</span><span class=\"arrow\">›</span>\n            <span class=\"stage active\">Evidence Reviewer</span>\n          </div>\n\n          <section class=\"summary-grid\" aria-label=\"Decision summary\">\n            <div class=\"metric metric-primary\"><div class=\"metric-label\">Recommendation</div><div class=\"recommend\"><div class=\"go-ring\" id=\"bidRing\">BID</div><div><div class=\"metric-value\" id=\"recommendation\">Proceed</div><div class=\"metric-note\" id=\"recommendationNote\">Run a live scan to refresh</div></div></div></div>\n            <div class=\"metric\"><div class=\"metric-label\">Win probability</div><div class=\"metric-value\" id=\"winProbability\">64%</div><div class=\"metric-note\">Evidence-weighted estimate</div></div>\n            <div class=\"metric\"><div class=\"metric-label\">Likely bidders</div><div class=\"metric-value\" id=\"bidderCount\">4</div><div class=\"metric-note\" id=\"threatCount\">2 high-threat rivals</div></div>\n            <div class=\"metric\"><div class=\"metric-label\">Evidence strength</div><div class=\"metric-value\" id=\"evidenceStrength\">87%</div><div class=\"metric-note\" id=\"evidenceCount\">Illustrative until refreshed</div></div>\n          </section>\n\n          <section class=\"card summary-card\">\n            <div class=\"card-head\"><div class=\"card-head-text\"><div class=\"card-title\">Gate-review summary</div><span class=\"flag\" id=\"summaryFlag\">Illustrative example</span></div><div class=\"card-meta\">Evidence-bound narrative</div></div>\n            <p class=\"summary-body\" id=\"summaryText\">Run a live review to generate an evidence-bound summary of the competitive picture, written from the same evidence shown below.</p>\n          </section>\n\n          <div class=\"two-col\">\n            <section class=\"card\">\n              <div class=\"card-head\"><div class=\"card-head-text\"><div class=\"card-title\">Competitive landscape</div><span class=\"flag\" id=\"landscapeFlag\">Illustrative example</span></div><div class=\"card-meta\">Ranked by fit, access &amp; past performance</div></div>\n              <div id=\"competitorList\"><div class=\"competitor\">\n                <div class=\"rank\">01</div><div class=\"company\">Booz Allen Hamilton<span>Incumbent · strongest agency access</span></div>\n                <div><div class=\"mini-label\">Capability fit</div><div class=\"bar\"><i style=\"width:94%\"></i></div><div class=\"score\">94 / 100</div></div>\n                <div><div class=\"mini-label\">Price posture</div><div class=\"bar green\"><i style=\"width:68%\"></i></div><div class=\"score\">Premium</div></div>\n                <span class=\"badge high\">High threat</span><span class=\"chev\">›</span>\n              </div>\n              <div class=\"competitor\">\n                <div class=\"rank\">02</div><div class=\"company\">Guidehouse<span>Deep civilian-domain delivery bench</span></div>\n                <div><div class=\"mini-label\">Capability fit</div><div class=\"bar\"><i style=\"width:88%\"></i></div><div class=\"score\">88 / 100</div></div>\n                <div><div class=\"mini-label\">Price posture</div><div class=\"bar green\"><i style=\"width:79%\"></i></div><div class=\"score\">Aggressive</div></div>\n                <span class=\"badge high\">High threat</span><span class=\"chev\">›</span>\n              </div>\n              <div class=\"competitor\">\n                <div class=\"rank\">03</div><div class=\"company\">Deloitte<span>Transformation credentials, higher cost base</span></div>\n                <div><div class=\"mini-label\">Capability fit</div><div class=\"bar\"><i style=\"width:82%\"></i></div><div class=\"score\">82 / 100</div></div>\n                <div><div class=\"mini-label\">Price posture</div><div class=\"bar green\"><i style=\"width:61%\"></i></div><div class=\"score\">Premium</div></div>\n                <span class=\"badge med\">Medium</span><span class=\"chev\">›</span>\n              </div>\n              <div class=\"competitor\">\n                <div class=\"rank\">04</div><div class=\"company\">ICF<span>Domain specialist · selective pursuit pattern</span></div>\n                <div><div class=\"mini-label\">Capability fit</div><div class=\"bar\"><i style=\"width:76%\"></i></div><div class=\"score\">76 / 100</div></div>\n                <div><div class=\"mini-label\">Price posture</div><div class=\"bar green\"><i style=\"width:83%\"></i></div><div class=\"score\">Aggressive</div></div>\n                <span class=\"badge med\">Medium</span><span class=\"chev\">›</span>\n              </div></div>\n              <div class=\"footer-row\"><span class=\"demo-note\" id=\"dataMode\">Illustrative data shown · run a review for live results</span><div style=\"display:flex;gap:var(--sp-2)\"><button class=\"export\" id=\"exportBrief\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"><path d=\"M12 4v11m0 0l-4-4m4 4l4-4M5 19h14\"/></svg>JSON</button><button class=\"export\" id=\"exportMarkdown\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"><path d=\"M12 4v11m0 0l-4-4m4 4l4-4M5 19h14\"/></svg>Brief (.md)</button></div></div>\n            </section>\n\n            <section class=\"card\">\n              <div class=\"card-head\"><div class=\"card-head-text\"><div class=\"card-title\">How we win</div><span class=\"flag\" id=\"strategyFlag\">Template</span></div><div class=\"card-meta\">Top recommended counters</div></div>\n              <div id=\"strategyList\"><div class=\"insight\"><div class=\"insight-top\"><h3>1. Turn incumbent scale into transition risk</h3><span class=\"source\">Inference</span></div><p>Lead with a 30-day transition plan and named key personnel. Ghost the incumbent’s delivery sprawl—not its technical capability.</p></div>\n              <div class=\"insight\"><div class=\"insight-top\"><h3>2. Make price predictability the discriminator</h3><span class=\"source\">Inference</span></div><p>Offer a modular labor mix with explicit automation savings. Neutralize a low-price posture with lower execution risk.</p></div>\n              <div class=\"insight\"><div class=\"insight-top\"><h3>3. Prove domain depth, not generic transformation</h3><span class=\"source\">Inference</span></div><p>Anchor each win theme in agency-specific outcomes and two directly comparable past performances.</p></div></div>\n              <div class=\"footer-row\"><span class=\"demo-note\">Decision rationale is traceable</span><button class=\"export\" id=\"showRationale\">View rationale</button></div>\n            </section>\n          </div>\n\n          <section class=\"caveats\" aria-label=\"Evidence limitations\">\n            <h2>What this review doesn't tell you</h2>\n            <ul id=\"caveatsList\">\n              <li>Competitor ranking is an evidence-backed market signal, not proof that a company will bid.</li>\n              <li>CPARS evaluations are restricted and are not accessed by this application.</li>\n              <li>Strategic recommendations are labeled inferences and require capture-team review.</li>\n            </ul>\n          </section>\n        </section>\n\n        <section class=\"view\" data-view=\"competitors\" hidden>\n          <h2 class=\"view-title\">Competitor roster</h2>\n          <p class=\"view-sub\">Full-precision detail from the latest review, for citing directly in a gate-review brief.</p>\n          <div id=\"competitorsTableWrap\">\n            <div class=\"empty-state\"><p>Run a review from the cockpit to populate the competitor roster. This view fills in automatically once a live scan completes.</p></div>\n          </div>\n        </section>\n\n        <section class=\"view\" data-view=\"themes\" hidden>\n          <h2 class=\"view-title\">Capture workboard</h2>\n          <p class=\"view-sub\">Track how your team is acting on each recommended counter-strategy. Saved in this browser only.</p>\n          <div id=\"workboardWrap\">\n            <div class=\"empty-state\"><p>Run a review from the cockpit to generate counter-strategies you can work here.</p></div>\n          </div>\n        </section>\n\n        <section class=\"view\" data-view=\"history\" hidden>\n          <div class=\"heading-row\">\n            <div><h2 class=\"view-title\">Past reviews</h2><p class=\"view-sub\" style=\"margin-bottom:0\">Every completed live review from this browser, most recent first.</p></div>\n            <button class=\"new-btn\" id=\"clearHistory\">Clear local history</button>\n          </div>\n          <p class=\"history-caveat\">Stored locally in this browser only — never sent to a server, never shared across devices.</p>\n          <div id=\"historyWrap\">\n            <div class=\"empty-state\"><p>No reviews yet. Completed live reviews are saved here automatically, in your browser only.</p></div>\n          </div>\n        </section>\n\n      </div>\n    </main>\n  </div>\n  <div class=\"toast\" id=\"toast\" role=\"status\"></div>\n  <script>\n    const run = document.getElementById('runReview');\n    const toast = document.getElementById('toast');\n    const stages = [...document.querySelectorAll('.stage')];\n    const AGENT_ORDER = ['Opportunity Analyst', 'Market Researcher', 'Black Hat Strategist', 'Evidence Reviewer'];\n    const badgeClass = { 'High threat': 'high', 'Medium': 'med', 'Watch': 'watch' };\n    let latestReport = null;\n\n    function esc(value) { return String(value ?? '').replace(/[&<>'\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',\"'\":'&#39;','\"':'&quot;'}[c])); }\n    function say(message) { toast.textContent = message; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 3200); }\n\n    // ---- Views ----\n    const views = [...document.querySelectorAll('.view')];\n    const navButtons = [...document.querySelectorAll('.nav-item[data-view]')];\n    const crumbLabel = document.getElementById('crumbLabel');\n    const VIEW_LABELS = { cockpit: 'Active review', competitors: 'Competitors', themes: 'Win themes', history: 'Past reviews' };\n    function showView(name) {\n      views.forEach(v => { v.hidden = v.dataset.view !== name; });\n      navButtons.forEach(b => {\n        const active = b.dataset.view === name;\n        b.classList.toggle('active', active);\n        if (active) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');\n      });\n      crumbLabel.textContent = VIEW_LABELS[name] || name;\n      if (name === 'competitors') renderCompetitorsView();\n      if (name === 'themes') renderWorkboard();\n      if (name === 'history') renderHistory();\n    }\n    navButtons.forEach(b => b.addEventListener('click', () => showView(b.dataset.view)));\n\n    // ---- Local storage (client-only; never sent to the server) ----\n    const HISTORY_KEY = 'blackhat.history.v1';\n    const WORKBOARD_KEY = 'blackhat.workboard.v1';\n    function loadJSON(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch (_) { return fallback; } }\n    function saveJSON(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) {} }\n    function loadHistory() { return loadJSON(HISTORY_KEY, []); }\n    function loadWorkboard() { return loadJSON(WORKBOARD_KEY, {}); }\n    function opportunityKey(report) { return `${report.meta.opportunity}|${report.meta.agency}`.toLowerCase(); }\n\n    // ---- Competitors detail view ----\n    function renderCompetitorsView() {\n      const wrap = document.getElementById('competitorsTableWrap');\n      if (!latestReport || !latestReport.competitors.length) {\n        wrap.innerHTML = '<div class=\"empty-state\"><p>Run a review from the cockpit to populate the competitor roster. This view fills in automatically once a live scan completes.</p></div>';\n        return;\n      }\n      const rows = latestReport.competitors.map((c, i) => `<tr><td class=\"num\">${String(i + 1).padStart(2,'0')}</td><td>${esc(c.name)}</td><td class=\"num\">${esc(c.uei || '—')}</td><td class=\"num\">${Number(c.amount).toLocaleString()}</td><td class=\"num\">${c.score} / 100</td><td><span class=\"badge ${badgeClass[c.threat] || 'watch'}\">${esc(c.threat)}</span></td></tr>`).join('');\n      wrap.innerHTML = `<table class=\"data-table\"><caption class=\"sr-only\">Ranked competitors from the latest review</caption><thead><tr><th scope=\"col\">Rank</th><th scope=\"col\">Company</th><th scope=\"col\">UEI</th><th scope=\"col\">5-yr obligations</th><th scope=\"col\">Market signal</th><th scope=\"col\">Threat</th></tr></thead><tbody>${rows}</tbody></table>`;\n    }\n\n    // ---- Win themes workboard ----\n    const WORK_STATES = ['Not started', 'Drafting', 'Ready', \"Won't use\"];\n    function renderWorkboard() {\n      const wrap = document.getElementById('workboardWrap');\n      if (!latestReport || !latestReport.strategies.length) {\n        wrap.innerHTML = '<div class=\"empty-state\"><p>Run a review from the cockpit to generate counter-strategies you can work here.</p></div>';\n        return;\n      }\n      const board = loadWorkboard();\n      const key = opportunityKey(latestReport);\n      const record = board[key] || {};\n      wrap.innerHTML = `<div class=\"workboard-grid\">${latestReport.strategies.map((s, i) => {\n        const status = record[s.title] || 'Not started';\n        const options = WORK_STATES.map(state => `<option value=\"${esc(state)}\" ${state === status ? 'selected' : ''}>${esc(state)}</option>`).join('');\n        return `<div class=\"work-card\"><h3>${i + 1}. ${esc(s.title)}</h3><p>${esc(s.text)}</p><div class=\"work-status\"><label for=\"work-${i}\">Status</label><select id=\"work-${i}\" data-title=\"${esc(s.title)}\">${options}</select></div></div>`;\n      }).join('')}</div>`;\n      wrap.querySelectorAll('select[data-title]').forEach(select => {\n        select.addEventListener('change', () => {\n          const board = loadWorkboard();\n          const key = opportunityKey(latestReport);\n          board[key] = board[key] || {};\n          board[key][select.dataset.title] = select.value;\n          saveJSON(WORKBOARD_KEY, board);\n        });\n      });\n    }\n\n    // ---- Past reviews (history) ----\n    function renderHistory() {\n      const wrap = document.getElementById('historyWrap');\n      const history = loadHistory();\n      if (!history.length) {\n        wrap.innerHTML = '<div class=\"empty-state\"><p>No reviews yet. Completed live reviews are saved here automatically, in your browser only.</p></div>';\n        return;\n      }\n      const rows = history.map(entry => `<tr><td class=\"num\">${new Date(entry.ts).toLocaleString()}</td><td>${esc(entry.opportunity)}</td><td>${esc(entry.agency)}</td><td><span class=\"badge ${entry.recommendation === 'Proceed' ? 'watch' : 'med'}\">${esc(entry.recommendation)}</span></td><td class=\"num\">${entry.winProbability}%</td><td><div class=\"history-row-actions\"><button class=\"link-btn\" data-reopen=\"${esc(entry.id)}\">Reopen</button><button class=\"link-btn danger\" data-remove=\"${esc(entry.id)}\">Remove</button></div></td></tr>`).join('');\n      wrap.innerHTML = `<table class=\"data-table\"><caption class=\"sr-only\">Past locally-saved reviews</caption><thead><tr><th scope=\"col\">When</th><th scope=\"col\">Opportunity</th><th scope=\"col\">Agency</th><th scope=\"col\">Recommendation</th><th scope=\"col\">Win probability</th><th scope=\"col\">Actions</th></tr></thead><tbody>${rows}</tbody></table>`;\n      wrap.querySelectorAll('[data-reopen]').forEach(btn => btn.addEventListener('click', () => {\n        const entry = loadHistory().find(e => e.id === btn.dataset.reopen);\n        if (!entry) return;\n        document.getElementById('opportunity').value = entry.opportunity;\n        document.getElementById('agency').value = entry.agency;\n        document.getElementById('incumbent').value = entry.incumbent || '';\n        showView('cockpit');\n        say('Loaded inputs from a past review — run it again for a fresh live scan.');\n      }));\n      wrap.querySelectorAll('[data-remove]').forEach(btn => btn.addEventListener('click', () => {\n        const next = loadHistory().filter(e => e.id !== btn.dataset.remove);\n        saveJSON(HISTORY_KEY, next);\n        renderHistory();\n      }));\n    }\n    document.getElementById('clearHistory').addEventListener('click', () => {\n      saveJSON(HISTORY_KEY, []);\n      renderHistory();\n      say('Local review history cleared.');\n    });\n\n    // ---- Connector status (topbar icon button) ----\n    document.getElementById('connectorStatusBtn').addEventListener('click', () => {\n      if (!latestReport) { say('Run a live review to see connector status.'); return; }\n      say(latestReport.evidence.sources.map(s => `${s.name}: ${s.status}`).join(' · '));\n    });\n\n    // ---- Main report rendering ----\n    function renderReport(report) {\n      latestReport = report;\n      const d = report.decision;\n      document.getElementById('recommendation').textContent = d.recommendation;\n      document.getElementById('recommendationNote').textContent = `${d.topThreats} high-threat rival${d.topThreats === 1 ? '' : 's'} detected`;\n      const ring = document.getElementById('bidRing');\n      ring.textContent = d.recommendation === 'Proceed' ? 'BID' : 'CHECK';\n      ring.style.setProperty('--pct', d.winProbability);\n      ring.style.setProperty('--ring-color', d.recommendation === 'Proceed' ? 'var(--good)' : 'var(--warn)');\n      document.getElementById('winProbability').textContent = `${d.winProbability}%`;\n      document.getElementById('bidderCount').textContent = d.bidderCount;\n      document.getElementById('threatCount').textContent = `${d.topThreats} high-threat rival${d.topThreats === 1 ? '' : 's'}`;\n      document.getElementById('evidenceStrength').textContent = `${d.evidenceStrength}%`;\n      document.getElementById('evidenceCount').textContent = `${d.evidenceCount} evidence items checked`;\n      document.getElementById('dataMode').textContent = `Live ${report.meta.mode} · ${new Date(report.meta.generatedAt).toLocaleString()}`;\n      document.getElementById('sourceHealth').textContent = 'Live research complete';\n      document.getElementById('landscapeFlag')?.remove();\n      const strategyFlag = document.getElementById('strategyFlag');\n      if (strategyFlag) {\n        const isModel = report.meta.strategistMode === 'model';\n        strategyFlag.textContent = isModel ? 'Model-generated' : 'Rule-based';\n        strategyFlag.classList.toggle('model', isModel);\n      }\n      document.getElementById('summaryText').textContent = report.summary;\n      const summaryFlag = document.getElementById('summaryFlag');\n      if (summaryFlag) {\n        const isModel = report.meta.reviewerMode === 'model';\n        summaryFlag.textContent = isModel ? 'Model-generated' : 'Rule-based';\n        summaryFlag.classList.toggle('model', isModel);\n      }\n      document.getElementById('competitorList').innerHTML = report.competitors.map((c, i) => `<div class=\"competitor\"><div class=\"rank\">${String(i + 1).padStart(2,'0')}</div><div class=\"company\">${esc(c.name)}<span>${esc(c.evidence.fact)}</span></div><div><div class=\"mini-label\">Market signal</div><div class=\"bar\"><i style=\"width:${c.score}%\"></i></div><div class=\"score\">${c.score} / 100</div></div><div><div class=\"mini-label\">Agency obligations</div><div class=\"bar green\"><i style=\"width:${Math.min(100,c.score - 5)}%\"></i></div><div class=\"score\">${esc(c.amountLabel)}</div></div><span class=\"badge ${badgeClass[c.threat] || 'watch'}\">${esc(c.threat)}</span><a class=\"chev\" href=\"${esc(c.evidence.url)}\" target=\"_blank\" rel=\"noopener\" aria-label=\"Open USAspending evidence\">›</a></div>`).join('');\n      document.getElementById('strategyList').innerHTML = report.strategies.map((s, i) => `<div class=\"insight\"><div class=\"insight-top\"><h3>${i + 1}. ${esc(s.title)}</h3><span class=\"source\">${s.confidence}% confidence</span></div><p>${esc(s.text)}</p><p class=\"demo-note\">${esc(s.basis)}</p></div>`).join('');\n      document.getElementById('caveatsList').innerHTML = report.limitations.map(item => `<li>${esc(item)}</li>`).join('');\n      // Stage elements are already updated live by applyStageEvent() as the\n      // stream arrives; by the time this 'result' event fires all four should\n      // already read 'done'. This is just a safety net if any were missed.\n      stages.forEach((stage) => { if (!stage.classList.contains('done')) stage.className = 'stage done'; });\n\n      const history = loadHistory();\n      history.unshift({\n        id: `${Date.now()}`, ts: report.meta.generatedAt, opportunity: report.meta.opportunity,\n        agency: report.meta.agency, incumbent: report.meta.incumbent,\n        recommendation: d.recommendation, winProbability: d.winProbability,\n      });\n      saveJSON(HISTORY_KEY, history.slice(0, 25));\n\n      if (document.querySelector('.view[data-view=\"competitors\"]:not([hidden])')) renderCompetitorsView();\n      if (document.querySelector('.view[data-view=\"themes\"]:not([hidden])')) renderWorkboard();\n      if (document.querySelector('.view[data-view=\"history\"]:not([hidden])')) renderHistory();\n    }\n    // Applies one real backend stage-progress event (see NDJSON contract in\n    // AGENTS.md) to the matching .stage element. Server only ever emits\n    // 'running' or 'complete' for these four agents, in this fixed order.\n    function applyStageEvent(event) {\n      const idx = AGENT_ORDER.indexOf(event.agent);\n      if (idx === -1) return;\n      const el = stages[idx];\n      el.textContent = event.agent;\n      el.className = event.status === 'running' ? 'stage active pulse' : 'stage done';\n    }\n\n    run.addEventListener('click', async () => {\n      const payload = { opportunity: document.getElementById('opportunity').value, agency: document.getElementById('agency').value, incumbent: document.getElementById('incumbent').value };\n      if (!payload.opportunity.trim() || !payload.agency.trim()) { say('Enter an opportunity and agency first.'); return; }\n      run.disabled = true; run.textContent = 'Agents researching…';\n      stages.forEach((s) => { s.className = 'stage'; });\n      let gotResult = false;\n      try {\n        const response = await fetch('/api/research', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });\n        if (!response.ok) {\n          const errorBody = await response.json().catch(() => ({}));\n          throw new Error(errorBody.error || 'Research failed.');\n        }\n        const reader = response.body.getReader();\n        const decoder = new TextDecoder();\n        let buffer = '';\n        while (true) {\n          const { done, value } = await reader.read();\n          if (done) break;\n          buffer += decoder.decode(value, { stream: true });\n          let newlineIndex;\n          while ((newlineIndex = buffer.indexOf('\\n')) !== -1) {\n            const line = buffer.slice(0, newlineIndex);\n            buffer = buffer.slice(newlineIndex + 1);\n            if (!line.trim()) continue;\n            const streamEvent = JSON.parse(line);\n            if (streamEvent.type === 'stage') applyStageEvent(streamEvent);\n            else if (streamEvent.type === 'result') { gotResult = true; renderReport(streamEvent.report); }\n            else if (streamEvent.type === 'error') { throw new Error(streamEvent.message || 'Research failed.'); }\n          }\n        }\n        if (!gotResult) throw new Error('Research ended without a result. Please try again.');\n        say('Live review complete — evidence and strategy are ready.');\n      } catch (error) {\n        say(error.message || 'Research failed. Please try again.');\n        stages.forEach(s => s.classList.remove('pulse'));\n      } finally {\n        run.disabled = false; run.textContent = 'Run black hat';\n      }\n    });\n    document.getElementById('newReview').addEventListener('click', () => { document.querySelectorAll('input').forEach(x => x.value = ''); document.getElementById('opportunity').focus(); });\n    document.getElementById('exportBrief').addEventListener('click', () => {\n      if (!latestReport) { say('Run a live review before exporting.'); return; }\n      const blob = new Blob([JSON.stringify(latestReport, null, 2)], {type:'application/json'});\n      const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'blackhat-gate-brief.json'; link.click(); URL.revokeObjectURL(link.href);\n      say('Evidence-backed gate brief exported.');\n    });\n    function buildMarkdownBrief(report) {\n      const lines = [\n        '# BlackHat Gate-Review Brief', '',\n        `**Opportunity:** ${report.meta.opportunity}`,\n        `**Agency:** ${report.meta.agency}`,\n      ];\n      if (report.meta.incumbent) lines.push(`**Incumbent:** ${report.meta.incumbent}`);\n      lines.push(`**Generated:** ${new Date(report.meta.generatedAt).toLocaleString()}`, '');\n      lines.push('## Decision',\n        `- Recommendation: **${report.decision.recommendation}** (${report.decision.winProbability}% win probability)`,\n        `- Likely bidders: ${report.decision.bidderCount} (${report.decision.topThreats} high-threat)`,\n        `- Evidence strength: ${report.decision.evidenceStrength}% across ${report.decision.evidenceCount} items`, '');\n      lines.push('## Summary', report.summary, '');\n      lines.push('## Competitive landscape');\n      report.competitors.forEach((c, i) => lines.push(`${i + 1}. **${c.name}** — ${c.threat}, market signal ${c.score}/100, ${c.amountLabel} in agency obligations. ${c.evidence.fact} (${c.evidence.url})`));\n      lines.push('', '## How we win');\n      report.strategies.forEach((s, i) => lines.push(`${i + 1}. **${s.title}** (${s.confidence}% confidence — ${s.basis})\\n   ${s.text}`));\n      lines.push('', '## Limitations');\n      report.limitations.forEach((item) => lines.push(`- ${item}`));\n      return lines.join('\\n');\n    }\n    document.getElementById('exportMarkdown').addEventListener('click', () => {\n      if (!latestReport) { say('Run a live review before exporting.'); return; }\n      const blob = new Blob([buildMarkdownBrief(latestReport)], { type: 'text/markdown' });\n      const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'blackhat-gate-brief.md'; link.click(); URL.revokeObjectURL(link.href);\n      say('Markdown gate-review brief exported.');\n    });\n    document.getElementById('showRationale').addEventListener('click', () => say(latestReport ? `${latestReport.decision.evidenceCount} evidence items support this assessment.` : 'Run a live review to generate a traceable rationale.'));\n  </script>\n</body>\n</html>\n";
const LANDING_HTML = "<!doctype html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"utf-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n  <meta name=\"description\" content=\"BlackHat Capture Intelligence scans public federal award history, ranks likely competitors, and hands capture teams evidence-backed counters before the gate review.\" />\n  <title>BlackHat Capture Intelligence</title>\n  <link rel=\"icon\" type=\"image/svg+xml\" href=\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='10' fill='%23070809'/%3E%3Cpath d='M18 38h28l-5-9H23zM14 42h36v5H14z' fill='%23e2632c'/%3E%3Ccircle cx='27' cy='41' r='2.5' fill='%23070809'/%3E%3Ccircle cx='37' cy='41' r='2.5' fill='%23070809'/%3E%3C/svg%3E\" />\n  <style>\n    :root {\n      color-scheme: dark;\n      --bg: #07080a;\n      --panel: #0d1014;\n      --panel-2: #10141a;\n      --line: #1d232c;\n      --line-soft: #171c23;\n      --text: #eef1f4;\n      --muted: #7c8794;\n      --muted-dim: #78818d;\n      --accent: #e2632c;\n      --accent-ink: #14100c;\n      --good: #2fae7a;\n      --good-soft: #12241d;\n      --seq-1: #3f7cc9;\n      --font-sans: -apple-system, BlinkMacSystemFont, \"Segoe UI\", system-ui, sans-serif;\n      --font-mono: ui-monospace, \"SF Mono\", \"Cascadia Mono\", \"Roboto Mono\", Menlo, Consolas, monospace;\n      --fs-1: .6875rem; --fs-2: .75rem; --fs-3: .8125rem; --fs-4: .9375rem; --fs-5: 1.375rem; --fs-6: 2.5rem; --fs-7: 3.5rem;\n      --sp-1: 4px; --sp-2: 8px; --sp-3: 12px; --sp-4: 16px; --sp-5: 20px; --sp-6: 24px; --sp-7: 28px; --sp-8: 32px; --sp-9: 40px; --sp-10: 48px;\n      font-family: var(--font-sans);\n    }\n    * { box-sizing: border-box; }\n    html { scroll-behavior: smooth; }\n    body { margin: 0; background: var(--bg); color: var(--text); position: relative; }\n    body::before {\n      content: \"\"; position: fixed; inset: 0; pointer-events: none; z-index: 0;\n      background-image:\n        linear-gradient(rgba(255,255,255,.028) 1px, transparent 1px),\n        linear-gradient(90deg, rgba(255,255,255,.028) 1px, transparent 1px);\n      background-size: 44px 44px;\n      mask-image: radial-gradient(ellipse 70% 55% at 50% 0%, black 25%, transparent 82%);\n    }\n    a { color: inherit; }\n    :focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }\n    .wrap { position: relative; z-index: 1; max-width: 760px; margin: 0 auto; padding: 0 var(--sp-6); }\n    .wrap-wide { position: relative; z-index: 1; max-width: 1120px; margin: 0 auto; padding: 0 var(--sp-6); }\n\n    header.top { position: sticky; top: 0; z-index: 10; border-bottom: 1px solid var(--line); background: var(--bg); }\n    .top-inner { max-width: 1120px; margin: 0 auto; padding: var(--sp-4) var(--sp-6); display: flex; align-items: center; justify-content: space-between; gap: var(--sp-4); }\n    .brand { display: flex; align-items: center; gap: var(--sp-2); text-decoration: none; }\n    .brand-mark { width: 28px; height: 28px; border-radius: 6px; display: grid; place-items: center; background: var(--accent); color: var(--accent-ink); font-family: var(--font-mono); font-weight: 700; font-size: var(--fs-2); }\n    .brand-name { font-weight: 650; font-size: var(--fs-4); }\n    .top-nav { display: flex; align-items: center; gap: var(--sp-6); }\n    .top-links { display: flex; gap: var(--sp-5); }\n    .top-links a { font-size: var(--fs-3); color: var(--muted); text-decoration: none; }\n    .top-links a:hover { color: var(--text); }\n    .launch { border: 1px solid #7a3a1e; background: var(--accent); color: var(--accent-ink); border-radius: 5px; padding: 9px 14px; font-weight: 650; font-size: var(--fs-3); text-decoration: none; display: inline-block; transition: background-color 120ms ease-out, transform 120ms ease-out; }\n    .launch:hover { background: #ee7040; transform: translateY(-1px); }\n\n    main { padding-top: var(--sp-10); }\n\n    .hero-grid { display: grid; grid-template-columns: 1.15fr 1fr; gap: var(--sp-10); align-items: center; padding-bottom: var(--sp-9); }\n    .eyebrow { color: var(--muted-dim); font-family: var(--font-mono); font-size: var(--fs-2); font-weight: 500; letter-spacing: .1em; text-transform: uppercase; margin: 0 0 var(--sp-4); }\n    h1 { margin: 0 0 var(--sp-5); font-size: clamp(2.25rem, 4.4vw, var(--fs-7)); font-weight: 680; letter-spacing: -.03em; line-height: 1.04; }\n    h1 .accent-line { color: var(--accent); display: block; }\n    .lede { color: var(--muted); font-size: var(--fs-4); line-height: 1.6; max-width: 50ch; margin: 0 0 var(--sp-7); }\n    .cta-row { display: flex; align-items: center; gap: var(--sp-5); flex-wrap: wrap; margin-bottom: var(--sp-8); }\n    .cta-row .launch { padding: 12px 18px; font-size: var(--fs-4); }\n    .secondary-link { font-size: var(--fs-3); color: var(--muted); text-decoration: underline; text-underline-offset: 3px; }\n    .secondary-link:hover { color: var(--text); }\n\n    .boundary { border: 1px solid var(--line); border-left: 2px solid var(--accent); background: var(--panel); border-radius: 6px; padding: var(--sp-4) var(--sp-5); }\n    .boundary p { margin: 0; font-size: var(--fs-3); color: var(--muted); line-height: 1.6; }\n    .boundary strong { color: var(--text); font-weight: 600; }\n\n    .hero-visual { display: flex; flex-direction: column; align-items: center; gap: var(--sp-3); }\n    .radar-shell { position: relative; width: 100%; max-width: 420px; aspect-ratio: 1; border-radius: 50%; background: radial-gradient(circle at 50% 50%, rgba(226,99,44,.06), transparent 70%); }\n    #radar { width: 100%; height: 100%; display: block; }\n    .radar-controls { display: flex; align-items: center; gap: var(--sp-3); flex-wrap: wrap; justify-content: center; }\n    .radar-caption { font-family: var(--font-mono); font-size: var(--fs-1); color: var(--muted-dim); text-transform: uppercase; letter-spacing: .05em; margin: 0; }\n    .radar-toggle { background: none; border: 0; font-family: var(--font-mono); font-size: var(--fs-1); text-transform: uppercase; letter-spacing: .05em; padding: 0; }\n\n    .stats-band { border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); background: var(--panel); }\n    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); }\n    .stat { padding: var(--sp-7) var(--sp-5); text-align: center; border-left: 1px solid var(--line); }\n    .stat:first-child { border-left: 0; }\n    .stat-value { font-family: var(--font-mono); font-size: var(--fs-6); font-weight: 650; font-variant-numeric: tabular-nums; }\n    .stat-value .unit { font-size: var(--fs-4); color: var(--muted-dim); margin-left: 2px; }\n    .stat-label { color: var(--muted); font-size: var(--fs-2); margin-top: var(--sp-2); }\n\n    section.block { padding: var(--sp-9) 0; border-top: 1px solid var(--line); }\n    section.block:first-of-type { border-top: 0; }\n    .block h2 { font-size: var(--fs-5); font-weight: 650; letter-spacing: -.01em; margin: 0 0 var(--sp-2); }\n    .block .block-sub { color: var(--muted); font-size: var(--fs-3); margin: 0 0 var(--sp-7); max-width: 60ch; line-height: 1.6; }\n\n    .pipeline-list { list-style: none; margin: 0; padding: 0; }\n    .pipeline-list li { position: relative; display: grid; grid-template-columns: 40px 1fr; gap: var(--sp-4); padding: var(--sp-5) 0; }\n    .pipeline-list li:not(:last-child)::after { content: \"\"; position: absolute; left: 19px; top: calc(var(--sp-5) + 22px); bottom: calc(var(--sp-5) * -1 + 4px); width: 1px; background: var(--line); }\n    .step-no { font-family: var(--font-mono); font-size: var(--fs-2); color: var(--muted-dim); padding-top: 2px; z-index: 1; }\n    .pipeline-list h3 { margin: 0 0 var(--sp-1); font-size: var(--fs-4); font-weight: 600; }\n    .pipeline-list p { margin: 0; font-size: var(--fs-3); color: var(--muted); line-height: 1.6; max-width: 62ch; }\n\n    .preview-outer { perspective: 1200px; }\n    .preview-frame { border: 1px solid var(--line); border-radius: 10px; background: var(--panel); overflow: hidden; transform: rotateX(0) rotateY(0); transition: transform 200ms ease-out; box-shadow: 0 24px 60px rgba(0,0,0,.4); }\n    .preview-chrome { display: flex; align-items: center; gap: 6px; padding: var(--sp-3) var(--sp-4); border-bottom: 1px solid var(--line); background: #0a0c0f; }\n    .preview-chrome i { width: 8px; height: 8px; border-radius: 50%; background: var(--line); display: block; }\n    .preview-chrome span { margin-left: var(--sp-3); font-family: var(--font-mono); font-size: var(--fs-1); color: var(--muted-dim); }\n    .preview-body { padding: var(--sp-5); }\n    .mock-row { display: grid; grid-template-columns: 32px 1fr .6fr 70px; gap: var(--sp-3); align-items: center; padding: var(--sp-3) 0; border-bottom: 1px solid var(--line-soft); }\n    .mock-row:last-child { border-bottom: 0; }\n    .mock-rank { width: 28px; height: 28px; border: 1px solid var(--line); border-radius: 5px; display: grid; place-items: center; font-family: var(--font-mono); font-size: var(--fs-1); color: var(--muted); }\n    .mock-name { font-size: var(--fs-3); font-weight: 600; }\n    .mock-name span { display: block; font-size: var(--fs-1); color: var(--muted); font-weight: 400; margin-top: 2px; }\n    .mock-bar { height: 4px; border-radius: 2px; background: var(--line); overflow: hidden; }\n    .mock-bar i { display: block; height: 100%; background: var(--seq-1); }\n    .mock-badge { font-family: var(--font-mono); font-size: var(--fs-1); text-transform: uppercase; padding: 3px 6px; border-radius: 4px; justify-self: start; }\n    .mock-badge.high { background: #251314; color: #f0a2a2; }\n    .mock-badge.med { background: #241d10; color: #e7c069; }\n\n    .sources { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: var(--sp-3); }\n    .source-card { border: 1px solid var(--line); background: var(--panel); border-radius: 8px; padding: var(--sp-4); transition: border-color 120ms ease-out; }\n    .source-card:hover { border-color: #333b46; }\n    .source-card .name { font-weight: 600; font-size: var(--fs-3); margin-bottom: var(--sp-2); }\n    .source-card .tag { display: inline-flex; align-items: center; gap: 6px; font-family: var(--font-mono); font-size: var(--fs-1); text-transform: uppercase; letter-spacing: .03em; color: var(--good); margin-bottom: var(--sp-2); }\n    .source-card .tag::before { content: \"\"; width: 6px; height: 6px; border-radius: 50%; background: currentColor; }\n    .source-card .tag.optional { color: var(--muted-dim); }\n    .source-card p { margin: 0; font-size: var(--fs-2); color: var(--muted); line-height: 1.55; }\n\n    footer { border-top: 1px solid var(--line); padding: var(--sp-7) 0 var(--sp-9); }\n    .foot-inner { max-width: 1120px; margin: 0 auto; padding: 0 var(--sp-6); display: flex; align-items: center; justify-content: space-between; gap: var(--sp-4); flex-wrap: wrap; }\n    footer .brand-name { font-size: var(--fs-3); }\n    footer nav { display: flex; gap: var(--sp-5); }\n    footer nav a { font-size: var(--fs-3); color: var(--muted); text-decoration: none; }\n    footer nav a:hover { color: var(--text); }\n\n    .reveal { opacity: 0; transform: translateY(18px); transition: opacity 500ms ease-out, transform 500ms ease-out; }\n    .reveal.is-visible { opacity: 1; transform: translateY(0); }\n\n    @media (prefers-reduced-motion: reduce) {\n      html { scroll-behavior: auto; }\n      .reveal { transition: none; }\n      .preview-frame { transition: none; }\n    }\n\n    @media (max-width: 900px) {\n      .hero-grid { grid-template-columns: 1fr; }\n      .hero-visual { order: -1; max-width: 320px; margin: 0 auto var(--sp-6); }\n      .stats-grid { grid-template-columns: 1fr 1fr; }\n      .stat:nth-child(3) { border-left: 0; }\n    }\n    @media (max-width: 620px) {\n      main { padding-top: var(--sp-7); }\n      .top-links { display: none; }\n      .stats-grid { grid-template-columns: 1fr 1fr; }\n    }\n  </style>\n</head>\n<body>\n  <header class=\"top\">\n    <div class=\"top-inner\">\n      <a class=\"brand\" href=\"/\"><div class=\"brand-mark\">BH</div><div class=\"brand-name\">BlackHat</div></a>\n      <nav class=\"top-nav\">\n        <div class=\"top-links\"><a href=\"#how-it-works\">Method</a><a href=\"#preview\">Preview</a><a href=\"#sources\">Data sources</a></div>\n        <a class=\"launch\" href=\"/app\">Launch cockpit</a>\n      </nav>\n    </div>\n  </header>\n  <main>\n    <div class=\"wrap-wide\">\n      <div class=\"hero-grid\">\n        <div class=\"hero-copy\">\n          <p class=\"eyebrow\">Agentic black hat review</p>\n          <h1>See the field<span class=\"accent-line\">before you bid.</span></h1>\n          <p class=\"lede\">BlackHat Capture Intelligence scans public federal award history, ranks the competitors most likely to bid, and hands your capture team evidence-backed counters — before the gate review.</p>\n          <div class=\"cta-row\">\n            <a class=\"launch\" href=\"/app\">Launch cockpit</a>\n            <a class=\"secondary-link\" href=\"#how-it-works\">See how it works ↓</a>\n          </div>\n          <div class=\"boundary\">\n            <p><strong>This is decision support, not source selection.</strong> Every ranked company is a market signal from public award data, never a confirmed bidder. Strategic recommendations are labeled inferences for your capture team to review — not facts.</p>\n          </div>\n        </div>\n        <div class=\"hero-visual\">\n          <div class=\"radar-shell\"><canvas id=\"radar\" role=\"img\" aria-label=\"Animated radar illustration representing a competitive scan\"></canvas></div>\n          <div class=\"radar-controls\">\n            <p class=\"radar-caption\">Illustrative scan — not live data</p>\n            <button class=\"secondary-link radar-toggle\" id=\"radarToggle\" type=\"button\" aria-pressed=\"false\">Pause animation</button>\n          </div>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"stats-band\">\n      <div class=\"wrap-wide stats-grid\">\n        <div class=\"stat\"><div class=\"stat-value\"><span data-count=\"5\">0</span><span class=\"unit\">yrs</span></div><div class=\"stat-label\">of award history per scan</div></div>\n        <div class=\"stat\"><div class=\"stat-value\"><span data-count=\"4\">0</span></div><div class=\"stat-label\">live data connectors</div></div>\n        <div class=\"stat\"><div class=\"stat-value\"><span data-count=\"3\">0</span></div><div class=\"stat-label\">counter-strategies per review</div></div>\n        <div class=\"stat\"><div class=\"stat-value\"><span data-count=\"0\">0</span></div><div class=\"stat-label\">fabricated data points, ever</div></div>\n      </div>\n    </div>\n\n    <div class=\"wrap\">\n      <section class=\"block reveal\" id=\"how-it-works\">\n        <h2>Four agents, one research pass</h2>\n        <p class=\"block-sub\">Enter an opportunity, agency, and optional incumbent. A single request runs this pipeline and returns one evidence-backed brief — no waiting on a human analyst to pull award data by hand.</p>\n        <ol class=\"pipeline-list\">\n          <li><span class=\"step-no\">01</span><div><h3>Opportunity Analyst</h3><p>Normalizes the opportunity, agency, and incumbent you enter, and sets the scope for the research pass.</p></div></li>\n          <li><span class=\"step-no\">02</span><div><h3>Market Researcher</h3><p>Pulls five years of award history for that agency from USAspending, focused by keywords from your opportunity title.</p></div></li>\n          <li><span class=\"step-no\">03</span><div><h3>Black Hat Strategist</h3><p>Ranks the likely bidders by spend and access, then drafts counter-strategies — reasoned by a live model call when one is configured, or deterministic capture-strategy templates otherwise.</p></div></li>\n          <li><span class=\"step-no\">04</span><div><h3>Evidence Reviewer</h3><p>Checks every connector's status, counts the evidence actually gathered, and keeps sourced facts separate from labeled inference.</p></div></li>\n        </ol>\n      </section>\n\n      <section class=\"block reveal\" id=\"preview\">\n        <h2>See the brief before you run it</h2>\n        <p class=\"block-sub\">A real excerpt of the cockpit's competitive-landscape card — same components, same tokens, same rules. Run a live review in the cockpit for your own opportunity.</p>\n        <div class=\"preview-outer\">\n          <div class=\"preview-frame\" id=\"previewFrame\">\n            <div class=\"preview-chrome\"><i></i><i></i><i></i><span>/app — competitive landscape</span></div>\n            <div class=\"preview-body\">\n              <div class=\"mock-row\"><div class=\"mock-rank\">01</div><div class=\"mock-name\">Accenture Federal Services<span>Aggressive posture · broad agency access</span></div><div class=\"mock-bar\"><i style=\"width:85%\"></i></div><span class=\"mock-badge high\">High threat</span></div>\n              <div class=\"mock-row\"><div class=\"mock-rank\">02</div><div class=\"mock-name\">HII Mission Technologies<span>Selective pursuit pattern</span></div><div class=\"mock-bar\"><i style=\"width:77%\"></i></div><span class=\"mock-badge med\">Medium</span></div>\n              <div class=\"mock-row\"><div class=\"mock-rank\">03</div><div class=\"mock-name\">Tunnell Consulting<span>Domain specialist · lower spend concentration</span></div><div class=\"mock-bar\"><i style=\"width:66%\"></i></div><span class=\"mock-badge med\">Medium</span></div>\n            </div>\n          </div>\n        </div>\n      </section>\n\n      <section class=\"block reveal\" id=\"sources\">\n        <h2>What it draws on</h2>\n        <p class=\"block-sub\">Every source is queried server-side, with a bounded timeout, and reported honestly when it's unavailable — nothing is silently swapped for demo data mid-run.</p>\n        <div class=\"sources\">\n          <div class=\"source-card\"><div class=\"name\">USAspending</div><span class=\"tag\">Live · no key needed</span><p>Five-year award and recipient history for the selected agency.</p></div>\n          <div class=\"source-card\"><div class=\"name\">SAM.gov</div><span class=\"tag optional\">Optional</span><p>Open opportunity enrichment, when a SAM.gov API key is configured.</p></div>\n          <div class=\"source-card\"><div class=\"name\">GDELT news</div><span class=\"tag optional\">Best-effort</span><p>Recent news coverage of the top-ranked competitor. May rate-limit.</p></div>\n          <div class=\"source-card\"><div class=\"name\">Model reasoning</div><span class=\"tag optional\">Optional</span><p>OpenAI-backed strategist reasoning over the gathered evidence, when an API key is configured. Falls back to deterministic templates otherwise.</p></div>\n        </div>\n      </section>\n    </div>\n  </main>\n  <footer>\n    <div class=\"foot-inner\">\n      <div class=\"brand-name\">BlackHat Capture Intelligence</div>\n      <nav><a href=\"/app\">Cockpit</a><a href=\"#how-it-works\">Method</a></nav>\n    </div>\n  </footer>\n  <script>\n    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;\n\n    // ---- Radar hero graphic ----\n    (function () {\n      const canvas = document.getElementById('radar');\n      if (!canvas || !canvas.getContext) return;\n      const ctx = canvas.getContext('2d');\n      const DPR = Math.min(window.devicePixelRatio || 1, 2);\n      const blips = [\n        { angle: 35, radius: 0.85 }, { angle: 110, radius: 0.55 }, { angle: 170, radius: 0.72 },\n        { angle: 235, radius: 0.4 }, { angle: 300, radius: 0.9 }, { angle: 340, radius: 0.62 },\n      ];\n      let sweep = reduceMotion ? 50 : 0;\n\n      function resize() {\n        const size = canvas.clientWidth;\n        canvas.width = size * DPR;\n        canvas.height = size * DPR;\n        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);\n      }\n\n      function draw() {\n        const size = canvas.clientWidth;\n        const cx = size / 2, cy = size / 2, R = size / 2 - 6;\n        ctx.clearRect(0, 0, size, size);\n\n        ctx.strokeStyle = 'rgba(255,255,255,0.08)';\n        ctx.lineWidth = 1;\n        for (let i = 1; i <= 4; i++) { ctx.beginPath(); ctx.arc(cx, cy, (R / 4) * i, 0, Math.PI * 2); ctx.stroke(); }\n        ctx.beginPath();\n        ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy);\n        ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R);\n        ctx.stroke();\n\n        const trail = 46;\n        for (let i = 0; i < trail; i++) {\n          const a = sweep - i;\n          const alpha = (1 - i / trail) * 0.22;\n          const rad = (a * Math.PI) / 180;\n          ctx.strokeStyle = `rgba(226,99,44,${alpha})`;\n          ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + R * Math.cos(rad), cy + R * Math.sin(rad)); ctx.stroke();\n        }\n        ctx.strokeStyle = '#e2632c';\n        ctx.lineWidth = 1.5;\n        const rad0 = (sweep * Math.PI) / 180;\n        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + R * Math.cos(rad0), cy + R * Math.sin(rad0)); ctx.stroke();\n\n        blips.forEach((b) => {\n          const rad = (b.angle * Math.PI) / 180;\n          const bx = cx + R * b.radius * Math.cos(rad);\n          const by = cy + R * b.radius * Math.sin(rad);\n          const diff = ((sweep - b.angle) % 360 + 360) % 360;\n          const lit = diff < 34;\n          ctx.beginPath();\n          ctx.fillStyle = lit ? 'rgba(226,99,44,0.95)' : 'rgba(226,99,44,0.35)';\n          ctx.arc(bx, by, lit ? 4.5 : 3, 0, Math.PI * 2);\n          ctx.fill();\n          if (lit) {\n            ctx.beginPath();\n            ctx.strokeStyle = `rgba(226,99,44,${(1 - diff / 34) * 0.55})`;\n            ctx.arc(bx, by, 5 + (diff / 34) * 12, 0, Math.PI * 2);\n            ctx.stroke();\n          }\n        });\n      }\n\n      resize();\n      window.addEventListener('resize', resize);\n\n      let rafId = null;\n      function loop() { draw(); sweep = (sweep + 0.55) % 360; rafId = requestAnimationFrame(loop); }\n      function start() { if (!rafId) loop(); }\n      function stop() { if (rafId) { cancelAnimationFrame(rafId); rafId = null; } }\n\n      const toggle = document.getElementById('radarToggle');\n      if (reduceMotion) {\n        draw();\n        if (toggle) { toggle.textContent = 'Resume animation'; toggle.setAttribute('aria-pressed', 'true'); }\n      } else {\n        start();\n      }\n      if (toggle) {\n        toggle.addEventListener('click', () => {\n          const isRunning = Boolean(rafId);\n          if (isRunning) { stop(); toggle.textContent = 'Resume animation'; toggle.setAttribute('aria-pressed', 'true'); }\n          else { start(); toggle.textContent = 'Pause animation'; toggle.setAttribute('aria-pressed', 'false'); }\n        });\n      }\n    })();\n\n    // ---- Animated stat counters ----\n    document.querySelectorAll('[data-count]').forEach((el) => {\n      const target = Number(el.dataset.count);\n      if (reduceMotion) { el.textContent = target; return; }\n      const io = new IntersectionObserver((entries) => {\n        entries.forEach((entry) => {\n          if (!entry.isIntersecting) return;\n          io.unobserve(el);\n          const duration = 900, start = performance.now();\n          function step(now) {\n            const p = Math.min((now - start) / duration, 1);\n            el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));\n            if (p < 1) requestAnimationFrame(step);\n          }\n          requestAnimationFrame(step);\n        });\n      }, { threshold: 0.4 });\n      io.observe(el);\n    });\n\n    // ---- Scroll reveal ----\n    const revealEls = document.querySelectorAll('.reveal');\n    if (reduceMotion) { revealEls.forEach((el) => el.classList.add('is-visible')); }\n    else {\n      const io = new IntersectionObserver((entries) => {\n        entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); } });\n      }, { threshold: 0.12 });\n      revealEls.forEach((el) => io.observe(el));\n    }\n\n    // ---- Product preview tilt ----\n    const previewFrame = document.getElementById('previewFrame');\n    if (previewFrame && !reduceMotion && matchMedia('(hover: hover)').matches) {\n      previewFrame.addEventListener('mousemove', (e) => {\n        const r = previewFrame.getBoundingClientRect();\n        const px = (e.clientX - r.left) / r.width - 0.5;\n        const py = (e.clientY - r.top) / r.height - 0.5;\n        previewFrame.style.transform = `rotateX(${(-py * 4).toFixed(2)}deg) rotateY(${(px * 6).toFixed(2)}deg)`;\n      });\n      previewFrame.addEventListener('mouseleave', () => { previewFrame.style.transform = ''; });\n    }\n  </script>\n</body>\n</html>\n";

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
