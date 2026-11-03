(function(root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.BlindWaterVisuals = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function() {
  'use strict';

  function waterSymbol(color, waterbodySize, waveStrength) {
    return {
      type: 'polygon-3d',
      symbolLayers: [{
        type: 'water',
        color: color,
        waterbodySize: waterbodySize,
        waveStrength: waveStrength
      }]
    };
  }

  function waterClass(value, color, waterbodySize, waveStrength) {
    return {
      value: value,
      symbol: waterSymbol(color, waterbodySize, waveStrength)
    };
  }

  function getWaterRenderer() {
    return {
      type: 'unique-value',
      field: 'water_class',
      uniqueValueInfos: [
        waterClass('major', '#087DA0', 'large', 'moderate'),
        waterClass('medium', '#08607D', 'medium', 'slight'),
        waterClass('minor', '#07445E', 'small', 'calm')
      ],
      defaultSymbol: waterSymbol('#07445E', 'small', 'calm')
    };
  }

  function buildWaterLayerOptions(cfg) {
    var url = cfg && cfg.layers && String(cfg.layers.waterLayerUrl || '').trim();
    if (!url) return null;

    return {
      url: url,
      title: '福田动态水域',
      outFields: [
        'objectid', 'water_id', 'label_name', 'water_class',
        'display_rank', 'waterbody_size', 'wave_strength', 'area_m2'
      ],
      renderer: getWaterRenderer(),
      elevationInfo: { mode: 'on-the-ground' },
      popupEnabled: false,
      legendEnabled: false,
      listMode: 'hide'
    };
  }

  function createWaterLayer(FeatureLayer, cfg) {
    var options = buildWaterLayerOptions(cfg);
    if (!FeatureLayer || !options) return null;
    return new FeatureLayer(options);
  }

  return Object.freeze({
    getWaterRenderer: getWaterRenderer,
    buildWaterLayerOptions: buildWaterLayerOptions,
    createWaterLayer: createWaterLayer
  });
});
