const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..', '..', '..');
const WEB_SOURCE = fs.readFileSync(path.join(ROOT, 'web.js'), 'utf8');
const WEB_CSS = fs.readFileSync(path.join(ROOT, 'styles', 'webcss.css'), 'utf8');
const WEB_HTML = fs.readFileSync(path.join(ROOT, 'Web管理端.html'), 'utf8');

test('web map exposes a complete navigation test control surface', () => {
  assert.match(WEB_HTML, /id="webNavigationToggle"[^>]*onclick="startWebNavigationTest\(\)"/);
  assert.match(WEB_HTML, /id="webNavigationPanel"/);
  assert.match(WEB_HTML, /id="webNavigationHint"/);
  assert.match(WEB_HTML, /id="webNavigationSummary"/);
  assert.match(WEB_HTML, /id="webNavigationError"/);
  assert.match(WEB_HTML, /onclick="swapWebNavigationPoints\(\)"/);
  assert.match(WEB_HTML, /onclick="replayWebNavigationRoute\(\)"/);
  assert.match(WEB_HTML, /onclick="resetWebNavigationPoints\(\)"/);
  assert.match(WEB_HTML, /onclick="clearWebNavigationTest\(\)"/);
});

test('navigation panel matches the deep-sea map and remains usable on mobile', () => {
  assert.match(WEB_CSS, /\.web-navigation-toggle\s*\{[^}]*position\s*:\s*absolute/i);
  assert.match(WEB_CSS, /\.web-navigation-toggle\s*\{[^}]*left\s*:\s*16px[^}]*right\s*:\s*auto/i);
  assert.match(WEB_CSS, /\.web-navigation-panel\s*\{[^}]*position\s*:\s*absolute/i);
  assert.match(WEB_CSS, /\.web-navigation-panel\s*\{[^}]*left\s*:\s*16px[^}]*right\s*:\s*auto/i);
  assert.match(WEB_CSS, /\.web-navigation-panel\s*\{[^}]*z-index\s*:\s*(?:2[5-9]|[3-9]\d)/i);
  assert.match(WEB_CSS, /\.web-navigation-route-sample[^}]*background\s*:\s*#ffe45c/i);
  assert.match(WEB_CSS, /@media\s*\(max-width:\s*768px\)[\s\S]*?\.web-navigation-panel/i);
  assert.match(WEB_CSS, /@media\s*\(max-width:\s*768px\)[\s\S]*?\.web-navigation-toggle\s*\{[^}]*left\s*:\s*10px[^}]*right\s*:\s*auto/i);
});

test('navigation runtime creates an isolated layer and intercepts selection clicks', () => {
  assert.match(WEB_SOURCE, /_geoSceneNavigationCasingLayer\s*=\s*new modules\.GraphicsLayer\(/);
  assert.match(WEB_SOURCE, /title\s*:\s*'导航路线描边'/);
  assert.match(WEB_SOURCE, /导航路线描边'[\s\S]*?offset\s*:\s*1\.5/);
  assert.match(WEB_SOURCE, /_geoSceneNavigationLayer\s*=\s*new modules\.GraphicsLayer\(/);
  assert.match(WEB_SOURCE, /title\s*:\s*'导航测试路线'/);
  assert.match(WEB_SOURCE, /导航测试路线'[\s\S]*?offset\s*:\s*3\.5/);
  assert.match(WEB_SOURCE, /function handleWebNavigationMapClick\(view, event\)/);
  assert.match(WEB_SOURCE, /if\s*\(handleWebNavigationMapClick\(view, event\)\)\s*return;/);
});

test('navigation route animates a dark casing and highlighted yellow core', () => {
  const symbolsStart = WEB_SOURCE.indexOf('function createWebNavigationRouteGraphics');
  const symbolsEnd = WEB_SOURCE.indexOf('function webNavigationSegmentLength', symbolsStart);
  const symbols = WEB_SOURCE.slice(symbolsStart, symbolsEnd);
  assert.match(WEB_SOURCE, /function animateWebNavigationRoute\(route, distanceMeters\)/);
  assert.match(WEB_SOURCE, /requestAnimationFrame\(/);
  assert.match(WEB_SOURCE, /Math\.max\(2000,\s*Math\.min\(4000,\s*1800\s*\+\s*distanceMeters\s*\*\s*0\.35\)\)/);
  assert.match(symbols, /type\s*:\s*'simple-line'/);
  assert.doesNotMatch(symbols, /type\s*:\s*'line-3d'/);
  assert.match(symbols, /color\s*:\s*'#071726'/i);
  assert.match(symbols, /color\s*:\s*'#ffe45c'/i);
  assert.match(symbols, /width\s*:\s*9/);
  assert.match(symbols, /width\s*:\s*5/);
  assert.match(symbols, /casingLayer\.add\(casing\)/);
  assert.match(symbols, /layer\.add\(core\)/);
});

test('navigation lifecycle supports replay, swap, reset and complete cleanup', () => {
  assert.match(WEB_SOURCE, /function swapWebNavigationPoints\(\)/);
  assert.match(WEB_SOURCE, /function replayWebNavigationRoute\(\)/);
  assert.match(WEB_SOURCE, /function resetWebNavigationPoints\(\)/);
  assert.match(WEB_SOURCE, /function clearWebNavigationTest\(\)/);
  assert.match(WEB_SOURCE, /cancelAnimationFrame\(/);
  assert.match(WEB_SOURCE, /_geoSceneNavigationLayer\.removeAll\(\)/);
  assert.match(WEB_SOURCE, /_geoSceneNavigationCasingLayer\.removeAll\(\)/);
  assert.match(WEB_SOURCE, /_geoSceneNavigationLayer\s*=\s*null/);
  assert.match(WEB_SOURCE, /_geoSceneNavigationCasingLayer\s*=\s*null/);
});
