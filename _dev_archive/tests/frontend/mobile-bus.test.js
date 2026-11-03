const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..', '..', '..');
const HTML = fs.readFileSync(path.join(ROOT, '移动端.html'), 'utf8');
const JS = fs.readFileSync(path.join(ROOT, 'mobile.js'), 'utf8');
const CSS = fs.readFileSync(path.join(ROOT, 'styles', 'mobilecss.css'), 'utf8');

function functionSource(name, nextName) {
  const start = JS.indexOf(`function ${name}`);
  const end = nextName ? JS.indexOf(`function ${nextName}`, start + 1) : JS.length;
  assert.notEqual(start, -1, `${name} should exist`);
  return JS.slice(start, end === -1 ? JS.length : end);
}

test('bus page presents genuine nearby-stop transfer instead of fake realtime lines', () => {
  const busStart = HTML.indexOf('id="mPage-bus"');
  const busEnd = HTML.indexOf('<!-- ===== Page: Report', busStart);
  const busPage = HTML.slice(busStart, busEnd);

  assert.match(busPage, /无障碍公交接驳/);
  assert.match(busPage, /真实站点数据/);
  assert.match(busPage, /id="busStationList"/);
  assert.match(busPage, /id="busStopDetail"/);
  assert.doesNotMatch(busPage, /高德实时公交API|深圳北站|预计 5 分钟到站/);
});

test('bus page fetches nearest stops with location coordinates', () => {
  const source = functionSource('requestNearbyBusStops', 'refreshNearbyBusStops');
  assert.match(source, /\/api\/mobile\/bus\/realtime\?lon=/);
  assert.match(source, /encodeURIComponent\(coords\.lon\)/);
  assert.match(source, /encodeURIComponent\(coords\.lat\)/);
  assert.match(source, /limit=5/);
  assert.match(source, /MOBILE_DATA\s*=\s*MOBILE_DATA\s*\|\|\s*\{\}/);
});

test('selected bus stop hands exact coordinates to the existing route planner', () => {
  const source = functionSource('startBusStopNavigation', 'playBusArrivalDemo');
  assert.match(source, /SELECTED_BUS_STOP/);
  assert.match(source, /startFavRoute\(stop\.name,\s*\{\s*lon:\s*stop\.lon,\s*lat:\s*stop\.lat\s*\}\)/s);
  const routeSource = functionSource('startFavRoute', 'getSavedPreference');
  assert.match(routeSource, /destination_lon:\s*destinationCoords\s*\?\s*destinationCoords\.lon\s*:\s*null/);
  assert.match(routeSource, /destination_lat:\s*destinationCoords\s*\?\s*destinationCoords\.lat\s*:\s*null/);
});

test('arrival reminder is explicitly simulated and triggers accessible feedback', () => {
  assert.match(HTML, /模拟提醒/);
  const source = functionSource('playBusArrivalDemo', 'formatBusDistance');
  assert.match(source, /speakNavigation\(/);
  assert.match(source, /navigator\.vibrate/);
  assert.match(source, /模拟提醒/);
});

test('station cards have selected and keyboard-focus presentation states', () => {
  assert.match(CSS, /\.bus-card\.selected\s*\{/);
  assert.match(CSS, /\.bus-card:focus-visible\s*\{/);
  assert.match(CSS, /\.bus-action-btn\s*\{[^}]*min-height\s*:\s*44px/s);
});

test('new bus detail surfaces preserve the existing high-contrast mode', () => {
  assert.match(CSS, /\.phone-inner\.high-contrast \.bus-stop-detail[^}]*background\s*:\s*#111/s);
  assert.match(CSS, /\.phone-inner\.high-contrast \.bus-alert[^}]*background\s*:\s*#111/s);
});
