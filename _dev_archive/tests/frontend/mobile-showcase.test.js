const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..', '..', '..');
const CSS = fs.readFileSync(path.join(ROOT, 'styles', 'mobilecss.css'), 'utf8');
const HTML = fs.readFileSync(path.join(ROOT, '移动端.html'), 'utf8');
const JS = fs.readFileSync(path.join(ROOT, 'mobile.js'), 'utf8');

test('desktop showcase keeps a polished responsive phone frame', () => {
  assert.match(HTML, /mobilecss\.css\?v=20260719-report-photos/);
  assert.match(CSS, /body\s*\{[^}]*radial-gradient[\s\S]*?linear-gradient/i);
  assert.match(CSS, /\.phone\s*\{[^}]*width\s*:\s*clamp\(390px,[^;]+420px\)/i);
  assert.match(CSS, /\.phone\s*\{[^}]*height\s*:\s*min\(900px,\s*calc\(100vh\s*-\s*32px\)\)/i);
  assert.match(CSS, /\.phone::before\s*\{/i);
});

test('primary mobile controls and navigation map are presentation sized', () => {
  assert.match(CSS, /\.route-search-row input\s*\{[^}]*min-height\s*:\s*44px/i);
  assert.match(CSS, /\.route-search-row button\s*\{[^}]*min-height\s*:\s*44px/i);
  assert.match(CSS, /\.nav-map\s*\{[^}]*height\s*:\s*clamp\(330px,\s*46vh,\s*430px\)/i);
  assert.match(CSS, /\.nav-start-btn\s*\{[^}]*min-height\s*:\s*48px/i);
  assert.match(CSS, /\.tab-item\s*\{[^}]*min-height\s*:\s*48px/i);
});

test('every page header clears the desktop phone speaker', () => {
  assert.match(CSS, /\.home-header\s*\{[^}]*padding\s*:\s*34px 18px 20px/i);
  assert.match(CSS, /\.nav-header\s*\{[^}]*padding\s*:\s*34px 18px 12px/i);
  assert.match(CSS, /\.bus-header\s*\{[^}]*padding\s*:\s*34px 18px 14px/i);
  assert.match(CSS, /\.report-header\s*\{[^}]*padding\s*:\s*34px 18px 16px/i);
  assert.match(CSS, /\.me-header\s*\{[^}]*padding\s*:\s*34px 18px 18px/i);
});

test('narrow viewport protection remains available', () => {
  assert.match(CSS, /@media\s*\(max-width:\s*480px\)[\s\S]*?\.phone\s*\{[^}]*width\s*:\s*100%/i);
  assert.match(CSS, /@media\s*\(max-width:\s*480px\)[\s\S]*?height\s*:\s*100dvh/i);
  assert.match(CSS, /@media\s*\(max-width:\s*480px\)[\s\S]*?\.home-header,\s*\.nav-header,\s*\.bus-header,\s*\.report-header,\s*\.me-header\s*\{[^}]*padding-top\s*:\s*16px/i);
});

test('location failure explicitly falls back to the Futian demo origin', () => {
  assert.match(JS, /var FUTIAN_DEMO_ORIGIN\s*=\s*\{[^}]*name\s*:\s*'福田中心演示点（购物公园）'[^}]*lon\s*:\s*114\.0550[^}]*lat\s*:\s*22\.5350/s);
  assert.match(JS, /function applyFutianDemoOrigin\(button, reason\)/);
  assert.match(JS, /已使用购物公园演示点/);
  assert.match(JS, /var isCurrent\s*=\s*name === '当前位置' \|\| name === '我的位置' \|\| name === FUTIAN_DEMO_ORIGIN\.name/);
  const start = JS.indexOf('function useCurrentLocationAsOrigin');
  const end = JS.indexOf('function startFavRoute', start);
  const source = JS.slice(start, end);
  assert.match(source, /if\s*\(!navigator\.geolocation\)\s*return applyFutianDemoOrigin\(button/);
  assert.match(source, /applyFutianDemoOrigin\(button/);
});
