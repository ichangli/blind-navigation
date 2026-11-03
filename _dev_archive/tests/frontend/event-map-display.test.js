const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..', '..', '..');
const WEB_SOURCE = fs.readFileSync(path.join(ROOT, 'web.js'), 'utf8');
const WEB_CSS = fs.readFileSync(path.join(ROOT, 'styles', 'webcss.css'), 'utf8');
const WEB_HTML = fs.readFileSync(path.join(ROOT, 'Web管理端.html'), 'utf8');

function functionSource(name, nextName) {
  const start = WEB_SOURCE.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `${name} must exist`);
  const end = nextName ? WEB_SOURCE.indexOf(`function ${nextName}(`, start) : WEB_SOURCE.indexOf('\nfunction ', start + 10);
  assert.notEqual(end, -1, `${name} boundary must exist`);
  return WEB_SOURCE.slice(start, end);
}

test('the DOM overlay is the only visible GeoScene event renderer', () => {
  const layer = functionSource('createGeoSceneEventLayer', 'getMapFacilityFeatures');
  assert.match(layer, /visible\s*:\s*false/);
  assert.doesNotMatch(WEB_SOURCE, /_geoSceneEventLayer\.visible\s*=/);
  assert.doesNotMatch(WEB_SOURCE, /eventLayer\.visible\s*=\s*\[/);
  assert.doesNotMatch(WEB_CSS, /translate\(-50%,\s*-100%\)/);
  assert.match(WEB_CSS, /\.scene-event-marker\s*\{[\s\S]*?translate\(-50%,\s*-50%\)/);
});

test('co-located events render one selectable cluster instead of covering each other', () => {
  const renderer = functionSource('renderGeoSceneDomEventMarkers', 'scheduleGeoSceneDomEventMarkerRender');
  const clusterPopup = functionSource('showMapEventClusterPopup', 'renderGeoSceneDomEventMarkers');

  assert.match(WEB_SOURCE, /function groupGeoSceneEventsByCoordinate\(/);
  assert.match(renderer, /groupGeoSceneEventsByCoordinate\(/);
  assert.match(renderer, /showMapEventClusterPopup\(/);
  assert.match(renderer, /data-event-count/);
  assert.match(clusterPopup, /cluster\.events/);
  assert.match(clusterPopup, /showMapEventPopup\(/);
  assert.match(WEB_CSS, /\.scene-event-marker\.cluster\s*\{/);
  assert.match(WEB_CSS, /\.event-cluster-popup\s*\{/);
});

test('event-map correction assets use a fresh cache version', () => {
  const version = '20260721-web-controls';
  assert.match(WEB_SOURCE, new RegExp(version));
  assert.match(WEB_HTML, new RegExp(`webcss\\.css\\?v=${version}`));
  assert.match(WEB_HTML, new RegExp(`web\\.js\\?v=${version}`));
});
