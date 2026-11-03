'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const visuals = require(path.join(__dirname, '..', '..', '..', 'road-visuals.js'));

test('road LOD policy reveals detail progressively without dropping a tier', () => {
  const definitions = visuals.getRoadLayerDefinitions();
  const byKey = Object.fromEntries(definitions.map((item) => [item.key, item]));

  assert.deepEqual(definitions.map((item) => item.key), [
    'majorCasing',
    'major',
    'local',
    'detail',
    'exceptions'
  ]);
  assert.equal(byKey.major.minScale, 0);
  assert.match(byKey.major.definitionExpression, /primary/);
  assert.match(byKey.major.definitionExpression, /tertiary_link/);

  assert.equal(byKey.local.minScale, 30000);
  assert.match(byKey.local.definitionExpression, /residential/);
  assert.match(byKey.local.definitionExpression, /road_name IS NOT NULL/);
  assert.match(byKey.local.definitionExpression, /is_isolated = 0/);
  assert.match(byKey.local.definitionExpression, /is_dangle = 0/);

  assert.equal(byKey.detail.minScale, 10000);
  assert.match(byKey.detail.definitionExpression, /footway/);
  assert.match(byKey.detail.definitionExpression, /elevator/);

  assert.equal(byKey.exceptions.minScale, 6500);
  assert.match(byKey.exceptions.definitionExpression, /is_isolated = 1/);
  assert.match(byKey.exceptions.definitionExpression, /road_name IS NULL/);
  assert.match(byKey.exceptions.definitionExpression, /highway NOT IN/);
});

test('accessibility overlays emphasize risk before safe and unknown segments', () => {
  assert.deepEqual(visuals.ACCESSIBILITY_MIN_SCALES, {
    caution: 45000,
    blocked: 45000,
    safe: 14000,
    unknown: 6500
  });
});

test('one base road layer switches its definition at stable scale bands', () => {
  assert.equal(visuals.getRoadLodState(90000).band, 'major');
  assert.match(visuals.getRoadLodState(90000).definitionExpression, /primary/);
  assert.doesNotMatch(visuals.getRoadLodState(90000).definitionExpression, /residential/);

  assert.equal(visuals.getRoadLodState(25000).band, 'local');
  assert.match(visuals.getRoadLodState(25000).definitionExpression, /residential/);
  assert.doesNotMatch(visuals.getRoadLodState(25000).definitionExpression, /footway/);

  assert.equal(visuals.getRoadLodState(9000).band, 'detail');
  assert.match(visuals.getRoadLodState(9000).definitionExpression, /footway/);

  assert.deepEqual(visuals.getRoadLodState(5000), {
    band: 'complete',
    definitionExpression: '1=1'
  });
});

test('road type groups are disjoint so a segment is not double-rendered', () => {
  const groups = visuals.ROAD_TYPE_GROUPS;
  const values = [...groups.major, ...groups.local, ...groups.detail];
  assert.equal(new Set(values).size, values.length);
});

test('web page loads and consumes the LOD policy before bootstrapping the map', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', '..', '..', 'Web管理端.html'), 'utf8');
  const webJs = fs.readFileSync(path.join(__dirname, '..', '..', '..', 'web.js'), 'utf8');
  const version = '20260721-web-controls';

  const policyScript = html.indexOf(`road-visuals.js?v=${version}`);
  const waterScript = html.indexOf(`water-visuals.js?v=${version}`);
  const appScript = html.indexOf(`web.js?v=${version}`);
  assert.ok(policyScript >= 0, 'road visual policy script should be cache-versioned');
  assert.ok(waterScript > policyScript, 'water visual policy must load after the road policy');
  assert.ok(appScript > waterScript, 'both visual policies must load before web.js');
  assert.match(webJs, new RegExp(version));
  assert.match(webJs, /BlindRoadVisuals\.getRoadLodState\(/);
  assert.match(webJs, /minScale: options\.minScale/);
  assert.match(webJs, /view\.watch\('scale'/);
  assert.match(webJs, /visualLayers\.base\s*=/);
  assert.doesNotMatch(webJs, /orderedBaseLayers/);
});

test('backend frontend whitelist serves the road visual policy module', () => {
  const backendMain = fs.readFileSync(path.join(__dirname, '..', '..', '..', 'backend', 'main.py'), 'utf8');
  assert.match(backendMain, /FRONTEND_FILES\s*=\s*\{[\s\S]*["']road-visuals\.js["']/);
});
