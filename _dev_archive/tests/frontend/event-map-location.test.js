const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..', '..', '..');
const WEB_SOURCE = fs.readFileSync(path.join(ROOT, 'web.js'), 'utf8');
const WEB_HTML = fs.readFileSync(path.join(ROOT, 'Web管理端.html'), 'utf8');

function functionSource(name, nextName) {
  const start = WEB_SOURCE.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `${name} must exist`);
  const end = WEB_SOURCE.indexOf(`function ${nextName}(`, start);
  assert.notEqual(end, -1, `${name} boundary must exist`);
  return WEB_SOURCE.slice(start, end);
}

test('event detail map button runs the real locate workflow', () => {
  const renderer = functionSource('renderEventDetailFromJSON', 'initAllFromJSON');
  assert.match(renderer, /locateEventOnMap\(ed\.id\)/);
  assert.match(renderer, /eventMapLocateButton/);
  assert.match(renderer, /addEventListener\('click'/);
  assert.doesNotMatch(renderer, /onclick="locateEventOnMap\(ed\.id\)"/);
  assert.doesNotMatch(renderer, /toast\([^)]*定位到地图/);
});

test('locating an event returns to the dashboard, moves the map and opens its popup', () => {
  const locate = functionSource('locateEventOnMap', 'renderEventDetailFromJSON');
  assert.match(locate, /getMapEventById\(eventId\)/);
  assert.match(locate, /goPage\('dashboard'/);
  assert.match(locate, /_eventLayerVisibility\[getEventLayerKey\(evt\)\]\s*=\s*true/);
  assert.match(locate, /focusGeoSceneEvent\(evt\)/);
  assert.match(locate, /focusCesiumEvent\(evt\)/);
  assert.match(locate, /revealLocatedMapEvent\(evt\)/);

  const reveal = functionSource('revealLocatedMapEvent', 'locateEventOnMap');
  assert.match(reveal, /getEventMarkerScreenPoint\(evt\.id\)/);
  assert.match(reveal, /showMapEventPopup\(evt/);
});

test('located event popup can anchor to a co-located cluster marker', () => {
  const markerPoint = functionSource('getEventMarkerScreenPoint', 'revealLocatedMapEvent');
  assert.match(markerPoint, /data-event-ids/);
  assert.match(markerPoint, /split\('\|'\)/);
  assert.match(markerPoint, /dataset\.screenX/);
  assert.match(markerPoint, /dataset\.screenY/);
});

test('GeoScene focus exposes its animation promise to the locate workflow', () => {
  const focus = functionSource('focusGeoSceneEvent', 'initGeoSceneMap');
  assert.match(focus, /return window\._geoSceneView\.goTo\(/);
});

test('event location fix uses a fresh browser cache version', () => {
  const version = '20260721-web-controls';
  assert.match(WEB_SOURCE, new RegExp(version));
  assert.match(WEB_HTML, new RegExp(`webcss\\.css\\?v=${version}`));
  assert.match(WEB_HTML, new RegExp(`road-visuals\\.js\\?v=${version}`));
  assert.match(WEB_HTML, new RegExp(`water-visuals\\.js\\?v=${version}`));
  assert.match(WEB_HTML, new RegExp(`web\\.js\\?v=${version}`));
});
