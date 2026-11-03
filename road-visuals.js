(function(root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.BlindRoadVisuals = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function() {
  'use strict';

  var ROAD_TYPE_GROUPS = Object.freeze({
    major: Object.freeze([
      'primary', 'primary_link',
      'secondary', 'secondary_link',
      'tertiary', 'tertiary_link'
    ]),
    local: Object.freeze([
      'residential', 'service', 'living_street', 'pedestrian', 'cycleway'
    ]),
    detail: Object.freeze([
      'footway', 'path', 'steps', 'elevator', 'corridor'
    ])
  });

  var ACCESSIBILITY_MIN_SCALES = Object.freeze({
    caution: 45000,
    blocked: 45000,
    safe: 14000,
    unknown: 6500
  });

  function quoteSql(value) {
    return "'" + String(value).replace(/'/g, "''") + "'";
  }

  function sqlIn(field, values, negate) {
    return field + (negate ? ' NOT IN (' : ' IN (') + values.map(quoteSql).join(', ') + ')';
  }

  function getRoadLayerDefinitions() {
    var allKnown = ROAD_TYPE_GROUPS.major.concat(ROAD_TYPE_GROUPS.local, ROAD_TYPE_GROUPS.detail);
    var majorExpression = sqlIn('highway', ROAD_TYPE_GROUPS.major);
    var localExpression = sqlIn('highway', ROAD_TYPE_GROUPS.local);
    var detailExpression = sqlIn('highway', ROAD_TYPE_GROUPS.detail);
    var cleanNamedRoad = "road_name IS NOT NULL AND road_name <> '' AND road_name <> '未命名道路'";
    var connectedRoad = 'is_isolated = 0 AND is_dangle = 0';
    var localException = [
      'is_isolated = 1',
      'is_dangle = 1',
      'road_name IS NULL',
      "road_name = ''",
      "road_name = '未命名道路'"
    ].join(' OR ');
    var otherType = [
      sqlIn('highway', allKnown, true),
      'highway IS NULL',
      "highway = ''"
    ].join(' OR ');

    return [
      Object.freeze({
        key: 'majorCasing',
        title: '主干路结构描边',
        definitionExpression: majorExpression,
        minScale: 0,
        rendererTier: 'majorCasing',
        opacity: 0.92
      }),
      Object.freeze({
        key: 'major',
        title: '城市主干路骨架',
        definitionExpression: majorExpression,
        minScale: 0,
        rendererTier: 'major',
        opacity: 0.98
      }),
      Object.freeze({
        key: 'local',
        title: '街区连通道路',
        definitionExpression: '(' + localExpression + ') AND ' + cleanNamedRoad + ' AND ' + connectedRoad,
        minScale: 30000,
        rendererTier: 'local',
        opacity: 0.84
      }),
      Object.freeze({
        key: 'detail',
        title: '步行细节道路',
        definitionExpression: detailExpression,
        minScale: 10000,
        rendererTier: 'detail',
        opacity: 0.78
      }),
      Object.freeze({
        key: 'exceptions',
        title: '近景补充道路',
        definitionExpression: '((' + localExpression + ') AND (' + localException + ')) OR (' + otherType + ')',
        minScale: 6500,
        rendererTier: 'exceptions',
        opacity: 0.58
      })
    ];
  }

  function getRoadLodState(scale) {
    var numericScale = Number(scale);
    if (!isFinite(numericScale) || numericScale <= 0) numericScale = Number.POSITIVE_INFINITY;
    var definitions = getRoadLayerDefinitions();
    var byKey = {};
    definitions.forEach(function(definition) { byKey[definition.key] = definition; });
    if (numericScale > byKey.local.minScale) {
      return Object.freeze({ band: 'major', definitionExpression: byKey.major.definitionExpression });
    }
    if (numericScale > byKey.detail.minScale) {
      return Object.freeze({
        band: 'local',
        definitionExpression: '(' + byKey.major.definitionExpression + ') OR (' + byKey.local.definitionExpression + ')'
      });
    }
    if (numericScale > byKey.exceptions.minScale) {
      return Object.freeze({
        band: 'detail',
        definitionExpression: '(' + byKey.major.definitionExpression + ') OR (' +
          byKey.local.definitionExpression + ') OR (' + byKey.detail.definitionExpression + ')'
      });
    }
    return Object.freeze({ band: 'complete', definitionExpression: '1=1' });
  }

  return Object.freeze({
    ROAD_TYPE_GROUPS: ROAD_TYPE_GROUPS,
    ACCESSIBILITY_MIN_SCALES: ACCESSIBILITY_MIN_SCALES,
    getRoadLayerDefinitions: getRoadLayerDefinitions,
    getRoadLodState: getRoadLodState
  });
});
