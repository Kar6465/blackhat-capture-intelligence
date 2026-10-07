import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

// Exercise the shipped inline client helpers without adding a browser dependency.
const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
function client() {
  const elements = new Map();
  const element = id => {
    if (!elements.has(id)) elements.set(id, { innerHTML: '', textContent: '', value: '', dataset: {}, disabled: false, style: { setProperty() {} }, classList: { add() {}, remove() {}, toggle() {} }, addEventListener() {}, querySelectorAll() { return []; } });
    return elements.get(id);
  };
  const context = vm.createContext({ URL, document: { getElementById: element, querySelectorAll: () => [], querySelector: () => null }, localStorage: { getItem: () => null, setItem() {} }, setTimeout() {} });
  vm.runInContext(script, context);
  return { context, element, run: code => vm.runInContext(code, context) };
}

test('public evidence links reject script schemes and escape labels', () => {
  const c = client();
  assert.equal(c.run("safeURL('javascript:alert(1)')"), '');
  assert.equal(c.run("safeURL('data:text/html,hello')"), '');
  assert.match(c.run("sourceLink('https://example.com', '<script>')"), /&lt;script&gt;/);
  assert.doesNotMatch(c.run("sourceLink('javascript:alert(1)')"), /href=/);
});

test('roster filtering and sorting retain original rank without changing report order', () => {
  const c = client();
  c.run("globalThis.report = { competitors: [{name:'Zulu',uei:'123',amount:10,score:90,threat:'High threat'}, {name:'Alpha',uei:'456',amount:50,score:60,threat:'Watch'}] }");
  assert.equal(c.run("filteredCompetitors(report, '', '', 'name')[0].rank"), 1);
  assert.equal(c.run("filteredCompetitors(report, ' 456 ', 'Watch', 'rank').length"), 1);
  assert.equal(c.run("filteredCompetitors(report, 'missing', '', 'rank').length"), 0);
  assert.equal(c.run("report.competitors[0].name"), 'Zulu');
});

test('legacy workboard statuses survive migration and malformed storage is safe', () => {
  const c = client();
  assert.equal(c.run("workRecord('Drafting').status"), 'Drafting');
  assert.equal(c.run("workRecord('Ready').notes"), '');
  c.run("localStorage.getItem = () => '42'");
  assert.equal(c.run('loadHistory().length'), 0);
  assert.equal(c.run('Object.keys(loadWorkboard()).length'), 0);
  c.run("localStorage.getItem = () => '{broken'");
  assert.equal(c.run('loadHistory().length'), 0);
});

test('new review clears prior report, comparison, exports and metrics', () => {
  const c = client();
  c.run("latestReport = {meta: {opportunity:'Previous'}}; compared.add(1); resetReport()");
  assert.equal(c.run('latestReport'), null);
  assert.equal(c.run('compared.size'), 0);
  assert.equal(c.element('exportBrief').disabled, true);
  assert.equal(c.element('exportMarkdown').disabled, true);
  assert.equal(c.element('winProbability').textContent, '—');
});

test('completed reports expose records and inference provenance, and both exports remain grounded', () => {
  const c = client();
  c.run(`globalThis.report = {
    meta: {opportunity:'Test fixture only',agency:'Test agency',generatedAt:'2026-10-06T12:00:00Z',mode:'Public data',strategistMode:'template',reviewerMode:'model',focusedSearch:false,keywords:['services']},
    decision: {recommendation:'Proceed',winProbability:60,bidderCount:1,topThreats:1,evidenceStrength:70,evidenceCount:1},
    competitors:[{name:'Test company',uei:'TEST',amount:100,amountLabel:'$100',score:90,threat:'High threat',evidence:{fact:'Test public fact',source:'USAspending',url:'https://example.com'}}],
    strategies:[{title:'Test strategy',text:'Verify the assumption.',confidence:60,basis:'Capture inference'}],
    summary:'Test summary',limitations:['Bid intent unconfirmed'],
    evidence:{sources:[{name:'USAspending',status:'connected',items:1,url:'https://example.com'},{name:'SAM.gov',status:'rate limited',items:0,url:'https://sam.gov'}],sam:[],news:[],sec:[]}
  }; renderReport(report); renderEvidence();`);
  assert.match(c.element('evidenceWrap').innerHTML, /rate limited/);
  assert.match(c.element('evidenceWrap').innerHTML, /Test public fact/);
  assert.match(c.element('evidenceWrap').innerHTML, /Broader agency search/);
  assert.equal(c.element('exportBrief').disabled, false);
  assert.equal(c.element('summaryFlag').textContent, 'Model-generated');
  const markdown = c.run('buildMarkdownBrief(report)');
  assert.match(markdown, /Inference; 60%/);
  assert.match(markdown, /SAM.gov: rate limited/);
  assert.match(markdown, /Bid intent unconfirmed/);
});

test('obligations chart and monograms are bound to report data and escape names', () => {
  const c = client();
  assert.equal(c.run("initials('Booz Allen Hamilton Inc.')"), 'BA');
  assert.equal(c.run("initials('')"), '?');
  const html = c.run("renderObligations({competitors:[{name:'<b>Big</b>',amount:100,amountLabel:'$100'},{name:'Small',amount:25,amountLabel:'$25'},{name:'None',amount:0,amountLabel:'$0'}]})");
  assert.match(html, /&lt;b&gt;Big/);
  assert.match(html, /width:100%/);
  assert.match(html, /width:25%/);
  assert.match(html, /width:0%/);
});

test('sample pursuit only fills fields and never starts a run', () => {
  const html2 = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
  assert.match(html2, /id="fillExample"/);
  assert.doesNotMatch(html2.match(/getElementById\('fillExample'\)[\s\S]*?\}\);/)[0], /fetch\(|\.click\(\)/);
});
