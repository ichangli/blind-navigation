'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

const visuals = require(path.join(__dirname, '..', '..', '..', 'water-visuals.js'));

test('water factory maps all published classes to ArcGIS water symbols', () => {
  const renderer = visuals.getWaterRenderer();
  const byValue = Object.fromEntries(
    renderer.uniqueValueInfos.map((item) => [item.value, item.symbol.symbolLayers[0]])
  );

  assert.equal(renderer.type, 'unique-value');
  assert.equal(renderer.field, 'water_class');
  assert.deepEqual(Object.keys(byValue), ['major', 'medium', 'minor']);
  assert.equal(byValue.major.color, '#087DA0');
  assert.equal(byValue.major.waterbodySize, 'large');
  assert.equal(byValue.major.waveStrength, 'moderate');
  assert.equal(byValue.medium.color, '#08607D');
  assert.equal(byValue.medium.waterbodySize, 'medium');
  assert.equal(byValue.medium.waveStrength, 'slight');
  assert.equal(byValue.minor.color, '#07445E');
  assert.equal(byValue.minor.waterbodySize, 'small');
  assert.equal(byValue.minor.waveStrength, 'calm');
  assert.equal(renderer.defaultSymbol.symbolLayers[0].color, '#07445E');
});

test('water factory returns null without a configured URL', () => {
  assert.equal(visuals.createWaterLayer(class {}, { layers: {} }), null);
  assert.equal(visuals.createWaterLayer(class {}, { layers: { waterLayerUrl: '   ' } }), null);
  assert.equal(visuals.createWaterLayer(null, { layers: { waterLayerUrl: 'https://example.test/water' } }), null);
});

test('water factory creates a non-interactive ground layer from the proxied URL', () => {
  class FakeFeatureLayer {
    constructor(options) {
      this.options = options;
    }
  }

  const layer = visuals.createWaterLayer(FakeFeatureLayer, {
    layers: { waterLayerUrl: '  /api/proxy/water/FeatureServer/0  ' }
  });

  assert.ok(layer instanceof FakeFeatureLayer);
  assert.equal(layer.options.url, '/api/proxy/water/FeatureServer/0');
  assert.equal(layer.options.popupEnabled, false);
  assert.equal(layer.options.elevationInfo.mode, 'on-the-ground');
  assert.deepEqual(layer.options.outFields, [
    'objectid', 'water_id', 'label_name', 'water_class',
    'display_rank', 'waterbody_size', 'wave_strength', 'area_m2'
  ]);
  assert.equal(layer.options.legendEnabled, false);
  assert.equal(layer.options.listMode, 'hide');
});
