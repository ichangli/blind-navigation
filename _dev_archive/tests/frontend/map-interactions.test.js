const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..', '..', '..');
const WEB_SOURCE = fs.readFileSync(path.join(ROOT, 'web.js'), 'utf8');
const WEB_CSS = fs.readFileSync(path.join(ROOT, 'styles', 'webcss.css'), 'utf8');
const WEB_HTML = fs.readFileSync(path.join(ROOT, 'Web管理端.html'), 'utf8');

function getSceneClickHandlerSource() {
  const start = WEB_SOURCE.indexOf("view.on('click', function(event)");
  const end = WEB_SOURCE.indexOf("return view.when().then(function()", start);
  assert.notEqual(start, -1, 'SceneView click handler must exist');
  assert.notEqual(end, -1, 'SceneView click handler boundary must exist');
  return WEB_SOURCE.slice(start, end);
}

test('map surface uses a normal cursor instead of a crosshair', () => {
  assert.doesNotMatch(WEB_CSS, /#sceneViewDiv\s+\.esri-view-surface\s*\{[^}]*cursor\s*:\s*crosshair/i);
  assert.match(WEB_CSS, /--map-interaction-cursor\s*:\s*default/i);
});

test('primary SceneView hitTest excludes remote road map-image layers', () => {
  const handler = getSceneClickHandlerSource();
  const hitTestCall = handler.indexOf('view.hitTest(event, { include: hitLayers })');
  assert.notEqual(hitTestCall, -1, 'primary hitTest must use the fast hit layer list');

  const primarySetup = handler.slice(0, hitTestCall);
  assert.doesNotMatch(
    primarySetup,
    /getGeoSceneRoadLayers\(\)[\s\S]*?hitLayers\.push/,
    'a slow road MapServer must not block event and facility clicks'
  );
  assert.doesNotMatch(
    primarySetup,
    /_geoSceneWaterLayer/,
    'the decorative water layer must not enter the primary hit layer list'
  );
});

test('navigation selection consumes SceneView clicks before every identify workflow', () => {
  const handler = getSceneClickHandlerSource();
  const navigationIntercept = handler.indexOf('if (handleWebNavigationMapClick(view, event)) return;');
  const hitTestCall = handler.indexOf('view.hitTest(event, { include: hitLayers })');

  assert.notEqual(navigationIntercept, -1, 'navigation click interception must exist');
  assert.notEqual(hitTestCall, -1, 'the ordinary identify hitTest must remain available');
  assert.ok(navigationIntercept < hitTestCall, 'navigation point selection must run before identify hit testing');
});

test('event clicks are resolved before the optional road identify fallback', () => {
  const handler = getSceneClickHandlerSource();
  const eventResolution = handler.indexOf("item.graphic.layer === window._geoSceneEventLayer");
  const roadFallback = handler.indexOf('identifyRoadAtMapPoint(view, event)');

  assert.notEqual(eventResolution, -1, 'event hit resolution must exist');
  assert.notEqual(roadFallback, -1, 'road identify fallback must remain available');
  assert.ok(eventResolution < roadFallback, 'event feedback must happen before a road network request');
});

test('map entry defaults to basemap, water, white models and event points only', () => {
  const defaultsStart = WEB_SOURCE.indexOf('var DEFAULT_MAP_LAYER_VISIBILITY');
  const defaultsEnd = WEB_SOURCE.indexOf('var ROAD_ACCESS_STYLES', defaultsStart);
  assert.notEqual(defaultsStart, -1, 'a single default layer policy must exist');
  assert.notEqual(defaultsEnd, -1, 'the default layer policy boundary must exist');
  const defaults = WEB_SOURCE.slice(defaultsStart, defaultsEnd);

  assert.match(defaults, /buildings\s*:\s*true/);
  assert.match(defaults, /water\s*:\s*true/);
  assert.match(defaults, /semantic\s*:\s*false/);
  assert.match(defaults, /roads\s*:\s*false/);
  assert.match(defaults, /boundary\s*:\s*false/);
  Object.keys({ metroStation: 1, metroEntrance: 1, busStop: 1, toilet: 1, park: 1, hospital: 1, rehab: 1 }).forEach((key) => {
    assert.match(defaults, new RegExp(`${key}\\s*:\\s*false`));
  });
  assert.match(defaults, /events\s*:\s*true/);
  assert.doesNotMatch(defaults, /heat\s*:/);

  assert.match(WEB_HTML, /class="leg-row leg-toggle on" data-map-layer="buildings"/);
  assert.match(WEB_HTML, /class="leg-row leg-toggle on" data-map-layer="water"/);
  assert.doesNotMatch(WEB_HTML, /class="leg-row leg-toggle on" data-map-layer="(?:semantic|roads|boundary)"/);
  assert.doesNotMatch(WEB_HTML, /class="leg-row leg-toggle on" onclick="toggleLayer\('heat-spots'/);
});

test('async layer readiness and legend refresh preserve manual visibility choices', () => {
  const legendStart = WEB_SOURCE.indexOf('function renderFacilityLegend');
  const legendEnd = WEB_SOURCE.indexOf('function renderViewTabsFromJSON', legendStart);
  const legend = WEB_SOURCE.slice(legendStart, legendEnd);
  const readyStart = WEB_SOURCE.indexOf('return view.when().then(function()');
  const readyEnd = WEB_SOURCE.indexOf('}).catch(function(err)', readyStart);
  const ready = WEB_SOURCE.slice(readyStart, readyEnd);

  assert.match(legend, /syncMapLayerControlsFromVisibility\(\)/);
  assert.doesNotMatch(legend, /applyMapTheme\(/);
  assert.match(ready, /syncMapLayerControlsFromVisibility\(\)/);
  assert.doesNotMatch(ready, /setMapDataLayerVisibility\(layerKey, true\)/);
});

test('white-model building clicks query attributes before optional road identify', () => {
  const handler = getSceneClickHandlerSource();
  const buildingResolution = handler.indexOf('identifyGeoSceneBuildingAtHit(view, event, buildingHit.graphic)');
  const roadFallback = handler.indexOf('identifyRoadAtMapPoint(view, event)');

  assert.notEqual(buildingResolution, -1, 'white-model click resolution must exist');
  assert.notEqual(roadFallback, -1, 'road identify fallback must remain available');
  assert.ok(buildingResolution < roadFallback, 'building clicks must not be stolen by road identify');
});

test('building identify converts the SceneView point to WGS84 and guards stale responses', () => {
  assert.match(WEB_SOURCE, /'esri\/geometry\/support\/webMercatorUtils'/);
  const start = WEB_SOURCE.indexOf('function identifyGeoSceneBuildingAtHit');
  const end = WEB_SOURCE.indexOf("view.on('click', function(event)", start);
  assert.notEqual(start, -1, 'building identify helper must exist');
  assert.notEqual(end, -1, 'building identify helper boundary must exist');
  const identify = WEB_SOURCE.slice(start, end);

  assert.match(identify, /getWgs84BuildingPoint\(/);
  assert.match(identify, /\/api\/web\/map\/buildings\/identify\?longitude=/);
  assert.match(identify, /_buildingIdentifyRequestId/);
  assert.match(identify, /requestId\s*!==\s*window\._buildingIdentifyRequestId/);
  assert.match(identify, /showBuildingInfoPopup\('loading'/);
  assert.match(identify, /showBuildingInfoPopup\('success'/);
  assert.match(identify, /showBuildingInfoPopup\('unmatched'/);
  assert.match(identify, /showBuildingInfoPopup\('error'/);
});

test('matched white-model buildings render one cyan extruded selection overlay', () => {
  assert.match(WEB_SOURCE, /_geoSceneBuildingSelectionLayer\s*=\s*new modules\.GraphicsLayer\(/);
  assert.match(WEB_SOURCE, /title\s*:\s*'当前选中建筑'/);

  const start = WEB_SOURCE.indexOf('function showGeoSceneBuildingSelectionOverlay');
  const end = WEB_SOURCE.indexOf('function identifyGeoSceneBuildingAtHit', start);
  assert.notEqual(start, -1, 'building selection overlay renderer must exist');
  assert.notEqual(end, -1, 'building selection overlay renderer boundary must exist');
  const overlay = WEB_SOURCE.slice(start, end);

  assert.match(overlay, /geometry\.type\s*!==\s*'Polygon'/);
  assert.match(overlay, /type\s*:\s*'polygon-3d'/);
  assert.match(overlay, /type\s*:\s*'extrude'/);
  assert.match(overlay, /offset\s*:\s*minHeight\s*\+\s*1\.2/);
  assert.match(overlay, /material\s*:\s*\{\s*color\s*:\s*\[0,\s*232,\s*255,\s*0\.72\]/);
  assert.match(overlay, /size\s*:\s*2\.3/);
  assert.match(overlay, /_geoSceneBuildingSelectionLayer\.removeAll\(\)/);

  const identifyStart = WEB_SOURCE.indexOf('function identifyGeoSceneBuildingAtHit');
  const identifyEnd = WEB_SOURCE.indexOf('function syncGeoSceneEventLayer', identifyStart);
  const identify = WEB_SOURCE.slice(identifyStart, identifyEnd);
  assert.match(identify, /showGeoSceneBuildingSelectionOverlay\(result\.highlight\)/);
});

test('selected building overlay is cleared with the building interaction lifecycle', () => {
  const clearStart = WEB_SOURCE.indexOf('function clearGeoSceneBuildingHighlight');
  const clearEnd = WEB_SOURCE.indexOf('function setGeoSceneBuildingHighlight', clearStart);
  const clearSource = WEB_SOURCE.slice(clearStart, clearEnd);
  assert.match(clearSource, /if\s*\(selected\)\s*clearGeoSceneBuildingSelectionOverlay\(\)/);

  const visibilityStart = WEB_SOURCE.indexOf('function setMapDataLayerVisibility');
  const visibilityEnd = WEB_SOURCE.indexOf('function syncMapLayerControlsFromVisibility', visibilityStart);
  const visibility = WEB_SOURCE.slice(visibilityStart, visibilityEnd);
  assert.match(visibility, /layerKey\s*===\s*'buildings'[\s\S]*?!visible[\s\S]*?clearGeoSceneBuildingHighlight\(true\)/);

  const disposeStart = WEB_SOURCE.indexOf('function disposeGeoSceneView');
  const disposeEnd = WEB_SOURCE.indexOf('function startGeoSceneFallback', disposeStart);
  const dispose = WEB_SOURCE.slice(disposeStart, disposeEnd);
  assert.match(dispose, /clearGeoSceneBuildingSelectionOverlay\(\)/);
  assert.match(dispose, /_geoSceneBuildingSelectionLayer\s*=\s*null/);
});

test('GeoScene events expose a DOM marker that opens the event popup', () => {
  const start = WEB_SOURCE.indexOf('function renderGeoSceneDomEventMarkers');
  const end = WEB_SOURCE.indexOf('function focusGeoSceneEvent', start);
  assert.notEqual(start, -1, 'GeoScene DOM event marker renderer must exist');
  assert.notEqual(end, -1, 'GeoScene DOM event marker renderer boundary must exist');
  const renderer = WEB_SOURCE.slice(start, end);

  assert.match(renderer, /ensureSceneEventOverlay\(mapBg\)/);
  assert.match(renderer, /view\.toScreen\(cluster\.graphic\.geometry\)/);
  assert.match(renderer, /marker\.addEventListener\('click'/);
  assert.match(renderer, /showMapEventPopup\(/);
  assert.match(renderer, /data-event-id/);
  assert.match(WEB_SOURCE, /view\.watch\('stationary'[\s\S]*?renderGeoSceneDomEventMarkers\(view\)/);
});

test('GeoScene DOM event markers follow the camera while the map is moving', () => {
  const schedulerStart = WEB_SOURCE.indexOf('function scheduleGeoSceneDomEventMarkerRender');
  const schedulerEnd = WEB_SOURCE.indexOf('function focusGeoSceneEvent', schedulerStart);
  assert.notEqual(schedulerStart, -1, 'an animation-frame marker scheduler must exist');
  assert.notEqual(schedulerEnd, -1, 'the marker scheduler boundary must exist');
  const scheduler = WEB_SOURCE.slice(schedulerStart, schedulerEnd);

  assert.match(scheduler, /requestAnimationFrame\(/, 'marker updates should be coalesced per animation frame');
  assert.match(scheduler, /renderGeoSceneDomEventMarkers\(view\)/);
  assert.match(
    WEB_SOURCE,
    /view\.watch\('camera'[\s\S]*?scheduleGeoSceneDomEventMarkerRender\(view\)/,
    'camera changes must schedule marker updates during pan, zoom and rotation'
  );
});

test('GeoScene DOM event markers wait until the SceneView is ready', () => {
  const rendererStart = WEB_SOURCE.indexOf('function renderGeoSceneDomEventMarkers');
  const rendererEnd = WEB_SOURCE.indexOf('function scheduleGeoSceneDomEventMarkerRender', rendererStart);
  const renderer = WEB_SOURCE.slice(rendererStart, rendererEnd);
  assert.match(renderer, /!view\.ready/, 'toScreen must not run before the SceneView is ready');
});

test('the SceneView and event focus frame coordinates as targets, not camera positions', () => {
  const viewStart = WEB_SOURCE.indexOf('var view = new modules.SceneView');
  const viewEnd = WEB_SOURCE.indexOf('window._geoSceneView = view', viewStart);
  const viewSetup = WEB_SOURCE.slice(viewStart, viewEnd);
  assert.match(viewSetup, /center\s*:\s*\[/);
  assert.match(viewSetup, /scale\s*:/);
  assert.doesNotMatch(viewSetup, /camera\s*:\s*\{/);

  const focusStart = WEB_SOURCE.indexOf('function focusGeoSceneEvent');
  const focusEnd = WEB_SOURCE.indexOf('function initGeoSceneMap', focusStart);
  const focusSource = WEB_SOURCE.slice(focusStart, focusEnd);
  assert.match(focusSource, /target\s*:\s*\{/);
  assert.match(focusSource, /scale\s*:/);
  assert.doesNotMatch(focusSource, /position\s*:\s*\{/);
});

test('event points stay above the scene surface for reliable pointer hits', () => {
  const start = WEB_SOURCE.indexOf('function createGeoSceneEventLayer');
  const end = WEB_SOURCE.indexOf('function getMapFacilityFeatures', start);
  assert.notEqual(start, -1);
  assert.notEqual(end, -1);
  const eventLayer = WEB_SOURCE.slice(start, end);

  assert.match(eventLayer, /elevationInfo\s*:\s*\{\s*mode\s*:\s*'relative-to-ground'\s*,\s*offset\s*:\s*\d+/);
});

test('interaction fix uses a fresh browser cache version', () => {
  const version = '20260721-web-controls';
  assert.match(WEB_SOURCE, new RegExp(version));
  assert.match(WEB_HTML, new RegExp(`webcss\\.css\\?v=${version}`));
  assert.match(WEB_HTML, new RegExp(`road-visuals\\.js\\?v=${version}`));
  assert.match(WEB_HTML, new RegExp(`water-visuals\\.js\\?v=${version}`));
  assert.match(WEB_HTML, new RegExp(`web\\.js\\?v=${version}`));
});
