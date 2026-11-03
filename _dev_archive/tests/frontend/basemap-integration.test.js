'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..', '..', '..');
const WEB_SOURCE = fs.readFileSync(path.join(ROOT, 'web.js'), 'utf8');
const WEB_HTML = fs.readFileSync(path.join(ROOT, 'Web管理端.html'), 'utf8');
const BACKEND_MAIN = fs.readFileSync(path.join(ROOT, 'backend', 'main.py'), 'utf8');

function getFunctionSource(name, nextName) {
  const start = WEB_SOURCE.indexOf(`function ${name}`);
  const end = WEB_SOURCE.indexOf(`function ${nextName}`, start);
  assert.notEqual(start, -1, `${name} must exist`);
  assert.notEqual(end, -1, `${name} boundary must exist`);
  return WEB_SOURCE.slice(start, end);
}

test('ArcGIS module loader exposes VectorTileLayer', () => {
  assert.match(WEB_SOURCE, /'esri\/layers\/VectorTileLayer'/);
  assert.match(WEB_SOURCE, /VectorTileLayer:\s*VectorTileLayer/);
});

test('GeoScene deep-sea vector basemap is created before WebTile fallbacks', () => {
  const basemap = getFunctionSource('createGeoSceneBasemap', 'roadLineSymbol');
  const vectorLayer = basemap.indexOf('new modules.VectorTileLayer');
  const webTileLayer = basemap.indexOf('new modules.WebTileLayer');

  assert.notEqual(vectorLayer, -1, 'GeoScene vector basemap layer must exist');
  assert.notEqual(webTileLayer, -1, 'WebTile fallback layer must remain available');
  assert.ok(vectorLayer < webTileLayer, 'GeoScene vector basemap must be the first choice');
  assert.match(basemap, /GeoScene 深海蓝底图/);
});

test('GeoScene vector availability is probed before Tianditu', () => {
  const geoProbe = WEB_SOURCE.indexOf('function probeGeoSceneVectorBasemap');
  const tiandituProbe = WEB_SOURCE.indexOf('function probeTiandituBasemap');
  const startup = getFunctionSource('initGeoSceneMap', 'initTiles3DMap');

  assert.ok(geoProbe >= 0 && geoProbe < tiandituProbe, 'GeoScene probe must be defined before Tianditu');
  assert.match(startup, /probeGeoSceneVectorBasemap\(cfg\)[\s\S]*?probeTiandituBasemap\(cfg\)/);
});

test('GeoScene integrates the water policy as a non-interactive ground layer', () => {
  const primaryHitSetup = WEB_SOURCE.slice(
    WEB_SOURCE.indexOf("view.on('click', function(event)"),
    WEB_SOURCE.indexOf('view.hitTest(event, { include: hitLayers })')
  );

  assert.match(WEB_HTML, /water-visuals\.js\?v=20260721-web-controls/);
  assert.match(WEB_SOURCE, /BlindWaterVisuals\.createWaterLayer/);
  assert.match(WEB_SOURCE, /map\.add\(waterLayer, 0\)/);
  assert.match(WEB_SOURCE, /map\.reorder\(window\._geoSceneWaterLayer, 0\)/);
  assert.doesNotMatch(primaryHitSetup, /_geoSceneWaterLayer/);
  assert.match(WEB_HTML, /data-map-layer="water"/);
  assert.match(BACKEND_MAIN, /["']water-visuals\.js["']/);
});

test('water lifecycle is isolated from the SceneView and cleaned on disposal', () => {
  const dispose = getFunctionSource('disposeGeoSceneView', 'activateMapFallback');
  const startup = getFunctionSource('initGeoSceneMap', 'syncTiles3DEventMarkers');
  const waterSetupStart = startup.indexOf('var waterLayer');
  const waterSetupEnd = startup.indexOf('var eventLayer', waterSetupStart);
  const waterSetup = startup.slice(waterSetupStart, waterSetupEnd);

  assert.match(dispose, /window\._geoSceneWaterLayerReady\s*=\s*false/);
  assert.match(dispose, /window\._geoSceneWaterLayer\s*=\s*null/);
  assert.match(startup, /configuredLayers\.waterLayerUrl/);
  assert.match(waterSetup, /waterLayer\.when\(\)/);
  assert.match(waterSetup, /window\._geoSceneWaterLayerReady\s*=\s*true/);
  assert.match(waterSetup, /currentStatus\.textContent/);
  assert.match(waterSetup, /map\.remove\(waterLayer\)/);
  assert.doesNotMatch(waterSetup, /activateMapFallback|disposeGeoSceneView|throw\s+/);
  assert.match(startup, /initializeMapLayerVisibility\(\)/);
  assert.match(startup, /syncMapLayerControlsFromVisibility\(\)/);
});

test('water creation preserves a visibility choice made before SceneView startup', () => {
  const startup = getFunctionSource('initGeoSceneMap', 'syncTiles3DEventMarkers');
  const waterSetup = startup.slice(
    startup.indexOf('var waterLayer'),
    startup.indexOf('var eventLayer', startup.indexOf('var waterLayer'))
  );

  assert.match(
    waterSetup,
    /typeof window\._mapLayerVisibility\.water === 'boolean'[\s\S]*?waterLayer\.visible = window\._mapLayerVisibility\.water[\s\S]*?map\.add\(waterLayer, 0\)/,
    'a recorded water visibility must be applied before the layer enters the map'
  );
});

test('a synchronous water readiness error removes an already-added layer', () => {
  const startup = getFunctionSource('initGeoSceneMap', 'syncTiles3DEventMarkers');
  const waterSetup = startup.slice(
    startup.indexOf('var waterLayer'),
    startup.indexOf('var eventLayer', startup.indexOf('var waterLayer'))
  );
  const synchronousCatch = waterSetup.slice(waterSetup.lastIndexOf('} catch (error) {'));

  assert.match(
    synchronousCatch,
    /if \(waterLayer && map\.remove\) map\.remove\(waterLayer\)/,
    'the synchronous catch must remove a water layer that was already added'
  );
});
