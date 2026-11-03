// ========== 数据层 ==========
// 数据优先从外部 JSON 文件加载，加载失败时使用内联回退数据
var APP_DATA = null;
var SELECTED_EVENT_ID = null;
var PENDING_DELETE_EVENT = null;
var WEB_REFRESH_MS = 30000;
var webRefreshTimer = null;
var WEB_DATA_VERSION = '20260721-web-controls';
var MAP_SDK_LOAD_TIMEOUT_MS = 15000;
var MAP_WEBGL_RECOVERY_TIMEOUT_MS = 2200;
var ACTIVE_MAP_THEME = 'overview';
var MAP_THEME_KEYS = ['overview', 'accessible', 'transit', 'services'];
var MAP_THEME_LABELS = {
  overview: '城市总览',
  accessible: '无障碍专题',
  transit: '公共交通',
  services: '服务设施'
};
var MAP_FACILITY_STYLES = {
  metroStation: { label: '地铁站', color: '#00d4ff', rgba: [0, 212, 255], size: 24, icon: 'M', badge: 'round', cluster: false, group: 'transit', minScale: 0 },
  metroEntrance: { label: '地铁出入口', color: '#49e5c5', rgba: [73, 229, 197], size: 19, icon: 'E', badge: 'diamond', cluster: true, group: 'transit', minScale: 14000 },
  busStop: { label: '公交站', color: '#4b8dff', rgba: [75, 141, 255], size: 17, icon: 'B', badge: 'vertical', cluster: true, group: 'transit', minScale: 8500 },
  toilet: { label: '公共厕所', color: '#72e6ff', rgba: [114, 230, 255], size: 18, icon: 'WC', badge: 'square', cluster: true, group: 'service', minScale: 16000 },
  park: { label: '社区公园', color: '#45d483', rgba: [69, 212, 131], size: 20, icon: 'P', badge: 'shield', cluster: true, group: 'service', minScale: 90000 },
  hospital: { label: '医院', color: '#ff5c7a', rgba: [255, 92, 122], size: 23, icon: '+', badge: 'square', cluster: false, group: 'service', minScale: 0 },
  rehab: { label: '康复服务', color: '#b785ff', rgba: [183, 133, 255], size: 21, icon: 'A', badge: 'hex', cluster: true, group: 'service', minScale: 90000 }
};
var MAP_THEME_VISIBILITY = {
  overview: {
    metroStation: false, metroEntrance: false, busStop: false,
    toilet: false, park: false, hospital: false, rehab: false,
    events: true
  },
  accessible: {
    metroStation: true, metroEntrance: true, busStop: false,
    toilet: true, park: false, hospital: true, rehab: true,
    events: true
  },
  transit: {
    metroStation: true, metroEntrance: true, busStop: true,
    toilet: false, park: false, hospital: false, rehab: false,
    events: false
  },
  services: {
    metroStation: true, metroEntrance: false, busStop: false,
    toilet: true, park: true, hospital: true, rehab: true,
    events: false
  }
};
var DEFAULT_MAP_LAYER_VISIBILITY = {
  buildings: true,
  semantic: false,
  water: true,
  roads: false,
  boundary: false,
  metroStation: false,
  metroEntrance: false,
  busStop: false,
  toilet: false,
  park: false,
  hospital: false,
  rehab: false,
  events: true
};
var ROAD_ACCESS_STYLES = {
  safe: { label: '条件较好', color: '#55cbe2', rgba: [85, 203, 226, 0.9], lineStyle: 'solid' },
  caution: { label: '需要注意', color: '#ffc247', rgba: [255, 194, 71, 0.99], lineStyle: 'solid' },
  blocked: { label: '明显障碍', color: '#ff4968', rgba: [255, 73, 104, 1], lineStyle: 'solid' },
  unknown: { label: '信息未知', color: '#a7b8c6', rgba: [167, 184, 198, 0.92], lineStyle: 'short-dash' }
};
var ROAD_IDENTIFY_TOLERANCE_PX = 14;
var WEB_NAVIGATION_STATE = {
  active: false,
  stage: 'idle',
  origin: null,
  destination: null,
  result: null,
  requestId: 0,
  animationFrame: null,
  markerGraphics: [],
  routeGraphics: []
};
var ROAD_HIGHWAY_LABELS = {
  footway: '人行道', pedestrian: '步行街', path: '步行小径', corridor: '室内通道',
  steps: '台阶', elevator: '电梯连接', cycleway: '骑行与步行道', living_street: '生活街区道路',
  residential: '居住区道路', service: '服务道路', unclassified: '一般道路', track: '简易道路',
  tertiary: '三级道路', tertiary_link: '三级道路连接线', secondary: '次干路',
  secondary_link: '次干路连接线', primary: '主干路', primary_link: '主干路连接线'
};

// Page switching - 默认值，将被 JSON 数据覆盖
var pages = {
  dashboard: ['三维数字孪生大屏', 'Web 管理端 / 三维数字孪生大屏'],
  events: ['事件管理', 'Web 管理端 / 事件管理模块'],
  'event-detail': ['事件详情 — E20260701', 'Web 管理端 / 事件管理 / 事件详情'],
  charts: ['趋势图表分析', 'Web 管理端 / 趋势图表分析'],
};

function goPage(name, navEl) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + name);
  if (target) target.classList.add('active');

  document.querySelectorAll('.nav-item').forEach(n => {
    n.classList.remove('active');
    n.removeAttribute('aria-current');
  });
  if (navEl) {
    navEl.classList.add('active');
    navEl.setAttribute('aria-current', 'page');
  } else {
    const m = document.querySelector(`.nav-item[data-page="${name}"]`);
    if (m) {
      m.classList.add('active');
      m.setAttribute('aria-current', 'page');
    }
  }

  if (pages[name]) {
    document.getElementById('pageTitle').textContent = pages[name][0];
    document.getElementById('breadcrumb').textContent = pages[name][1];
  }
  document.querySelector('.content-area').scrollTop = 0;

  // Re-render chart when navigating to charts page (fixes initial empty chart)
  if (name === 'charts') {
    setTimeout(function() {
      var chip = document.querySelector('#page-charts .filter-chip.on');
      if (chip) switchChartPeriod('month', chip);
    }, 50);
  }

  // Update URL hash for persistent state
  if (window.location.hash !== '#' + name) {
    history.pushState(null, '', '#' + name);
  }
}

// View tabs
function setView(el) {
  el.parentElement.querySelectorAll('.view-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  var theme = el.dataset.theme;
  if (!theme) {
    var tabs = Array.prototype.slice.call(el.parentElement.querySelectorAll('.view-tab'));
    theme = MAP_THEME_KEYS[Math.max(0, tabs.indexOf(el))] || 'overview';
    el.dataset.theme = theme;
  }
  applyMapTheme(theme, true);
}

function getTiles3DEventHeight() {
  if (window._tiles3DUsesLocalGeoJSON) return 0;
  var tiles3d = APP_DATA && APP_DATA.mapConfig && APP_DATA.mapConfig.tiles3d;
  var height = Number(tiles3d && tiles3d.eventHeight);
  return isFinite(height) ? height : 0;
}

function setCesiumCameraView(widget, cfg) {
  if (!widget || !window.Cesium) return;
  var Cesium = window.Cesium;
  var center = cfg.center || {};
  var target = Cesium.Cartesian3.fromDegrees(
    Number(center.longitude || 114.0550),
    Number(center.latitude || 22.5350),
    getTiles3DEventHeight()
  );
  widget.camera.lookAt(target, new Cesium.HeadingPitchRange(
    Cesium.Math.toRadians(Number(center.heading || 0)),
    Cesium.Math.toRadians(-Math.abs(Number(center.tilt || 55))),
    Number(center.z || 2200)
  ));
  widget.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
}

// Map zoom (real functionality)
function mapZoom(dir) {
  if (window._geoSceneView) {
    var view = window._geoSceneView;
    var factor = dir === 'in' ? 0.65 : 1.45;
    var scale = view.scale ? view.scale * factor : undefined;
    view.goTo(scale ? { scale: scale } : { zoom: view.zoom + (dir === 'in' ? 1 : -1) }).catch(function() {});
    toast(dir === 'in' ? 'GeoScene 场景已放大' : 'GeoScene 场景已缩小');
    return;
  }
  if (window._tiles3DWidget) {
    var camera = window._tiles3DWidget.camera;
    var distance = Math.max(camera.positionCartographic.height * 0.22, 120);
    if (dir === 'in') camera.moveForward(distance);
    else camera.moveBackward(distance);
    window._tiles3DWidget.scene.requestRender();
    toast(dir === 'in' ? '三维场景已放大' : '三维场景已缩小');
    return;
  }
  const mapBg = document.getElementById('mapBg');
  const currentScale = parseFloat(mapBg.dataset.scale || '1');
  const newScale = dir === 'in' ? Math.min(currentScale * 1.25, 4) : Math.max(currentScale * 0.8, 0.25);
  mapBg.dataset.scale = newScale;
  mapBg.style.transition = 'transform 0.25s ease';
  mapBg.style.transformOrigin = 'center center';
  mapBg.style.transform = 'scale(' + newScale + ')';
  toast(dir === 'in' ? '地图已放大 ' + Math.round(newScale * 100) + '%' : '地图已缩小 ' + Math.round(newScale * 100) + '%');
}

function getGeoSceneCameraHeight(mapConfig) {
  var center = (mapConfig && mapConfig.center) || {};
  var configured = Number(center.z || 1600);
  if (!isFinite(configured)) configured = 1600;
  return Math.max(900, Math.min(configured, 1800));
}

function mapReset() {
  if (window._geoSceneView && APP_DATA && APP_DATA.mapConfig) {
    var cfgCenter = APP_DATA.mapConfig.center || {};
    window._geoSceneView.goTo({
      target: {
        type: 'point',
        longitude: Number(cfgCenter.longitude || 114.0550),
        latitude: Number(cfgCenter.latitude || 22.5350),
        spatialReference: { wkid: 4326 }
      },
      scale: Number(cfgCenter.scale || 52000),
      heading: Number(cfgCenter.heading || 0),
      tilt: Number(cfgCenter.tilt || 55)
    }).catch(function() {});
    toast('GeoScene 视角已复位');
    return;
  }
  if (window._tiles3DWidget && window.Cesium && APP_DATA && APP_DATA.mapConfig) {
    setCesiumCameraView(window._tiles3DWidget, APP_DATA.mapConfig);
    window._tiles3DWidget.scene.requestRender();
    toast('三维场景视角已复位');
    return;
  }
  const mapBg = document.getElementById('mapBg');
  mapBg.style.transition = 'transform 0.3s ease';
  mapBg.style.transformOrigin = 'center center';
  mapBg.style.transform = 'scale(1)';
  mapBg.dataset.scale = '1';
  toast('地图视角已复位');
}

// Building popup
function bldPopup(e, name, coverage, facility) {
  const old = document.querySelector('.bld-popup');
  if (old) old.remove();
  const pop = document.createElement('div');
  pop.className = 'bld-popup';
  const mapRect = document.getElementById('dashMap').getBoundingClientRect();
  pop.style.left = Math.max(5, e.clientX - mapRect.left - 110) + 'px';
  pop.style.top = Math.max(5, e.clientY - mapRect.top - 130) + 'px';
  pop.innerHTML = `<div class="pop-close" onclick="this.parentElement.remove()">✕</div>
    <div class="pop-title">${name}</div>
    <div class="pop-row"><span>周边盲道覆盖率</span><span>${coverage}</span></div>
    <div class="pop-row"><span>最近无障碍设施</span><span>${facility}</span></div>
    <div style="font-size:10px;color:var(--text-muted);margin-top:6px;">点击 ✕ 关闭 (W-04)</div>`;
  document.getElementById('dashMap').appendChild(pop);
  e.stopPropagation();
}
document.getElementById('dashMap').addEventListener('click', function(e) {
  if (!e.target.closest('.bld-popup') && !e.target.closest('.building') && !e.target.closest('.event-map-popup') && !e.target.closest('.event-cluster-popup') && !e.target.closest('.facility-map-popup-web') && !e.target.closest('.event-dot')) {
    clearMapPopups();
    clearGeoSceneBuildingHighlight(true);
  }
});

function getStatusClass(status) {
  switch (status) {
    case '待审核': return 'st-pending';
    case '处理中': return 'st-processing';
    case '已修复': return 'st-done';
    case '驳回': return 'st-rejected';
    default: return 'st-pending';
  }
}

function getMapEventById(eventId) {
  if (!APP_DATA || !APP_DATA.dashboard || !APP_DATA.dashboard.map) return null;
  var mapEvents = APP_DATA.dashboard.map.events || [];
  for (var i = 0; i < mapEvents.length; i++) {
    if (mapEvents[i].id === eventId) return mapEvents[i];
  }
  return null;
}

function mergeEventData(eventId, patch) {
  if (!APP_DATA) return;
  if (APP_DATA.eventDetail && APP_DATA.eventDetail.id === eventId) {
    Object.assign(APP_DATA.eventDetail, patch);
  }
  (APP_DATA.events || []).forEach(function(evt) {
    if (evt.id === eventId) Object.assign(evt, patch);
  });
  if (APP_DATA.dashboard && APP_DATA.dashboard.map) {
    (APP_DATA.dashboard.map.events || []).forEach(function(evt) {
      if (evt.id === eventId) Object.assign(evt, patch);
    });
  }
}

function clearMapPopups(preserveBuildingRequest) {
  if (!preserveBuildingRequest) {
    window._buildingIdentifyRequestId = (window._buildingIdentifyRequestId || 0) + 1;
  }
  document.querySelectorAll('.event-map-popup, .event-cluster-popup, .bld-popup, .facility-map-popup-web').forEach(function(el) { el.remove(); });
}

function showMapEventPopup(evt, point) {
  if (!evt) return;
  clearMapPopups();
  var map = document.getElementById('dashMap');
  if (!map) return;
  var pop = document.createElement('div');
  pop.className = 'event-map-popup';
  pop.innerHTML =
    '<div class="pop-close" title="关闭">✕</div>' +
    '<div class="pop-title">' + evt.id + ' · ' + evt.title + '</div>' +
    '<div class="pop-row"><span>状态</span><span class="st-badge ' + getStatusClass(evt.status) + '">' + evt.status + '</span></div>' +
    '<div class="pop-row"><span>位置</span><span>' + (evt.location || evt.address || evt.district || '深圳') + '</span></div>' +
    '<div class="pop-row"><span>坐标</span><span>' + Number(evt.lon).toFixed(5) + ', ' + Number(evt.lat).toFixed(5) + '</span></div>' +
    '<div class="pop-row"><span>上报</span><span>' + (evt.reporter || '匿名用户') + ' · ' + (evt.time || '') + '</span></div>' +
    '<div class="pop-actions">' +
      '<button class="mini-btn accent" data-action="detail">查看详情</button>' +
      '<button class="mini-btn" data-action="next">状态流转</button>' +
      '<button class="mini-btn danger" data-action="reject">驳回</button>' +
    '</div>';
  map.appendChild(pop);

  var rect = map.getBoundingClientRect();
  var x = point && isFinite(point.x) ? point.x : rect.width / 2;
  var y = point && isFinite(point.y) ? point.y : rect.height / 2;
  pop.style.left = Math.max(8, Math.min(rect.width - 292, x + 12)) + 'px';
  pop.style.top = Math.max(8, Math.min(rect.height - 190, y - 24)) + 'px';

  pop.querySelector('.pop-close').addEventListener('click', function() { pop.remove(); });
  pop.querySelector('[data-action="detail"]').addEventListener('click', function() {
    openEventDetail(evt.id);
  });
  pop.querySelector('[data-action="next"]').addEventListener('click', function() {
    var nextStatus = evt.status === '处理中' ? '已修复' : '处理中';
    updateEventStatusById(evt.id, nextStatus);
  });
  pop.querySelector('[data-action="reject"]').addEventListener('click', function() {
    updateEventStatusById(evt.id, '驳回');
  });

  if (window.userRole !== 'admin') {
    pop.querySelector('[data-action="next"]').style.display = 'none';
    pop.querySelector('[data-action="reject"]').style.display = 'none';
  }
}

function openEventDetail(eventId) {
  if (!eventId) return;
  SELECTED_EVENT_ID = eventId;
  var mapEvent = getMapEventById(eventId);
  if (mapEvent) {
    showMapEventPopup(mapEvent);
    focusGeoSceneEvent(mapEvent);
    focusCesiumEvent(mapEvent);
  }
  highlightSelectedEventMarker();

  var apiBase = getWebApiBase(APP_DATA);
  fetchWebJSON(apiBase + '/api/web/events/' + encodeURIComponent(eventId), { headers: authHeaders() })
    .then(function(detail) {
      APP_DATA.eventDetail = detail;
      mergeEventData(eventId, detail);
      renderEventDetailFromJSON();
      goPage('event-detail');
      highlightSelectedEventMarker();
    })
    .catch(function(err) {
      toast(err.message || '事件详情加载失败');
      goPage('event-detail');
    });
}

// Event actions
function updateEventStatus(nextStatus) {
  if (!APP_DATA || !APP_DATA.eventDetail) return;
  updateEventStatusById(APP_DATA.eventDetail.id, nextStatus);
}

function updateEventStatusById(eventId, nextStatus) {
  var apiBase = getWebApiBase(APP_DATA);
  fetchWebJSON(apiBase + '/api/web/events/' + encodeURIComponent(eventId) + '/status', {
    method: 'PATCH',
    headers: Object.assign({ 'Content-Type': 'application/json' }, authHeaders()),
    body: JSON.stringify({ status: nextStatus })
  }).then(function(data) {
    var isAdmin = window.userRole === 'admin';
    mergeEventData(eventId, {
      status: data.status,
      updatedAt: data.updatedAt,
      canAudit: isAdmin && data.status === '待审核',
      canUpdate: isAdmin && data.status === '处理中'
    });
    renderEventsFromJSON();
    applyEventFilters();
    renderEventDetailFromJSON();
    syncTiles3DEventMarkers();
    syncGeoSceneEventLayer();
    var mapEvent = getMapEventById(eventId);
    if (mapEvent) showMapEventPopup(mapEvent);
    const badge = document.getElementById('detStateBadge');
    if (badge) {
      badge.textContent = data.status;
      badge.className = 'st-badge ' + getStatusClass(data.status);
    }
    toast('事件 ' + eventId + ' 状态已更新为“' + data.status + '”');
  }).catch(function(err) {
    toast(err.message || '状态更新失败');
  });
}

function eventApprove() {
  updateEventStatus('处理中');
}
function eventReject() {
  updateEventStatus('驳回');
}
function eventComplete() {
  updateEventStatus('已修复');
}

function requestDeleteEvent(eventId) {
  if (window.userRole !== 'admin') {
    toast('只有管理员可以删除事件记录');
    return;
  }
  var eventData = null;
  if (APP_DATA && APP_DATA.events) {
    eventData = APP_DATA.events.find(function(item) { return item.id === eventId; }) || null;
  }
  if ((!eventData || eventData.canDelete !== true) && APP_DATA && APP_DATA.eventDetail && APP_DATA.eventDetail.id === eventId) {
    eventData = APP_DATA.eventDetail;
  }
  if (!eventData || eventData.canDelete !== true) {
    toast('当前账号没有删除这条记录的权限');
    return;
  }

  PENDING_DELETE_EVENT = eventData;
  document.getElementById('eventDeleteDialogId').textContent = eventData.id;
  document.getElementById('eventDeleteDialogMeta').textContent =
    (eventData.type || '事件记录') + ' · ' + (eventData.landmark || eventData.district || '位置未记录');
  var dialog = document.getElementById('eventDeleteDialog');
  if (dialog) dialog.hidden = false;
  var confirmButton = document.getElementById('confirmDeleteEventButton');
  if (confirmButton) setTimeout(function() { confirmButton.focus(); }, 50);
}

function closeEventDeleteDialog() {
  var dialog = document.getElementById('eventDeleteDialog');
  if (dialog) dialog.hidden = true;
  PENDING_DELETE_EVENT = null;
}

function confirmDeleteEvent() {
  if (window.userRole !== 'admin' || !PENDING_DELETE_EVENT) {
    closeEventDeleteDialog();
    toast('删除操作已取消：权限不足');
    return;
  }
  var eventId = PENDING_DELETE_EVENT.id;
  var button = document.getElementById('confirmDeleteEventButton');
  if (button && button.disabled) return;
  if (button) {
    button.disabled = true;
    button.textContent = '正在删除…';
  }

  var apiBase = getWebApiBase(APP_DATA);
  fetchWebJSON(apiBase + '/api/web/events/' + encodeURIComponent(eventId), {
    method: 'DELETE',
    headers: authHeaders()
  }).then(function(data) {
    var deletedId = data.deletedEventId || eventId;
    var dialog = document.getElementById('eventDeleteDialog');
    if (dialog) dialog.hidden = true;
    PENDING_DELETE_EVENT = null;
    SELECTED_EVENT_ID = null;
    return refreshWebSnapshot().then(function() {
      goPage('events');
      toast('事件 ' + deletedId + ' 已永久删除');
    });
  }).catch(function(err) {
    toast(err.message || '删除失败，请稍后重试');
  }).finally(function() {
    if (button) {
      button.disabled = false;
      button.textContent = '确认永久删除';
    }
  });
}

function eventApproveLocalFallback() {
  const badge = document.getElementById('detStateBadge');
  badge.textContent = '处理中';
  badge.className = 'st-badge st-processing';
  toast('✓ 事件 E20260701 已审核通过，状态更新为"处理中"');
}
function eventRejectLocalFallback() {
  const badge = document.getElementById('detStateBadge');
  badge.textContent = '驳回';
  badge.className = 'st-badge st-rejected';
  toast('✗ 事件 E20260701 已驳回');
}

// Map legend toggle
function toggleLegend() {
  const leg = document.getElementById('mapLegend');
  if (!leg) return;
  const collapsed = leg.classList.toggle('collapsed');
  const layout = document.querySelector('#page-dashboard .dash-layout');
  if (layout) layout.classList.toggle('layer-panel-collapsed', collapsed);
  setTimeout(function() {
    if (window._geoSceneView && window._geoSceneView.resize) window._geoSceneView.resize();
  }, 280);
  toast(collapsed ? '图层面板已折叠，地图已展开' : '图层面板已展开');
}

function setLegendRowState(row, visible) {
  if (!row) return;
  row.classList.toggle('off', !visible);
  var check = row.querySelector('.leg-check');
  if (check) check.textContent = visible ? '✓' : '';
}

function initializeMapLayerVisibility() {
  if (window._mapLayerVisibilityInitialized) return;
  window._mapLayerVisibility = Object.assign({}, DEFAULT_MAP_LAYER_VISIBILITY);
  window._eventLayerVisibility = {
    'danger-dots': true,
    'warning-dots': true,
    'muted-dots': true
  };
  window._mapLayerVisibilityInitialized = true;
}

function syncMapLayerControlsFromVisibility() {
  initializeMapLayerVisibility();
  Object.keys(DEFAULT_MAP_LAYER_VISIBILITY).forEach(function(layerKey) {
    if (layerKey === 'events') return;
    setMapDataLayerVisibility(layerKey, Boolean(window._mapLayerVisibility[layerKey]));
  });

  var eventKeys = ['danger-dots', 'warning-dots', 'muted-dots'];
  var eventIds = ['leg-danger', 'leg-warning', 'leg-muted'];
  var eventClasses = ['.dot-danger', '.dot-warning', '.dot-muted'];
  eventKeys.forEach(function(key, index) {
    var visible = window._eventLayerVisibility[key] !== false;
    setLegendRowState(document.getElementById(eventIds[index]), visible);
    document.querySelectorAll('#mapBg ' + eventClasses[index]).forEach(function(el) {
      el.style.display = visible ? '' : 'none';
    });
  });
}

function setMapDataLayerVisibility(layerKey, visible) {
  window._mapLayerVisibility = window._mapLayerVisibility || {};
  window._mapLayerVisibility[layerKey] = visible;

  if (layerKey === 'buildings') {
    getGeoSceneBuildingLayers().forEach(function(layer) { layer.visible = visible; });
    if (window._geoSceneBuildingSelectionLayer) {
      window._geoSceneBuildingSelectionLayer.visible = visible;
    }
    if (!visible) clearGeoSceneBuildingHighlight(true);
  } else if (layerKey === 'semantic') {
    getGeoSceneSemanticLayers().forEach(function(layer) { layer.visible = visible; });
  } else if (layerKey === 'water' && window._geoSceneWaterLayer) {
    window._geoSceneWaterLayer.visible = visible;
  } else if (layerKey === 'roads' && window._geoSceneRoadLayer) {
    window._geoSceneRoadLayer.visible = visible;
    if (!visible) clearSelectedRoad();
  } else if (layerKey === 'boundary' && window._geoSceneBoundaryLayer) {
    window._geoSceneBoundaryLayer.visible = visible;
  } else if (MAP_FACILITY_STYLES[layerKey] && window._geoSceneFacilityLayers) {
    var facilityLayer = window._geoSceneFacilityLayers[layerKey];
    if (facilityLayer) facilityLayer.visible = visible;
    if (!visible && layerKey === 'metroStation') clearMetroConnections();
  }

  var row = document.querySelector('[data-map-layer="' + layerKey + '"]');
  setLegendRowState(row, visible);
}

function toggleMapDataLayer(layerKey, el) {
  var current = window._mapLayerVisibility && window._mapLayerVisibility[layerKey];
  if (typeof current !== 'boolean') current = !el.classList.contains('off');
  var visible = !current;
  setMapDataLayerVisibility(layerKey, visible);
  var label = MAP_FACILITY_STYLES[layerKey] && MAP_FACILITY_STYLES[layerKey].label;
  if (!label) label = { buildings: '建筑白模', semantic: '语义建筑光层', water: '动态水面', roads: '福田道路网络', boundary: '福田区边界' }[layerKey] || layerKey;
  toast((visible ? '✓ 已显示：' : '已隐藏：') + label);
}

function applyMapTheme(theme, announce) {
  if (!MAP_THEME_VISIBILITY[theme]) theme = 'overview';
  ACTIVE_MAP_THEME = theme;
  var preset = MAP_THEME_VISIBILITY[theme];
  Object.keys(MAP_FACILITY_STYLES).forEach(function(category) {
    setMapDataLayerVisibility(category, Boolean(preset[category]));
  });

  window._eventLayerVisibility = window._eventLayerVisibility || {};
  ['danger-dots', 'warning-dots', 'muted-dots'].forEach(function(key) {
    window._eventLayerVisibility[key] = Boolean(preset.events);
  });
  ['leg-danger', 'leg-warning', 'leg-muted'].forEach(function(id) {
    setLegendRowState(document.getElementById(id), Boolean(preset.events));
  });
  document.querySelectorAll('#mapBg .event-dot').forEach(function(el) {
    el.style.display = preset.events ? '' : 'none';
  });
  getGeoSceneBuildingLayers().forEach(function(layer) {
    layer.opacity = theme === 'overview' ? 1 : (theme === 'accessible' ? 0.74 : 0.82);
  });
  if (window._geoSceneBuildingLayer) {
    window._geoSceneBuildingLayer.renderer = getGeoSceneBuildingRenderer(theme);
  }
  applyRoadThemeV4(theme);
  applySemanticBuildingTheme(theme);

  var mode = document.getElementById('mapLayerMode');
  if (mode) mode.textContent = MAP_THEME_LABELS[theme];
  updateMapQualityNote(theme);
  document.querySelectorAll('#viewTabs .view-tab').forEach(function(tab, index) {
    var tabTheme = tab.dataset.theme || MAP_THEME_KEYS[index];
    tab.dataset.theme = tabTheme;
    tab.classList.toggle('active', tabTheme === theme);
  });
  clearMetroConnections();
  syncGeoSceneEventLayer();
  syncTiles3DEventMarkers();
  if (announce) toast('已切换：' + MAP_THEME_LABELS[theme]);
}

function toggleLayer(layerKey, el) {
  el.classList.toggle('off');
  const isOn = !el.classList.contains('off');
  el.querySelector('.leg-check').textContent = isOn ? '✓' : '';
  window._eventLayerVisibility = window._eventLayerVisibility || {};
  window._eventLayerVisibility[layerKey] = isOn;
  const mapBg = document.querySelector('#dashMap .map-bg');
  if (!mapBg) return;
  switch (layerKey) {
    case 'danger-dots':
      mapBg.querySelectorAll('.dot-danger').forEach(d => d.style.display = isOn ? '' : 'none');
      break;
    case 'warning-dots':
      mapBg.querySelectorAll('.dot-warning').forEach(d => d.style.display = isOn ? '' : 'none');
      break;
    case 'muted-dots':
      mapBg.querySelectorAll('.dot-muted').forEach(d => d.style.display = isOn ? '' : 'none');
      break;
  }
  syncTiles3DEventMarkers();
  syncGeoSceneEventLayer();
  const labels = { 'danger-dots': '盲道被占', 'warning-dots': '盲道损坏', 'muted-dots': '盲道缺失' };
  toast((isOn ? '✓ 已显示：' : '已隐藏：') + labels[layerKey]);
}

// ========== Event filtering (REFACTORED) ==========
let eventPage = 1;
let filteredRows = [];
const ROWS_PER_PAGE = 10;

function toggleFilter(chip) {
  const group = chip.dataset.group;
  document.querySelectorAll(`.filter-chip[data-group="${group}"]`).forEach(c => c.classList.remove('on'));
  chip.classList.add('on');
  applyEventFilters();
}

function applyEventFilters() {
  const typeChip = document.querySelector('.filter-chip[data-group="type"].on');
  const statusChip = document.querySelector('.filter-chip[data-group="status"].on');
  const typeVal = typeChip ? typeChip.dataset.val : 'all';
  const statusVal = statusChip ? statusChip.dataset.val : 'all';
  const searchVal = (document.querySelector('.evt-search')?.value || '').toLowerCase();

  const tbody = document.querySelector('#page-events .evt-table tbody');
  const rows = tbody.querySelectorAll('tr');
  filteredRows = [];
  rows.forEach(tr => {
    const typeCell = tr.cells[1]?.textContent.trim();
    const statusCell = tr.querySelector('.st-badge')?.textContent.trim();
    const searchText = tr.textContent.toLowerCase();

    let show = true;
    if (typeVal !== 'all' && typeCell !== typeVal) show = false;
    if (statusVal !== 'all' && statusCell !== statusVal) show = false;
    if (searchVal && !searchText.includes(searchVal)) show = false;

    if (show) filteredRows.push(tr);
  });

  eventPage = 1;
  renderEventPage();
}

function renderEventPage() {
  const totalRows = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / ROWS_PER_PAGE));
  if (eventPage > totalPages) eventPage = totalPages;

  // Hide all rows, then show current page
  const tbody = document.querySelector('#page-events .evt-table tbody');
  tbody.querySelectorAll('tr').forEach(tr => tr.style.display = 'none');
  const start = (eventPage - 1) * ROWS_PER_PAGE;
  const end = Math.min(start + ROWS_PER_PAGE, totalRows);
  for (let i = start; i < end; i++) {
    filteredRows[i].style.display = '';
  }

  // Update pager info
  document.getElementById('pagerInfo').textContent = `共 ${totalRows} 条记录，第 ${eventPage}/${totalPages} 页`;

  const pager = document.getElementById('eventPager');
  const prevBtn = pager.querySelector('button:first-of-type');
  const nextBtn = pager.querySelector('button:last-of-type');

  // Remove old page buttons, rebuild dynamically
  pager.querySelectorAll('.pg-btn').forEach(b => b.remove());
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.className = 'pg-btn' + (i === eventPage ? ' on' : '');
    btn.textContent = i;
    btn.onclick = (function(pg) {
      return function() { eventPage = pg; renderEventPage(); };
    })(i);
    pager.insertBefore(btn, nextBtn);
  }

  prevBtn.disabled = eventPage <= 1;
  nextBtn.disabled = eventPage >= totalPages;
}

function goEventPage(evt, page) {
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / ROWS_PER_PAGE));
  if (page === 'prev') {
    eventPage = Math.max(1, eventPage - 1);
  } else if (page === 'next') {
    eventPage = Math.min(totalPages, eventPage + 1);
  } else {
    eventPage = page;
  }
  renderEventPage();
}

// ========== Chart period switching ==========
// 图表数据源：优先从 JSON 读取，JSON 不可用时使用默认值
var chartPeriods = {
  day: {
    title: '上报事件趋势 — 近14天 (W-11)',
    points: '60,165 90,145 120,125 150,100 180,135 210,85 240,110 270,75 300,95 330,65 360,80 390,55 420,70 450,50',
    labels: '<text x="60" y="255" fill="#5a6380" font-size="9" text-anchor="middle">6/24</text><text x="150" y="255" fill="#5a6380" font-size="9" text-anchor="middle">6/27</text><text x="240" y="255" fill="#5a6380" font-size="9" text-anchor="middle">6/30</text><text x="330" y="255" fill="#5a6380" font-size="9" text-anchor="middle">7/03</text><text x="450" y="255" fill="#5a6380" font-size="9" text-anchor="middle">7/07</text>'
  },
  week: {
    title: '上报事件趋势 — 近8周 (W-11)',
    points: '70,170 130,120 190,145 250,80 310,110 370,65 430,95 470,55',
    labels: '<text x="70" y="255" fill="#5a6380" font-size="9" text-anchor="middle">W19</text><text x="130" y="255" fill="#5a6380" font-size="9" text-anchor="middle">W20</text><text x="190" y="255" fill="#5a6380" font-size="9" text-anchor="middle">W21</text><text x="250" y="255" fill="#5a6380" font-size="9" text-anchor="middle">W22</text><text x="310" y="255" fill="#5a6380" font-size="9" text-anchor="middle">W23</text><text x="370" y="255" fill="#5a6380" font-size="9" text-anchor="middle">W24</text><text x="430" y="255" fill="#5a6380" font-size="9" text-anchor="middle">W25</text><text x="470" y="255" fill="#5a6380" font-size="9" text-anchor="middle">W26</text>'
  },
  month: {
    title: '上报事件趋势 — 近6月 (W-11)',
    points: '70,175 140,140 210,100 280,120 350,75 430,50',
    labels: '<text x="70" y="255" fill="#5a6380" font-size="9" text-anchor="middle">1月</text><text x="140" y="255" fill="#5a6380" font-size="9" text-anchor="middle">2月</text><text x="210" y="255" fill="#5a6380" font-size="9" text-anchor="middle">3月</text><text x="280" y="255" fill="#5a6380" font-size="9" text-anchor="middle">4月</text><text x="350" y="255" fill="#5a6380" font-size="9" text-anchor="middle">5月</text><text x="430" y="255" fill="#5a6380" font-size="9" text-anchor="middle">6月</text>'
  }
};

// 从 JSON 数据更新图表配置
function loadChartDataFromJSON() {
  if (!APP_DATA || !APP_DATA.chartPeriods) return;
  var cp = APP_DATA.chartPeriods;
  Object.keys(cp).forEach(function(key) {
    if (cp[key].labels && Array.isArray(cp[key].labels)) {
      cp[key]._labelsHTML = cp[key].labels.map(function(l) {
        return '<text x="' + l.x + '" y="' + l.y + '" fill="#5a6380" font-size="9" text-anchor="middle">' + l.label + '</text>';
      }).join('');
    }
  });
  chartPeriods = cp;
}

function switchChartPeriod(period, el) {
  el.parentElement.querySelectorAll('.filter-chip').forEach(function(c) { c.classList.remove('on'); });
  el.classList.add('on');
  var d = chartPeriods[period];
  document.getElementById('chartTitle').textContent = d.title;
  var pts = d.points.split(' ');
  var polyPts = d.points + ' 450,240 60,240';
  var circles = pts.map(function(p) { return '<circle cx="' + p.split(',')[0] + '" cy="' + p.split(',')[1] + '" r="4.5" fill="#00d4ff"/>'; }).join('');
  var labelsHTML = d._labelsHTML || d.labels;
  document.getElementById('chartTrendArea').innerHTML =
    '<svg viewBox="0 0 520 280" style="width:100%;height:100%;">' +
    '<defs><linearGradient id="gradTrend" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#00d4ff" stop-opacity="0.28"/><stop offset="100%" stop-color="#00d4ff" stop-opacity="0"/></linearGradient></defs>' +
    '<line x1="50" y1="30" x2="500" y2="30" stroke="rgba(255,255,255,0.04)"/>' +
    '<line x1="50" y1="90" x2="500" y2="90" stroke="rgba(255,255,255,0.04)"/>' +
    '<line x1="50" y1="150" x2="500" y2="150" stroke="rgba(255,255,255,0.04)"/>' +
    '<line x1="50" y1="210" x2="500" y2="210" stroke="rgba(255,255,255,0.04)"/>' +
    '<text x="42" y="34" fill="#5a6380" font-size="10" text-anchor="end">40</text>' +
    '<text x="42" y="94" fill="#5a6380" font-size="10" text-anchor="end">30</text>' +
    '<text x="42" y="154" fill="#5a6380" font-size="10" text-anchor="end">20</text>' +
    '<text x="42" y="214" fill="#5a6380" font-size="10" text-anchor="end">10</text>' +
    '<polygon points="' + polyPts + '" fill="url(#gradTrend)"/>' +
    '<polyline points="' + d.points + '" fill="none" stroke="#00d4ff" stroke-width="2.2"/>' +
    circles + labelsHTML +
    '</svg>';
}

function initChart() {
  var chip = document.querySelector('#page-charts .filter-chip.on');
  if (chip) switchChartPeriod('month', chip);
}

// ========== 数据驱动渲染函数 ==========
// 从 JSON 数据渲染仪表盘统计卡片
function renderDashboardFromJSON() {
  if (!APP_DATA || !APP_DATA.dashboard) return;
  var d = APP_DATA.dashboard;
  var container = document.querySelector('#page-dashboard .dash-stats');
  if (!container) return;
  container.innerHTML = '';
  d.stats.forEach(function(stat) {
    var card = document.createElement('div');
    card.className = 'stat-card';
    var clickHandler = '';
    if (stat.action === 'events') {
      card.setAttribute('onclick', "goPage('events')");
    } else if (stat.action === 'charts') {
      card.setAttribute('onclick', "goPage('charts')");
    } else if (stat.action === 'toast') {
      card.setAttribute('onclick', "toast('" + (stat.actionMsg || '') + "')");
    }
    var changeStyle = stat.changeColor === 'danger' ? ' style="color:var(--danger);"' : '';
    card.innerHTML =
      '<div class="sc-icon" style="background:' + stat.iconBg + ';">' + stat.icon + '</div>' +
      '<div class="sc-val">' + stat.value + (stat.unit ? ' <span style="font-size:14px;">' + stat.unit + '</span>' : '') + '</div>' +
      '<div class="sc-lbl">' + stat.label + '</div>' +
      '<div class="sc-change"' + changeStyle + '>' + stat.change + '</div>';
    container.appendChild(card);
  });
}

function loadStyleOnce(id, href) {
  if (document.getElementById(id)) return Promise.resolve();
  return new Promise(function(resolve, reject) {
    var link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = resolve;
    link.onerror = reject;
    document.head.appendChild(link);
  });
}

function withTimeout(promise, timeoutMs, message) {
  var timer = null;
  return Promise.race([
    promise,
    new Promise(function(_, reject) {
      timer = setTimeout(function() {
        reject(new Error(message || '资源加载超时'));
      }, timeoutMs);
    })
  ]).finally(function() {
    if (timer) clearTimeout(timer);
  });
}

function loadScriptOnce(id, src) {
  var existing = document.getElementById(id);
  if (existing) {
    if (existing.dataset.loaded === 'true') return Promise.resolve();
    return new Promise(function(resolve, reject) {
      existing.addEventListener('load', resolve, { once: true });
      existing.addEventListener('error', reject, { once: true });
    });
  }
  return new Promise(function(resolve, reject) {
    var script = document.createElement('script');
    script.id = id;
    script.src = src;
    script.async = true;
    script.onload = function() {
      script.dataset.loaded = 'true';
      resolve();
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function ensureSceneContainer(mapBg) {
  var sceneDiv = document.getElementById('sceneViewDiv');
  if (!sceneDiv) {
    sceneDiv = document.createElement('div');
    sceneDiv.id = 'sceneViewDiv';
    sceneDiv.className = 'scene-view-div';
    mapBg.insertBefore(sceneDiv, mapBg.firstChild);
  }
  var status = document.getElementById('sceneStatus');
  if (!status) {
    status = document.createElement('div');
    status.id = 'sceneStatus';
    status.className = 'scene-status';
    status.textContent = '建筑白模加载中';
    mapBg.appendChild(status);
  }
  return { sceneDiv: sceneDiv, status: status };
}

function showLightweightMap(reason, detail) {
  var mapBg = document.getElementById('mapBg');
  if (!mapBg) return;
  var parts = ensureSceneContainer(mapBg);
  parts.sceneDiv.classList.remove('ready');
  mapBg.classList.remove(
    'geoscene-ready', 'tiles-ready', 'scene-content-ready', 'cesium-content-ready'
  );
  parts.status.textContent = reason || '三维地图不可用，已显示轻量道路示意图';
  parts.status.title = detail || '';
}

function disposeGeoSceneView() {
  window._geoSceneAbandoned = true;
  if (window._geoSceneRecoveryTimer) {
    clearTimeout(window._geoSceneRecoveryTimer);
    window._geoSceneRecoveryTimer = null;
  }
  var view = window._geoSceneView;
  ['_geoSceneHoverBuildingHighlight', '_geoSceneSelectedBuildingHighlight', '_geoSceneFacilityHighlight'].forEach(function(key) {
    if (window[key]) {
      try { window[key].remove(); } catch (e) {}
      window[key] = null;
    }
  });
  clearGeoSceneBuildingSelectionOverlay();
  disposeWebNavigationLayer();
  if (view) {
    try { view.container = null; } catch (e) {}
    try { view.destroy(); } catch (e) {}
  }
  window._geoSceneView = null;
  window._geoSceneViewReady = false;
  window._geoSceneBuildingReady = false;
  window._geoSceneBuildingLayer = null;
  window._geoSceneLocalBuildingLayer = null;
  window._geoSceneWaterLayerReady = false;
  window._geoSceneWaterLayer = null;
  window._geoSceneEventLayer = null;
  window._geoSceneFacilityLayers = null;
  window._geoSceneSemanticBuildingLayer = null;
  window._geoSceneSemanticRoofLayer = null;
  window._geoSceneBoundaryLayer = null;
  window._geoSceneBuildingSelectionLayer = null;
  window._geoSceneNavigationCasingLayer = null;
  window._geoSceneNavigationLayer = null;
  window._geoSceneMetroConnectionLayer = null;
  window._geoSceneRoadSelectionLayer = null;
  window._geoSceneRoadThemeLayers = null;
  window._geoSceneRoadLayer = null;
  window._geoSceneRoadLayerView = null;
  window._geoSceneRoadLayerReady = false;
  window._geoSceneRoadThemeLayers = null;
  window._geoSceneRoadSelectionLayer = null;
  window._geoSceneBuildingLayerView = null;
  window._geoSceneLocalBuildingLayerView = null;
  window._geoSceneBuildingInteractionsInstalled = false;
  window._geoSceneStarted = false;

  var sceneDiv = document.getElementById('sceneViewDiv');
  if (sceneDiv && sceneDiv.parentNode) {
    // 替换节点以一并移除旧 ArcGIS view 注册在容器上的 WebGL 监听器。
    var cleanSceneDiv = document.createElement('div');
    cleanSceneDiv.id = 'sceneViewDiv';
    cleanSceneDiv.className = 'scene-view-div';
    sceneDiv.parentNode.replaceChild(cleanSceneDiv, sceneDiv);
  }
}

function activateMapFallback(reason, detail) {
  if (window._geoSceneFallbackStarted) return;
  window._geoSceneFallbackStarted = true;
  window._geoSceneFailed = true;
  disposeGeoSceneView();
  showLightweightMap('GeoScene 渲染不可用，正在切换本地白模', detail || reason);

  var mapConfig = APP_DATA && APP_DATA.mapConfig;
  var tiles3d = mapConfig && mapConfig.tiles3d;
  var localBuildings = mapConfig && mapConfig.localBuildings;
  if ((tiles3d && tiles3d.enabled) || (localBuildings && localBuildings.enabled)) {
    initTiles3DMap().then(function(ready) {
      if (!ready) showLightweightMap('三维地图不可用，已显示轻量道路示意图', detail || reason);
    });
    return;
  }
  showLightweightMap('三维地图不可用，已显示轻量道路示意图', detail || reason);
}

function loadCesiumLocalBuildings(Cesium, widget, cfg) {
  var local = cfg && cfg.localBuildings;
  if (!local || !local.enabled || !local.url || !Cesium.GeoJsonDataSource) {
    return Promise.reject(new Error('本地建筑 GeoJSON 不可用'));
  }
  return withTimeout(
    Cesium.GeoJsonDataSource.load(local.url, {
      clampToGround: false,
      stroke: Cesium.Color.TRANSPARENT,
      fill: Cesium.Color.fromCssColorString('#d8e6eb').withAlpha(0.97)
    }),
    MAP_SDK_LOAD_TIMEOUT_MS,
    '本地建筑 GeoJSON 加载超时'
  ).then(function(dataSource) {
    var time = Cesium.JulianDate.now();
    var colors = {
      residential: '#cbd8de',
      commercial: '#bed3dc',
      industrial: '#adbcc3',
      public: '#d6d1df',
      utility: '#94a3ac',
      generic: '#cbd8de'
    };
    dataSource.entities.values.forEach(function(entity) {
      if (!entity.polygon) return;
      var properties = entity.properties;
      var height = properties && properties.height_m ? Number(properties.height_m.getValue(time)) : 12;
      var buildingClass = properties && properties.bldg_class
        ? String(properties.bldg_class.getValue(time) || 'generic')
        : 'generic';
      if (!isFinite(height) || height < 2) height = 12;
      entity.polygon.height = 0;
      entity.polygon.extrudedHeight = height;
      entity.polygon.heightReference = Cesium.HeightReference.NONE;
      entity.polygon.extrudedHeightReference = Cesium.HeightReference.NONE;
      entity.polygon.material = Cesium.Color.fromCssColorString(colors[buildingClass] || colors.generic).withAlpha(0.97);
      entity.polygon.outline = false;
      entity.polygon.shadows = Cesium.ShadowMode.DISABLED;
    });

    var collection = new Cesium.DataSourceCollection();
    var display = new Cesium.DataSourceDisplay({
      scene: widget.scene,
      dataSourceCollection: collection
    });
    return Promise.resolve(collection.add(dataSource)).then(function() {
      var removeTick = widget.clock.onTick.addEventListener(function(clock) {
        display.update(clock.currentTime);
      });
      display.update(time);
      window._tiles3DDataSource = dataSource;
      window._tiles3DDataSourceCollection = collection;
      window._tiles3DDataSourceDisplay = display;
      window._tiles3DDataSourceTickRemover = removeTick;
      return dataSource.entities.values.length;
    });
  });
}

function scheduleGeoSceneRecovery(view, reason, detail) {
  if (!view || window._geoSceneFallbackStarted || window._geoSceneRecoveryTimer) return;
  showLightweightMap('显卡渲染上下文正在恢复', detail || reason);
  try { view.tryFatalErrorRecovery(); } catch (e) {}

  window._geoSceneRecoveryTimer = setTimeout(function() {
    window._geoSceneRecoveryTimer = null;
    var sceneDiv = document.getElementById('sceneViewDiv');
    var recovered = Boolean(
      !view.destroyed && !view.fatalError && sceneDiv && sceneDiv.querySelector('canvas')
    );
    if (recovered) {
      var mapBg = document.getElementById('mapBg');
      sceneDiv.classList.add('ready');
      if (mapBg) {
        mapBg.classList.add('geoscene-ready', 'tiles-ready');
        markGeoSceneContentReady();
      }
      var status = document.getElementById('sceneStatus');
      if (status) status.textContent = getGeoSceneStatusText(createGeoSceneEventGraphics(window._geoSceneModules.Graphic).length);
      if (view.requestRender) view.requestRender();
      return;
    }
    activateMapFallback(reason, detail);
  }, MAP_WEBGL_RECOVERY_TIMEOUT_MS);
}

function ensureSceneEventOverlay(mapBg) {
  var overlay = document.getElementById('sceneEventOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'sceneEventOverlay';
    overlay.className = 'scene-event-overlay';
    mapBg.appendChild(overlay);
  }
  return overlay;
}

function getEventLayerKey(evt) {
  var type = evt && (evt.type || evt.title || '');
  if (type === 'danger' || type.indexOf('被占') >= 0) return 'danger-dots';
  if (type === 'warning' || type.indexOf('损坏') >= 0) return 'warning-dots';
  return 'muted-dots';
}

function isEventLayerVisible(evt) {
  window._eventLayerVisibility = window._eventLayerVisibility || {
    'danger-dots': true,
    'warning-dots': true,
    'muted-dots': true
  };
  return window._eventLayerVisibility[getEventLayerKey(evt)] !== false;
}

function getCesiumEventColor(Cesium, evt) {
  if (evt.id === SELECTED_EVENT_ID) return Cesium.Color.fromCssColorString('#ffffff');
  if (evt.status === '已修复') return Cesium.Color.fromCssColorString('#2ecc71');
  if (evt.status === '驳回') return Cesium.Color.fromCssColorString('#5a6380');
  var key = getEventLayerKey(evt);
  if (key === 'danger-dots') return Cesium.Color.fromCssColorString('#ff4560');
  if (key === 'warning-dots') return Cesium.Color.fromCssColorString('#f0a030');
  return Cesium.Color.fromCssColorString('#5a6380');
}

function getGeoSceneEventColor(evt) {
  if (evt.id === SELECTED_EVENT_ID) return '#ffffff';
  if (evt.status === '已修复') return '#2ecc71';
  if (evt.status === '驳回') return '#5a6380';
  var key = getEventLayerKey(evt);
  if (key === 'danger-dots') return '#ff4560';
  if (key === 'warning-dots') return '#f0a030';
  return '#5a6380';
}

function loadGeoSceneModules() {
  if (window._geoSceneModulesPromise) return window._geoSceneModulesPromise;
  var base = 'https://js.arcgis.com/4.30/';
  var modulePromise = Promise.all([
    loadStyleOnce('geoscene-arcgis-js-css', base + 'esri/themes/dark/main.css'),
    loadScriptOnce('geoscene-arcgis-js', base)
  ]).then(function() {
    return new Promise(function(resolve, reject) {
      var amdRequire = window.require;
      if (!amdRequire) {
        reject(new Error('GeoScene/ArcGIS AMD loader 未就绪'));
        return;
      }
      amdRequire([
        'esri/config',
        'esri/Basemap',
        'esri/Map',
        'esri/WebScene',
        'esri/views/SceneView',
        'esri/layers/VectorTileLayer',
        'esri/layers/WebTileLayer',
        'esri/layers/MapImageLayer',
        'esri/layers/GroupLayer',
        'esri/layers/FeatureLayer',
        'esri/layers/GraphicsLayer',
        'esri/layers/SceneLayer',
        'esri/layers/GeoJSONLayer',
        'esri/Graphic',
        'esri/geometry/support/webMercatorUtils'
      ], function(config, Basemap, Map, WebScene, SceneView, VectorTileLayer, WebTileLayer, MapImageLayer, GroupLayer, FeatureLayer, GraphicsLayer, SceneLayer, GeoJSONLayer, Graphic, webMercatorUtils) {
        resolve({
          config: config,
          Basemap: Basemap,
          Map: Map,
          WebScene: WebScene,
          SceneView: SceneView,
          VectorTileLayer: VectorTileLayer,
          WebTileLayer: WebTileLayer,
          MapImageLayer: MapImageLayer,
          GroupLayer: GroupLayer,
          FeatureLayer: FeatureLayer,
          GraphicsLayer: GraphicsLayer,
          SceneLayer: SceneLayer,
          GeoJSONLayer: GeoJSONLayer,
          Graphic: Graphic,
          webMercatorUtils: webMercatorUtils
        });
      }, reject);
    });
  });
  window._geoSceneModulesPromise = withTimeout(
    modulePromise,
    MAP_SDK_LOAD_TIMEOUT_MS,
    'ArcGIS 地图库加载超时'
  ).catch(function(err) {
    window._geoSceneModulesPromise = null;
    throw err;
  });
  // 超时只负责尽快展示轻量兜底，不取消浏览器已经发出的下载。慢速网络下
  // SDK 后续完成时，自动把轻量地图升级回真实 SceneView。
  modulePromise.then(function(modules) {
    recoverGeoSceneAfterLateSdk(modules);
  }).catch(function() {});
  return window._geoSceneModulesPromise;
}

function recoverGeoSceneAfterLateSdk(modules) {
  if (!modules || !window._geoSceneFailed || window._geoSceneLateRetryStarted) return;
  if (window._geoSceneView || window._tiles3DWidget) return;
  var pendingTiles = window._tiles3DPromise || Promise.resolve(false);
  Promise.resolve(pendingTiles).catch(function() { return false; }).then(function(tilesReady) {
    if (tilesReady || window._geoSceneView || window._tiles3DWidget || window._geoSceneLateRetryStarted) return;
    window._geoSceneLateRetryStarted = true;
    window._geoSceneModules = modules;
    window._geoSceneModulesPromise = Promise.resolve(modules);
    window._geoSceneFailed = false;
    window._geoSceneAbandoned = false;
    showLightweightMap('地图组件已就绪，正在恢复真实三维场景');
    initGeoSceneMap().then(function(ready) {
      if (!ready) initTiles3DMap();
    });
  });
}

function getGeoSceneEventFields() {
  return [
    { name: 'ObjectID', alias: 'ObjectID', type: 'oid' },
    { name: 'event_id', alias: '事件编号', type: 'string', length: 32 },
    { name: 'event_type', alias: '事件类型', type: 'string', length: 40 },
    { name: 'status', alias: '状态', type: 'string', length: 20 },
    { name: 'priority', alias: '优先级', type: 'string', length: 10 },
    { name: 'layer_key', alias: '图层类型', type: 'string', length: 20 },
    { name: 'location', alias: '位置', type: 'string', length: 200 },
    { name: 'reporter', alias: '上报人', type: 'string', length: 80 },
    { name: 'report_time', alias: '上报时间', type: 'string', length: 40 },
    { name: 'description', alias: '问题描述', type: 'string', length: 1000 }
  ];
}

function getTiandituKeyFromConfig(cfg) {
  var basemap = cfg && cfg.basemap;
  var text = (basemap && (basemap.vecUrl || basemap.imgUrl || '')) || '';
  var match = text.match(/[?&]tk=([^&]+)/);
  return match ? match[1] : '';
}

function getTiandituTileUrl(layer, tk, level, row, col) {
  return 'https://t0.tianditu.gov.cn/' + layer + '_w/wmts?' +
    'SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&STYLE=default' +
    '&TILEMATRIXSET=w&FORMAT=tiles&LAYER=' + layer +
    '&TILEMATRIX=' + level + '&TILEROW=' + row + '&TILECOL=' + col +
    '&tk=' + encodeURIComponent(tk);
}

function getGeoSceneVectorTileUrl(cfg) {
  var basemap = cfg && cfg.basemap;
  return (basemap && basemap.vectorTileUrl ? String(basemap.vectorTileUrl).trim() : '');
}

function probeGeoSceneVectorBasemap(cfg) {
  var vectorTileUrl = getGeoSceneVectorTileUrl(cfg);
  if (!vectorTileUrl || !window.fetch) return Promise.resolve(false);
  return withTimeout(
    window.fetch(vectorTileUrl + '?f=json', { cache: 'no-store' }).then(function(response) {
      if (!response.ok) return null;
      return response.json();
    }),
    3500,
    'GeoScene 矢量底图探测超时'
  ).then(function(metadata) {
    return Boolean(
      metadata &&
      typeof metadata.type === 'string' &&
      /vector/i.test(metadata.type) &&
      Array.isArray(metadata.tiles) &&
      metadata.tiles.length > 0
    );
  }).catch(function() {
    return false;
  });
}

function probeTiandituBasemap(cfg) {
  var tk = getTiandituKeyFromConfig(cfg);
  if (!tk) return Promise.resolve(false);
  return new Promise(function(resolve) {
    var settled = false;
    var image = new Image();
    var finish = function(available) {
      if (settled) return;
      settled = true;
      image.onload = null;
      image.onerror = null;
      resolve(available);
    };
    image.crossOrigin = 'anonymous';
    image.onload = function() { finish(true); };
    image.onerror = function() { finish(false); };
    image.src = getTiandituTileUrl('vec', tk, 10, 445, 836);
    setTimeout(function() { finish(false); }, 3500);
  });
}

function createGeoSceneBasemap(modules, cfg) {
  if (!modules.Basemap) return null;
  var vectorTileUrl = getGeoSceneVectorTileUrl(cfg);
  if (cfg && cfg._geosceneBasemapAvailable && vectorTileUrl && modules.VectorTileLayer) {
    window._geoSceneBasemapName = 'GeoScene 深海蓝底图';
    var geoSceneVector = new modules.VectorTileLayer({
      url: vectorTileUrl,
      title: '福田深海蓝矢量底图',
      copyright: 'GeoScene · 深圳福田'
    });
    return new modules.Basemap({
      baseLayers: [geoSceneVector],
      title: 'GeoScene 深海蓝底图',
      id: 'geoscene-deep-sea'
    });
  }

  if (!modules.WebTileLayer) return null;
  var tk = getTiandituKeyFromConfig(cfg);
  if (cfg && cfg._tiandituAvailable && tk) {
    window._geoSceneBasemapName = '天地图';
    var tiandituVector = new modules.WebTileLayer({
      urlTemplate: getTiandituTileUrl('vec', tk, '{level}', '{row}', '{col}'),
      title: '天地图矢量底图',
      copyright: '天地图',
      opacity: 0.72,
      blendMode: 'multiply'
    });
    var tiandituLabels = new modules.WebTileLayer({
      urlTemplate: getTiandituTileUrl('cva', tk, '{level}', '{row}', '{col}'),
      title: '天地图矢量注记',
      copyright: '天地图',
      opacity: 0.72,
      blendMode: 'screen'
    });
    return new modules.Basemap({
      baseLayers: [tiandituVector, tiandituLabels],
      title: '天地图',
      id: 'tianditu-vector'
    });
  }

  window._geoSceneBasemapName = 'OSM 道路底图';
  var osmLayer = new modules.WebTileLayer({
    urlTemplate: 'https://tile.openstreetmap.org/{level}/{col}/{row}.png',
    title: 'OpenStreetMap 道路底图',
    copyright: '© OpenStreetMap contributors',
    opacity: 0.78,
    blendMode: 'multiply'
  });
  return new modules.Basemap({
    baseLayers: [osmLayer],
    title: 'OpenStreetMap',
    id: 'osm-vector'
  });
}

function roadLineSymbol(color, width, style) {
  return {
    type: 'simple-line',
    color: color,
    width: width,
    style: style || 'solid',
    cap: 'round',
    join: 'round'
  };
}

function getRoadHierarchyRenderer() {
  function info(value, label, color, width, style) {
    return { value: value, label: label, symbol: roadLineSymbol(color, width, style) };
  }
  return {
    type: 'unique-value',
    field: 'highway',
    defaultLabel: '其他步行道路',
    defaultSymbol: roadLineSymbol([122, 165, 186, 0.9], 2.4),
    uniqueValueInfos: [
      info('primary', '主干路', [58, 196, 255, 1], 6.2),
      info('primary_link', '主干路连接线', [58, 196, 255, 0.96], 5.2),
      info('secondary', '次干路', [80, 181, 229, 0.98], 5.4),
      info('secondary_link', '次干路连接线', [80, 181, 229, 0.94], 4.6),
      info('tertiary', '三级道路', [102, 196, 218, 0.96], 4.7),
      info('tertiary_link', '三级道路连接线', [102, 196, 218, 0.9], 4.0),
      info('residential', '居住区道路', [137, 181, 199, 0.94], 3.7),
      info('service', '服务道路', [118, 157, 177, 0.88], 3.0),
      info('living_street', '生活街区道路', [78, 225, 190, 0.98], 4.5),
      info('pedestrian', '步行街', [62, 240, 204, 1], 5.2),
      info('footway', '人行道', [107, 222, 255, 0.98], 3.3),
      info('path', '步行小径', [73, 220, 151, 0.96], 3.1),
      info('cycleway', '骑行与步行道', [102, 145, 255, 0.96], 3.5),
      info('steps', '台阶', [255, 82, 116, 1], 4.6, 'short-dash'),
      info('elevator', '电梯连接', [198, 142, 255, 1], 6.4),
      info('corridor', '室内通道', [132, 236, 255, 0.96], 4.0, 'short-dot')
    ]
  };
}

function getRoadCasingRenderer() {
  function info(value, width) {
    return { value: value, symbol: roadLineSymbol([4, 16, 29, 0.96], width) };
  }
  return {
    type: 'unique-value',
    field: 'highway',
    defaultSymbol: roadLineSymbol([4, 16, 29, 0.93], 4.8),
    uniqueValueInfos: [
      info('primary', 10.4), info('primary_link', 9.2),
      info('secondary', 9.4), info('secondary_link', 8.4),
      info('tertiary', 8.2), info('tertiary_link', 7.2),
      info('residential', 6.6), info('service', 5.5),
      info('living_street', 7.5), info('pedestrian', 8.2),
      info('footway', 5.8), info('path', 5.6), info('cycleway', 6.0),
      info('steps', 7.0), info('elevator', 9.0), info('corridor', 6.6)
    ]
  };
}

// 总览阶段只保留一组蓝青色城市骨架；颜色变化主要用来表达层级，
// 不再让每一种道路都变成独立的强光色。
function getRoadTierRenderer(tier) {
  function info(value, label, color, width, style) {
    return { value: value, label: label, symbol: roadLineSymbol(color, width, style) };
  }
  var renderers = {
    major: {
      defaultSymbol: roadLineSymbol([83, 169, 199, 0.82], 3.2),
      uniqueValueInfos: [
        info('primary', '主干路', [42, 211, 255, 1], 5.4),
        info('primary_link', '主干路连接线', [42, 211, 255, 0.96], 4.7),
        info('secondary', '次干路', [71, 190, 232, 0.98], 4.5),
        info('secondary_link', '次干路连接线', [71, 190, 232, 0.92], 4.0),
        info('tertiary', '三级道路', [101, 187, 211, 0.94], 3.8),
        info('tertiary_link', '三级道路连接线', [101, 187, 211, 0.88], 3.3)
      ]
    },
    local: {
      defaultSymbol: roadLineSymbol([102, 145, 164, 0.72], 2.0),
      uniqueValueInfos: [
        info('residential', '居住区道路', [111, 164, 185, 0.86], 2.7),
        info('service', '服务道路', [93, 130, 148, 0.7], 1.9),
        info('living_street', '生活街区道路', [77, 204, 184, 0.9], 3.0),
        info('pedestrian', '步行街', [75, 220, 196, 0.94], 3.3),
        info('cycleway', '骑行与步行道', [93, 156, 220, 0.84], 2.5)
      ]
    },
    detail: {
      defaultSymbol: roadLineSymbol([98, 153, 171, 0.62], 1.5),
      uniqueValueInfos: [
        info('footway', '人行道', [103, 190, 213, 0.76], 1.8),
        info('path', '步行小径', [85, 188, 157, 0.76], 1.7),
        info('steps', '台阶', [255, 111, 135, 0.9], 2.4, 'short-dash'),
        info('elevator', '电梯连接', [190, 145, 241, 0.92], 3.5),
        info('corridor', '室内通道', [111, 201, 218, 0.78], 2.1, 'short-dot')
      ]
    },
    exceptions: {
      defaultSymbol: roadLineSymbol([123, 148, 159, 0.46], 1.3, 'short-dot'),
      uniqueValueInfos: [
        info('residential', '居住区补充道路', [116, 151, 165, 0.52], 1.6),
        info('service', '服务补充道路', [107, 137, 150, 0.46], 1.4),
        info('living_street', '生活街区补充道路', [85, 174, 163, 0.58], 1.8),
        info('pedestrian', '步行补充道路', [85, 181, 170, 0.6], 1.9),
        info('cycleway', '骑行补充道路', [102, 143, 181, 0.52], 1.6)
      ]
    }
  };
  var selected = renderers[tier] || renderers.exceptions;
  return {
    type: 'unique-value',
    field: 'highway',
    defaultLabel: '其他步行道路',
    defaultSymbol: selected.defaultSymbol,
    uniqueValueInfos: selected.uniqueValueInfos
  };
}

function getRoadUnifiedRenderer() {
  var major = getRoadTierRenderer('major');
  var local = getRoadTierRenderer('local');
  var detail = getRoadTierRenderer('detail');
  var exceptions = getRoadTierRenderer('exceptions');
  return {
    type: 'unique-value',
    field: 'highway',
    defaultLabel: '其他近景道路',
    defaultSymbol: exceptions.defaultSymbol,
    uniqueValueInfos: major.uniqueValueInfos.concat(local.uniqueValueInfos, detail.uniqueValueInfos)
  };
}

function getRoadPopupTemplate() {
  return {
    title: '{road_name}',
    outFields: ['*'],
    content: [{ type: 'fields', fieldInfos: [
      { fieldName: 'highway', label: '道路类型' },
      { fieldName: 'risk_score', label: '风险分值' },
      { fieldName: 'risk_reason', label: '风险原因' }
    ] }]
  };
}

function createRoadServiceLayer(MapImageLayer, cfg, options) {
  var layers = cfg.layers;
  var roadLayerId = Number(layers.roadLayerId);
  if (!isFinite(roadLayerId)) roadLayerId = 0;
  return new MapImageLayer({
    url: layers.roadLayerUrl,
    title: options.title,
    opacity: options.opacity,
    minScale: options.minScale,
    maxScale: options.maxScale,
    blendMode: options.blendMode || 'normal',
    visible: Boolean(options.visible),
    popupEnabled: true,
    legendEnabled: false,
    listMode: 'hide',
    sublayers: [{
      id: roadLayerId,
      visible: true,
      definitionExpression: options.definitionExpression || '1=1',
      renderer: options.renderer,
      popupEnabled: true,
      popupTemplate: getRoadPopupTemplate()
    }]
  });
}

function createGeoSceneRoadLayer(modules, cfg) {
  var layers = cfg && cfg.layers;
  if (!modules.MapImageLayer || !modules.GroupLayer || !layers || !layers.roadLayerUrl) return null;
  var casing = createRoadServiceLayer(modules.MapImageLayer, cfg, {
    title: '道路结构底槽', visible: true, opacity: 0.94,
    blendMode: 'normal', renderer: getRoadCasingRenderer()
  });
  var hierarchy = createRoadServiceLayer(modules.MapImageLayer, cfg, {
    title: '道路等级', visible: true, opacity: 0.96, renderer: getRoadHierarchyRenderer()
  });
  var safe = createRoadServiceLayer(modules.MapImageLayer, cfg, {
    title: '条件较好', visible: false, opacity: 0.98,
    definitionExpression: 'prohibited = 0 AND avoid_steps = 0 AND unknown_access = 0 AND risk_score < 3',
    renderer: { type: 'simple', symbol: roadLineSymbol(ROAD_ACCESS_STYLES.safe.rgba, 4.8) }
  });
  var caution = createRoadServiceLayer(modules.MapImageLayer, cfg, {
    title: '需要注意', visible: false, opacity: 1,
    definitionExpression: 'prohibited = 0 AND avoid_steps = 0 AND unknown_access = 0 AND risk_score >= 3',
    renderer: { type: 'simple', symbol: roadLineSymbol(ROAD_ACCESS_STYLES.caution.rgba, 5.4) }
  });
  var unknown = createRoadServiceLayer(modules.MapImageLayer, cfg, {
    title: '信息未知', visible: false, opacity: 0.88,
    definitionExpression: 'prohibited = 0 AND avoid_steps = 0 AND unknown_access = 1',
    renderer: { type: 'simple', symbol: roadLineSymbol(ROAD_ACCESS_STYLES.unknown.rgba, 4.0, 'short-dash') }
  });
  var blocked = createRoadServiceLayer(modules.MapImageLayer, cfg, {
    title: '明显障碍', visible: false, opacity: 1,
    definitionExpression: 'prohibited = 1 OR avoid_steps = 1',
    renderer: { type: 'simple', symbol: roadLineSymbol(ROAD_ACCESS_STYLES.blocked.rgba, 6.2) }
  });
  window._geoSceneRoadThemeLayers = {
    casing: casing,
    hierarchy: hierarchy,
    safe: safe,
    caution: caution,
    unknown: unknown,
    blocked: blocked
  };
  return new modules.GroupLayer({
    title: '深圳福田无障碍道路网络',
    visible: true,
    visibilityMode: 'independent',
    listMode: 'hide',
    layers: [casing, hierarchy, safe, caution, unknown, blocked]
  });
}

function createGeoSceneRoadLayerV4(modules, cfg) {
  var layers = cfg && cfg.layers;
  var policy = window.BlindRoadVisuals;
  if (!modules.MapImageLayer || !modules.GroupLayer || !layers || !layers.roadLayerUrl ||
      !policy || !policy.getRoadLodState) return null;

  var initialState = window.BlindRoadVisuals.getRoadLodState(Number.POSITIVE_INFINITY);
  var visualLayers = {};
  var base = createRoadServiceLayer(modules.MapImageLayer, cfg, {
    title: '城市道路骨架', visible: true, opacity: 0.98,
    minScale: 0,
    definitionExpression: initialState.definitionExpression,
    blendMode: 'normal',
    renderer: getRoadUnifiedRenderer()
  });
  base._roadLodBand = initialState.band;

  var accessScales = policy.ACCESSIBILITY_MIN_SCALES;
  var unknown = createRoadServiceLayer(modules.MapImageLayer, cfg, {
    title: '信息未知（步行近景）', visible: false, opacity: 0.46,
    minScale: accessScales.unknown,
    definitionExpression: 'prohibited = 0 AND avoid_steps = 0 AND unknown_access = 1',
    renderer: { type: 'simple', symbol: roadLineSymbol(ROAD_ACCESS_STYLES.unknown.rgba, 2.2, 'short-dash') }
  });
  var caution = createRoadServiceLayer(modules.MapImageLayer, cfg, {
    title: '需要注意', visible: false, opacity: 0.96,
    minScale: accessScales.caution,
    definitionExpression: 'prohibited = 0 AND avoid_steps = 0 AND unknown_access = 0 AND risk_score >= 3',
    renderer: { type: 'simple', symbol: roadLineSymbol(ROAD_ACCESS_STYLES.caution.rgba, 4.2) }
  });
  var blocked = createRoadServiceLayer(modules.MapImageLayer, cfg, {
    title: '明显障碍', visible: false, opacity: 1,
    minScale: accessScales.blocked,
    definitionExpression: 'prohibited = 1 OR avoid_steps = 1',
    renderer: { type: 'simple', symbol: roadLineSymbol(ROAD_ACCESS_STYLES.blocked.rgba, 5.2) }
  });

  visualLayers.base = base;
  visualLayers.unknown = unknown;
  visualLayers.caution = caution;
  visualLayers.blocked = blocked;
  window._geoSceneRoadThemeLayers = visualLayers;
  window._geoSceneRoadLodBand = initialState.band;

  return new modules.GroupLayer({
    title: '深圳福田无障碍道路网络',
    visible: true,
    visibilityMode: 'independent',
    listMode: 'hide',
    layers: [base, unknown, caution, blocked]
  });
}

function getGeoSceneRoadLayers() {
  var layers = window._geoSceneRoadThemeLayers || {};
  return Object.keys(layers).map(function(key) { return layers[key]; }).filter(Boolean);
}

function getRoadLodBandLabel(band) {
  return {
    major: '区域主干骨架',
    local: '街区连通道路',
    detail: '步行细节道路',
    complete: '全量近景道路'
  }[band] || '分级道路';
}

function updateRoadModeLabelV4() {
  var mode = document.getElementById('roadRenderMode');
  if (!mode) return;
  var label = getRoadLodBandLabel(window._geoSceneRoadLodBand);
  mode.textContent = ACTIVE_MAP_THEME === 'accessible'
    ? '无障碍风险·' + label
    : '城市骨架·' + label;
}

function syncGeoSceneRoadLod(scale) {
  var layers = window._geoSceneRoadThemeLayers || {};
  var policy = window.BlindRoadVisuals;
  if (!layers.base || !policy || !policy.getRoadLodState) return;
  var state = window.BlindRoadVisuals.getRoadLodState(scale);
  if (layers.base._roadLodBand === state.band) return;
  var sublayer = layers.base.sublayers && layers.base.sublayers.getItemAt
    ? layers.base.sublayers.getItemAt(0)
    : null;
  if (!sublayer) return;
  sublayer.definitionExpression = state.definitionExpression;
  layers.base._roadLodBand = state.band;
  window._geoSceneRoadLodBand = state.band;
  updateRoadModeLabelV4();
}

function applyRoadTheme(theme) {
  var layers = window._geoSceneRoadThemeLayers || {};
  var thematic = theme === 'accessible' && Boolean(
    APP_DATA && APP_DATA.mapConfig && APP_DATA.mapConfig.layers && APP_DATA.mapConfig.layers.roadThematicEnabled
  );
  if (layers.hierarchy) layers.hierarchy.visible = !thematic;
  if (layers.casing) {
    layers.casing.visible = true;
    layers.casing.opacity = thematic ? 0.98 : (theme === 'transit' ? 0.74 : 0.94);
  }
  ['safe', 'caution', 'unknown', 'blocked'].forEach(function(key) {
    if (layers[key]) layers[key].visible = thematic;
  });
  if (layers.hierarchy) {
    layers.hierarchy.opacity = theme === 'transit' ? 0.72 : (theme === 'services' ? 0.82 : 0.96);
  }
  var legend = document.getElementById('roadThemeLegend');
  if (legend) legend.classList.toggle('active', thematic);
  var mode = document.getElementById('roadRenderMode');
  if (mode) mode.textContent = thematic ? '无障碍状态双层描边' : '道路骨架双层描边';
}

function applyRoadThemeV4(theme) {
  var layers = window._geoSceneRoadThemeLayers || {};
  var thematic = theme === 'accessible' && Boolean(
    APP_DATA && APP_DATA.mapConfig && APP_DATA.mapConfig.layers && APP_DATA.mapConfig.layers.roadThematicEnabled
  );
  if (layers.base) {
    layers.base.visible = true;
    layers.base.opacity = thematic ? 0.42 : (theme === 'transit' ? 0.72 : (theme === 'services' ? 0.8 : 0.98));
  }
  ['caution', 'unknown', 'blocked'].forEach(function(key) {
    if (layers[key]) layers[key].visible = thematic;
  });
  var legend = document.getElementById('roadThemeLegend');
  if (legend) legend.classList.toggle('active', thematic);
  updateRoadModeLabelV4();
}

function updateMapQualityNote(theme) {
  var note = document.getElementById('mapQualityNote');
  if (!note) return;
  if (!note.dataset.defaultText) note.dataset.defaultText = note.textContent || '空字段按“信息未知”处理';
  note.textContent = theme === 'accessible'
    ? '道路空字段不会被判定为安全：灰色虚线表示无障碍信息不足，颜色只反映已有数据。'
    : note.dataset.defaultText;
}

function markGeoSceneContentReady() {
  if (window._geoSceneAbandoned || !window._geoSceneViewReady || !window._geoSceneBuildingReady) return;
  var mapBg = document.getElementById('mapBg');
  if (mapBg) mapBg.classList.add('scene-content-ready');
}

function addCesiumTiandituBasemap(Cesium, widget, cfg) {
  var tk = getTiandituKeyFromConfig(cfg);
  if (!tk || !Cesium.WebMapTileServiceImageryProvider) return false;

  var common = {
    style: 'default',
    format: 'tiles',
    tileMatrixSetID: 'w',
    maximumLevel: 18,
    credit: new Cesium.Credit('天地图')
  };
  var imagery = new Cesium.WebMapTileServiceImageryProvider(Object.assign({}, common, {
    url: 'https://t0.tianditu.gov.cn/img_w/wmts?tk=' + encodeURIComponent(tk),
    layer: 'img'
  }));
  var labels = new Cesium.WebMapTileServiceImageryProvider(Object.assign({}, common, {
    url: 'https://t0.tianditu.gov.cn/cia_w/wmts?tk=' + encodeURIComponent(tk),
    layer: 'cia'
  }));
  var imageryLayer = widget.imageryLayers.addImageryProvider(imagery);
  imageryLayer.alpha = 0.7;
  imageryLayer.brightness = 0.45;
  imageryLayer.contrast = 1.32;
  imageryLayer.saturation = 0.04;
  imageryLayer.gamma = 0.88;
  var labelLayer = widget.imageryLayers.addImageryProvider(labels);
  labelLayer.alpha = 0.72;
  labelLayer.brightness = 0.78;
  labelLayer.contrast = 1.22;
  labelLayer.saturation = 0.06;
  return true;
}

function addCesiumOpenStreetMapBasemap(Cesium, widget) {
  if (!Cesium.UrlTemplateImageryProvider) return false;
  var provider = new Cesium.UrlTemplateImageryProvider({
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    maximumLevel: 19,
    credit: new Cesium.Credit('© OpenStreetMap contributors')
  });
  var layer = widget.imageryLayers.addImageryProvider(provider);
  layer.alpha = 0.7;
  layer.brightness = 0.45;
  layer.contrast = 1.32;
  layer.saturation = 0.04;
  layer.gamma = 0.88;
  return true;
}

function addCesiumGeoSceneRoadNetwork(Cesium, widget, cfg) {
  var layers = cfg && cfg.layers;
  if (!layers || !layers.roadLayerUrl || !Cesium.ArcGisMapServerImageryProvider) {
    return Promise.resolve(false);
  }
  var roadLayerId = Number(layers.roadLayerId);
  if (!isFinite(roadLayerId)) roadLayerId = 6;
  var options = {
    layers: String(roadLayerId),
    enablePickFeatures: false
  };
  var provider;
  try {
    provider = typeof Cesium.ArcGisMapServerImageryProvider.fromUrl === 'function'
      ? Cesium.ArcGisMapServerImageryProvider.fromUrl(layers.roadLayerUrl, options)
      : new Cesium.ArcGisMapServerImageryProvider(Object.assign({ url: layers.roadLayerUrl }, options));
  } catch (error) {
    console.warn('[Web] 福田路网初始化失败:', error && (error.message || error));
    return Promise.resolve(false);
  }
  return Promise.resolve(provider).then(function(readyProvider) {
    var layer = widget.imageryLayers.addImageryProvider(readyProvider);
    layer.alpha = 0.5;
    layer.brightness = 1.3;
    layer.contrast = 1.18;
    layer.saturation = 0.08;
    layer.gamma = 0.92;
    window._cesiumRoadLayer = layer;
    window._cesiumRoadLayerReady = true;
    widget.scene.requestRender();
    return true;
  }).catch(function(error) {
    console.warn('[Web] 福田路网加载失败:', error && (error.message || error));
    return false;
  });
}

function createGeoSceneEventGraphics(Graphic) {
  if (!APP_DATA || !APP_DATA.dashboard || !APP_DATA.dashboard.map) return [];
  return (APP_DATA.dashboard.map.events || []).map(function(evt, index) {
    var lon = Number(evt.lon);
    var lat = Number(evt.lat);
    if (!isFinite(lon) || !isFinite(lat) || !isEventLayerVisible(evt)) return null;
    return new Graphic({
      geometry: {
        type: 'point',
        longitude: lon,
        latitude: lat,
        z: evt.id === SELECTED_EVENT_ID ? 38 : 24,
        spatialReference: { wkid: 4326 }
      },
      attributes: {
        ObjectID: index + 1,
        event_id: evt.id,
        event_type: evt.title || evt.type || '',
        status: evt.status || '',
        priority: evt.priority || '',
        layer_key: getEventLayerKey(evt),
        location: evt.location || '',
        reporter: evt.reporter || '',
        report_time: evt.time || '',
        description: evt.description || ''
      }
    });
  }).filter(Boolean);
}

function getGeoSceneEventRenderer() {
  function symbol(color, size) {
    return {
      type: 'simple-marker',
      style: 'circle',
      color: color,
      size: size,
      outline: { color: '#ffffff', width: 1.5 }
    };
  }
  return {
    type: 'unique-value',
    field: 'layer_key',
    defaultSymbol: symbol('#5a6380', 13),
    uniqueValueInfos: [
      { value: 'danger-dots', label: '盲道被占', symbol: symbol('#ff4560', 16) },
      { value: 'warning-dots', label: '盲道损坏', symbol: symbol('#f0a030', 15) },
      { value: 'muted-dots', label: '盲道缺失', symbol: symbol('#5a6380', 14) }
    ]
  };
}

function createGeoSceneEventLayer(FeatureLayer, Graphic) {
  return new FeatureLayer({
    title: '无障碍事件点',
    visible: false,
    source: createGeoSceneEventGraphics(Graphic),
    fields: getGeoSceneEventFields(),
    objectIdField: 'ObjectID',
    geometryType: 'point',
    spatialReference: { wkid: 4326 },
    hasZ: true,
    elevationInfo: { mode: 'relative-to-ground', offset: 4 },
    renderer: getGeoSceneEventRenderer(),
    popupTemplate: {
      title: '{event_id} · {event_type}',
      content:
        '<b>状态</b>：{status}<br>' +
        '<b>优先级</b>：{priority}<br>' +
        '<b>位置</b>：{location}<br>' +
        '<b>上报人</b>：{reporter}<br>' +
        '<b>时间</b>：{report_time}<br>' +
        '<b>描述</b>：{description}'
    }
  });
}

function getMapFacilityFeatures() {
  return APP_DATA && APP_DATA.mapFacilities && Array.isArray(APP_DATA.mapFacilities.features)
    ? APP_DATA.mapFacilities.features
    : [];
}

function escapeMapText(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getFacilityFields() {
  return [
    { name: 'ObjectID', alias: 'ObjectID', type: 'oid' },
    { name: 'facility_id', alias: '设施编号', type: 'string', length: 160 },
    { name: 'category', alias: '设施类型代码', type: 'string', length: 40 },
    { name: 'category_label', alias: '设施类型', type: 'string', length: 40 },
    { name: 'name', alias: '名称', type: 'string', length: 240 },
    { name: 'address', alias: '地址', type: 'string', length: 500 },
    { name: 'location', alias: '位置', type: 'string', length: 500 },
    { name: 'wheelchair', alias: '轮椅通行', type: 'string', length: 40 },
    { name: 'accessibility', alias: '无障碍信息', type: 'string', length: 3000 },
    { name: 'station_key', alias: '地铁站关联键', type: 'string', length: 100 },
    { name: 'entrance_ref', alias: '出入口', type: 'string', length: 30 },
    { name: 'lines', alias: '线路', type: 'string', length: 160 },
    { name: 'description', alias: '说明', type: 'string', length: 1000 },
    { name: 'phone', alias: '联系电话', type: 'string', length: 300 },
    { name: 'service_content', alias: '服务内容', type: 'string', length: 1000 },
    { name: 'hospital_level', alias: '医院级别', type: 'string', length: 50 },
    { name: 'hospital_grade', alias: '医院等级', type: 'string', length: 50 },
    { name: 'opening_hours', alias: '开放时间', type: 'string', length: 200 },
    { name: 'fee', alias: '收费信息', type: 'string', length: 50 },
    { name: 'area_m2', alias: '面积', type: 'string', length: 50 },
    { name: 'source', alias: '数据来源', type: 'string', length: 240 },
    { name: 'confidence', alias: '数据置信度', type: 'string', length: 40 },
    { name: 'building_id', alias: '关联建筑', type: 'string', length: 160 },
    { name: 'linked_building', alias: '已融入建筑', type: 'string', length: 8 }
  ];
}

function facilityAttributes(item, objectId) {
  return {
    ObjectID: objectId,
    facility_id: item.id || ('facility-' + objectId),
    category: item.category || '',
    category_label: item.categoryLabel || '',
    name: item.name || item.categoryLabel || '未命名设施',
    address: item.address || '',
    location: item.location || '',
    wheelchair: item.wheelchair || 'unknown',
    accessibility: item.accessibility || '',
    station_key: item.stationKey || '',
    entrance_ref: item.entranceRef || '',
    lines: item.lines || '',
    description: item.description || '',
    phone: item.phone || '',
    service_content: item.serviceContent || '',
    hospital_level: item.hospitalLevel || '',
    hospital_grade: item.hospitalGrade || '',
    opening_hours: item.openingHours || '',
    fee: item.fee || '',
    area_m2: item.areaSquareMeters || '',
    source: item.source || '',
    confidence: item.confidence || '',
    building_id: item.semanticBuildingId || '',
    linked_building: item.semanticBuildingId ? 'yes' : 'no'
  };
}

function getFacilityBadgePath(badge) {
  if (badge === 'diamond') return 'M32 3 L61 32 L32 61 L3 32 Z';
  if (badge === 'vertical') return 'M19 3 H45 Q53 3 53 11 V53 Q53 61 45 61 H19 Q11 61 11 53 V11 Q11 3 19 3 Z';
  if (badge === 'shield') return 'M32 3 L57 13 V32 C57 46 47 56 32 62 C17 56 7 46 7 32 V13 Z';
  if (badge === 'hex') return 'M18 4 H46 L61 32 L46 60 H18 L3 32 Z';
  if (badge === 'square') return 'M11 4 H53 Q60 4 60 11 V53 Q60 60 53 60 H11 Q4 60 4 53 V11 Q4 4 11 4 Z';
  return 'M32 3 A29 29 0 1 1 31.9 3 Z';
}

function getFacilityIconHref(style) {
  var path = getFacilityBadgePath(style.badge);
  var fontSize = String(style.icon || '').length > 1 ? 18 : 29;
  var svg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">' +
      '<defs><filter id="glow" x="-60%" y="-60%" width="220%" height="220%">' +
        '<feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>' +
      '</filter></defs>' +
      '<path d="' + path + '" fill="' + style.color + '" opacity="0.38" filter="url(#glow)"/>' +
      '<path d="' + path + '" fill="#071526" stroke="' + style.color + '" stroke-width="3"/>' +
      '<path d="' + path + '" fill="none" stroke="#ffffff" stroke-opacity="0.28" stroke-width="1" transform="scale(.86) translate(5.2 5.2)"/>' +
      '<text x="32" y="34" dominant-baseline="middle" text-anchor="middle" fill="#f5fcff" ' +
        'font-family="Arial,Microsoft YaHei,sans-serif" font-size="' + fontSize + '" font-weight="800">' + style.icon + '</text>' +
    '</svg>';
  return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
}

function getFacilityPointSymbol(style) {
  return {
    type: 'point-3d',
    symbolLayers: [{
      type: 'icon',
      resource: { href: getFacilityIconHref(style) },
      size: style.size
    }],
    verticalOffset: {
      screenLength: style.size > 15 ? 26 : 18,
      minWorldLength: 8,
      maxWorldLength: 70
    },
    callout: {
      type: 'line',
      color: style.color,
      size: 0.7,
      border: { color: [5, 15, 29, 0.72] }
    }
  };
}

function getFacilityClusterConfig(style) {
  if (!style.cluster) return null;
  return {
    type: 'cluster',
    clusterRadius: style.group === 'transit' ? '58px' : '52px',
    clusterMinSize: 18,
    clusterMaxSize: 34,
    popupEnabled: false,
    labelingInfo: [{
      deconflictionStrategy: 'none',
      labelExpressionInfo: { expression: "Text($feature.cluster_count, '#,###')" },
      symbol: {
        type: 'text',
        color: '#ffffff',
        haloColor: '#071225',
        haloSize: 1,
        font: { size: 9, weight: 'bold' }
      },
      labelPlacement: 'center-center'
    }]
  };
}

function createGeoSceneFacilityLayer(FeatureLayer, Graphic, category) {
  var style = MAP_FACILITY_STYLES[category];
  if (!style) return null;
  var source = [];
  var objectId = 1;
  getMapFacilityFeatures().forEach(function(item) {
    if (item.category !== category) return;
    var lon = Number(item.lon);
    var lat = Number(item.lat);
    if (!isFinite(lon) || !isFinite(lat)) return;
    source.push(new Graphic({
      geometry: {
        type: 'point',
        longitude: lon,
        latitude: lat,
        spatialReference: { wkid: 4326 }
      },
      attributes: facilityAttributes(item, objectId++)
    }));
  });

  var options = {
    title: style.label,
    source: source,
    fields: getFacilityFields(),
    objectIdField: 'ObjectID',
    geometryType: 'point',
    spatialReference: { wkid: 4326 },
    elevationInfo: { mode: 'relative-to-ground', offset: 3 },
    renderer: {
      type: 'simple',
      symbol: getFacilityPointSymbol(style)
    },
    popupEnabled: false,
    legendEnabled: false,
    visible: Boolean(MAP_THEME_VISIBILITY[ACTIVE_MAP_THEME][category]),
    definitionExpression: "linked_building = 'no'"
  };
  if (Number(style.minScale) > 0) options.minScale = Number(style.minScale);
  var clusterConfig = getFacilityClusterConfig(style);
  if (clusterConfig) options.featureReduction = clusterConfig;
  if (category === 'metroStation') {
    options.labelingInfo = [{
      labelExpressionInfo: { expression: '$feature.name' },
      labelPlacement: 'above-center',
      symbol: {
        type: 'label-3d',
        symbolLayers: [{
          type: 'text',
          material: { color: '#dff8ff' },
          halo: { color: '#061224', size: 1.2 },
          size: 9
        }],
        verticalOffset: { screenLength: 34, minWorldLength: 15, maxWorldLength: 90 },
        callout: { type: 'line', color: [0, 212, 255, 0.45], size: 0.5 }
      }
    }];
  }
  return new FeatureLayer(options);
}

function createGeoSceneBoundaryLayer(modules) {
  var boundary = APP_DATA && APP_DATA.mapFacilities && APP_DATA.mapFacilities.boundary;
  var geometry = boundary && boundary.geometry;
  if (!geometry || !modules.GraphicsLayer || !modules.Graphic) return null;
  var rings = [];
  if (geometry.type === 'Polygon') {
    rings = geometry.coordinates || [];
  } else if (geometry.type === 'MultiPolygon') {
    (geometry.coordinates || []).forEach(function(polygon) {
      rings = rings.concat(polygon || []);
    });
  }
  if (!rings.length) return null;
  var layer = new modules.GraphicsLayer({
    title: (boundary.name || '福田区') + '边界',
    elevationInfo: { mode: 'on-the-ground' },
    visible: true
  });
  layer.add(new modules.Graphic({
    geometry: { type: 'polygon', rings: rings, spatialReference: { wkid: 4326 } },
    symbol: {
      type: 'simple-fill',
      color: [0, 212, 255, 0.025],
      outline: { color: [0, 212, 255, 0.86], width: 1.4 }
    },
    attributes: { name: boundary.name || '福田区' }
  }));
  return layer;
}

function getMapBuildingSemantics() {
  return APP_DATA && APP_DATA.buildingSemantics && Array.isArray(APP_DATA.buildingSemantics.features)
    ? APP_DATA.buildingSemantics.features
    : [];
}

function getSemanticBuildingFields() {
  return [
    { name: 'ObjectID', alias: 'ObjectID', type: 'oid' },
    { name: 'building_id', alias: '建筑编号', type: 'string', length: 160 },
    { name: 'building_name', alias: '建筑名称', type: 'string', length: 240 },
    { name: 'building_class', alias: '建筑类别', type: 'string', length: 60 },
    { name: 'height_m', alias: '建筑高度', type: 'double' },
    { name: 'visual_height_m', alias: '表现高度', type: 'double' },
    { name: 'centroid_lon', alias: '中心经度', type: 'double' },
    { name: 'centroid_lat', alias: '中心纬度', type: 'double' },
    { name: 'primary_category', alias: '主设施类别', type: 'string', length: 40 },
    { name: 'primary_label', alias: '主设施类型', type: 'string', length: 60 },
    { name: 'facility_count', alias: '设施数量', type: 'integer' },
    { name: 'accessible_count', alias: '已知无障碍设施数量', type: 'integer' },
    { name: 'categories', alias: '设施类别集合', type: 'string', length: 240 },
    { name: 'facility_ids', alias: '设施编号集合', type: 'string', length: 3000 },
    { name: 'facility_names', alias: '设施名称', type: 'string', length: 3000 },
    { name: 'match_method', alias: '匹配方式', type: 'string', length: 20 }
  ];
}

function semanticBuildingAttributes(properties, objectId) {
  return {
    ObjectID: objectId,
    building_id: properties.building_id || ('semantic-building-' + objectId),
    building_name: properties.building_name || '',
    building_class: properties.building_class || 'generic',
    height_m: Number(properties.height_m || 12),
    visual_height_m: Number(properties.visual_height_m || properties.height_m || 15),
    centroid_lon: Number(properties.centroid_lon || 0),
    centroid_lat: Number(properties.centroid_lat || 0),
    primary_category: properties.primary_category || '',
    primary_label: properties.primary_label || '',
    facility_count: Number(properties.facility_count || 0),
    accessible_count: Number(properties.accessible_count || 0),
    categories: properties.categories || '',
    facility_ids: properties.facility_ids || '',
    facility_names: properties.facility_names || '',
    match_method: properties.match_method || 'inside'
  };
}

function getSemanticBuildingSymbol(style) {
  var rgba = style.rgba || [0, 212, 255];
  return {
    type: 'polygon-3d',
    symbolLayers: [{
      type: 'extrude',
      material: { color: [rgba[0], rgba[1], rgba[2], 0.22] },
      edges: {
        type: 'solid',
        color: [rgba[0], rgba[1], rgba[2], 0.94],
        size: 1.15
      },
      castShadows: false
    }]
  };
}

function getSemanticBuildingRenderer() {
  var infos = Object.keys(MAP_FACILITY_STYLES).map(function(category) {
    var style = MAP_FACILITY_STYLES[category];
    return {
      value: category,
      label: style.label + '语义建筑',
      symbol: getSemanticBuildingSymbol(style)
    };
  });
  return {
    type: 'unique-value',
    field: 'primary_category',
    defaultSymbol: getSemanticBuildingSymbol({ rgba: [0, 212, 255] }),
    uniqueValueInfos: infos,
    visualVariables: [{
      type: 'size',
      field: 'visual_height_m',
      valueUnit: 'meters'
    }]
  };
}

function createSemanticBuildingLayers(modules) {
  var features = getMapBuildingSemantics();
  if (!features.length || !modules.FeatureLayer || !modules.Graphic) return null;
  var polygons = [];
  var roofs = [];
  features.forEach(function(feature, index) {
    var geometry = feature.geometry || {};
    var properties = feature.properties || {};
    var rings = geometry.coordinates || [];
    if (geometry.type !== 'Polygon' || !rings.length) return;
    var attributes = semanticBuildingAttributes(properties, index + 1);
    polygons.push(new modules.Graphic({
      geometry: { type: 'polygon', rings: rings, spatialReference: { wkid: 4326 } },
      attributes: attributes
    }));
    var lon = Number(properties.centroid_lon);
    var lat = Number(properties.centroid_lat);
    if (!isFinite(lon) || !isFinite(lat)) return;
    roofs.push(new modules.Graphic({
      geometry: {
        type: 'point',
        longitude: lon,
        latitude: lat,
        z: Number(properties.visual_height_m || properties.height_m || 15) + 5,
        spatialReference: { wkid: 4326 }
      },
      attributes: attributes
    }));
  });

  var shellLayer = new modules.FeatureLayer({
    title: '设施语义建筑光层',
    source: polygons,
    fields: getSemanticBuildingFields(),
    objectIdField: 'ObjectID',
    geometryType: 'polygon',
    spatialReference: { wkid: 4326 },
    elevationInfo: { mode: 'relative-to-ground', offset: 0.6 },
    renderer: getSemanticBuildingRenderer(),
    outFields: ['*'],
    popupEnabled: false,
    legendEnabled: false
  });

  var roofInfos = Object.keys(MAP_FACILITY_STYLES).map(function(category) {
    var style = MAP_FACILITY_STYLES[category];
    return {
      value: category,
      label: style.label,
      symbol: {
        type: 'point-3d',
        symbolLayers: [{
          type: 'icon',
          resource: { href: getFacilityIconHref(style) },
          size: style.size + 7
        }],
        verticalOffset: { screenLength: 8, minWorldLength: 3, maxWorldLength: 18 },
        callout: { type: 'line', color: style.color, size: 1.1 }
      }
    };
  });
  var roofLayer = new modules.FeatureLayer({
    title: '语义建筑屋顶徽标',
    source: roofs,
    fields: getSemanticBuildingFields(),
    objectIdField: 'ObjectID',
    geometryType: 'point',
    spatialReference: { wkid: 4326 },
    hasZ: true,
    elevationInfo: { mode: 'relative-to-ground' },
    renderer: {
      type: 'unique-value',
      field: 'primary_category',
      defaultSymbol: roofInfos[0] && roofInfos[0].symbol,
      uniqueValueInfos: roofInfos
    },
    outFields: ['*'],
    labelingInfo: [{
      minScale: 52000,
      labelExpressionInfo: {
        expression: "When(IsEmpty($feature.building_name), $feature.facility_names, $feature.building_name)"
      },
      labelPlacement: 'above-center',
      symbol: {
        type: 'label-3d',
        symbolLayers: [{
          type: 'text',
          material: { color: '#eafaff' },
          halo: { color: '#061224', size: 1.2 },
          size: 9,
          font: { weight: 'bold' }
        }],
        verticalOffset: { screenLength: 27, minWorldLength: 8, maxWorldLength: 42 },
        callout: { type: 'line', color: [118, 205, 228, 0.4], size: 0.5 }
      }
    }],
    popupEnabled: false,
    legendEnabled: false
  });
  return { shell: shellLayer, roof: roofLayer };
}

function getSemanticThemeCategories(theme) {
  if (theme === 'transit') return ['metroStation'];
  if (theme === 'services') return ['hospital', 'rehab', 'toilet'];
  if (theme === 'accessible') return ['metroStation', 'hospital', 'rehab', 'toilet'];
  return ['metroStation', 'hospital', 'rehab'];
}

function applySemanticBuildingTheme(theme) {
  var layers = getGeoSceneSemanticLayers();
  if (!layers.length) return;
  var categories = getSemanticThemeCategories(theme);
  var expression = categories.length
    ? "primary_category IN ('" + categories.join("','") + "')"
    : '1=0';
  var manuallyVisible = !window._mapLayerVisibility || window._mapLayerVisibility.semantic !== false;
  layers.forEach(function(layer) {
    layer.definitionExpression = expression;
    layer.visible = manuallyVisible;
  });
}

function getGeoSceneSemanticLayers() {
  return [window._geoSceneSemanticBuildingLayer, window._geoSceneSemanticRoofLayer].filter(Boolean);
}

function addGeoSceneContextLayers(map, modules) {
  window._geoSceneFacilityLayers = {};
  var boundaryLayer = createGeoSceneBoundaryLayer(modules);
  if (boundaryLayer) {
    map.add(boundaryLayer);
    window._geoSceneBoundaryLayer = boundaryLayer;
    boundaryLayer.visible = window._mapLayerVisibility.boundary !== false;
  }

  var semanticLayers = createSemanticBuildingLayers(modules);
  if (semanticLayers) {
    map.add(semanticLayers.shell);
    map.add(semanticLayers.roof);
    window._geoSceneSemanticBuildingLayer = semanticLayers.shell;
    window._geoSceneSemanticRoofLayer = semanticLayers.roof;
    applySemanticBuildingTheme(ACTIVE_MAP_THEME);
  }

  Object.keys(MAP_FACILITY_STYLES).forEach(function(category) {
    var layer = createGeoSceneFacilityLayer(modules.FeatureLayer, modules.Graphic, category);
    if (!layer) return;
    map.add(layer);
    window._geoSceneFacilityLayers[category] = layer;
    layer.visible = window._mapLayerVisibility[category] !== false;
    layer.when().catch(function(error) {
      console.warn('[Web] ' + MAP_FACILITY_STYLES[category].label + '图层加载失败:', error && (error.message || error));
    });
  });

  if (modules.GraphicsLayer) {
    window._geoSceneBuildingSelectionLayer = new modules.GraphicsLayer({
      title: '当前选中建筑',
      listMode: 'hide',
      visible: window._mapLayerVisibility.buildings !== false,
      elevationInfo: { mode: 'relative-to-ground', offset: 0 }
    });
    map.add(window._geoSceneBuildingSelectionLayer);
    window._geoSceneNavigationCasingLayer = new modules.GraphicsLayer({
      title: '导航路线描边',
      listMode: 'hide',
      elevationInfo: { mode: 'relative-to-ground', offset: 1.5 }
    });
    map.add(window._geoSceneNavigationCasingLayer);
    window._geoSceneNavigationLayer = new modules.GraphicsLayer({
      title: '导航测试路线',
      listMode: 'hide',
      elevationInfo: { mode: 'relative-to-ground', offset: 3.5 }
    });
    map.add(window._geoSceneNavigationLayer);
    window._geoSceneRoadSelectionLayer = new modules.GraphicsLayer({
      title: '当前选中道路',
      listMode: 'hide',
      elevationInfo: { mode: 'relative-to-ground', offset: 2.2 }
    });
    map.add(window._geoSceneRoadSelectionLayer);
    window._geoSceneMetroConnectionLayer = new modules.GraphicsLayer({
      title: '地铁站出入口关联',
      elevationInfo: { mode: 'relative-to-ground', offset: 1.5 }
    });
    map.add(window._geoSceneMetroConnectionLayer);
  }
}

function clearMetroConnections() {
  var layer = window._geoSceneMetroConnectionLayer;
  if (layer && layer.removeAll) layer.removeAll();
}

function findMapFacility(facilityId) {
  return getMapFacilityFeatures().find(function(item) { return item.id === facilityId; }) || null;
}

function showMetroConnections(station) {
  clearMetroConnections();
  var layer = window._geoSceneMetroConnectionLayer;
  var modules = window._geoSceneModules;
  if (!layer || !modules || !modules.Graphic || !station || !station.stationKey) return 0;
  var entrances = getMapFacilityFeatures().filter(function(item) {
    return item.category === 'metroEntrance' && item.stationKey === station.stationKey;
  });
  var graphics = entrances.map(function(entrance) {
    return new modules.Graphic({
      geometry: {
        type: 'polyline',
        paths: [[[Number(station.lon), Number(station.lat)], [Number(entrance.lon), Number(entrance.lat)]]],
        spatialReference: { wkid: 4326 }
      },
      symbol: {
        type: 'simple-line',
        color: [73, 229, 197, 0.82],
        width: 1.5,
        style: 'short-dot'
      },
      attributes: { station_key: station.stationKey, entrance_ref: entrance.entranceRef || '' }
    });
  });
  if (graphics.length) layer.addMany(graphics);
  return entrances.length;
}

function getWheelchairDisplay(value) {
  var normalized = String(value || 'unknown').toLowerCase();
  if (normalized === 'yes' || normalized === 'designated') return '已记录无障碍条件';
  if (normalized === 'limited') return '部分无障碍';
  if (normalized === 'no') return '存在通行限制';
  return '信息未知';
}

function focusMapFacility(facilityId) {
  var item = findMapFacility(facilityId);
  if (!item || !window._geoSceneView) return;
  window._geoSceneView.goTo({
    position: { longitude: Number(item.lon), latitude: Number(item.lat), z: 520 },
    heading: 0,
    tilt: 63
  }, { duration: 850 }).catch(function() {});
}

function getRoadAccessStatus(attributes) {
  var attrs = attributes || {};
  if (Number(attrs.prohibited || 0) === 1 || Number(attrs.avoid_steps || 0) === 1) return 'blocked';
  if (Number(attrs.unknown_access || 0) === 1) return 'unknown';
  if (Number(attrs.risk_score || 0) >= 3) return 'caution';
  return 'safe';
}

function getRoadReasonText(value) {
  var labels = {
    steps: '包含台阶',
    sidewalk_unknown: '机动车道路的人行空间未明确',
    rough_surface: '路面材质可能影响通行',
    poor_smoothness: '路面平整度较差',
    unlit: '缺少照明',
    uncontrolled_crossing: '无信号或无控制过街'
  };
  var reasons = String(value || '').split(';').filter(Boolean).map(function(item) {
    return labels[item] || item;
  });
  return reasons.length ? reasons.join('；') : '未记录明确风险项，仍应结合现场情况判断';
}

function getRoadFieldDisplay(value, dictionary) {
  if (value === null || typeof value === 'undefined' || String(value).trim() === '') return '未标注';
  var normalized = String(value).trim().toLowerCase();
  return dictionary && dictionary[normalized] ? dictionary[normalized] : String(value);
}

function clearSelectedRoad() {
  var layer = window._geoSceneRoadSelectionLayer;
  if (layer && layer.removeAll) layer.removeAll();
}

function highlightSelectedRoad(graphic) {
  clearSelectedRoad();
  var layer = window._geoSceneRoadSelectionLayer;
  var modules = window._geoSceneModules;
  if (!layer || !modules || !modules.Graphic || !graphic || !graphic.geometry) return;
  layer.addMany([
    new modules.Graphic({
      geometry: graphic.geometry,
      symbol: roadLineSymbol([2, 12, 24, 0.98], 11.5)
    }),
    new modules.Graphic({
      geometry: graphic.geometry,
      symbol: roadLineSymbol([245, 253, 255, 1], 5.4)
    })
  ]);
}

function isRoadGraphic(graphic) {
  if (!graphic) return false;
  var layers = getGeoSceneRoadLayers();
  if (layers.indexOf(graphic.layer) >= 0) return true;
  if (graphic.sourceLayer && layers.indexOf(graphic.sourceLayer.layer) >= 0) return true;
  var attrs = graphic.attributes || {};
  return Boolean(
    Object.prototype.hasOwnProperty.call(attrs, 'highway') &&
    (Object.prototype.hasOwnProperty.call(attrs, 'osm_id') ||
      Object.prototype.hasOwnProperty.call(attrs, 'length_m') ||
      Object.prototype.hasOwnProperty.call(attrs, 'risk_score'))
  );
}

function roadGeometryDistanceSquared(geometry, point) {
  if (!geometry || !geometry.paths || !point) return Number.POSITIVE_INFINITY;
  var best = Number.POSITIVE_INFINITY;
  geometry.paths.forEach(function(path) {
    for (var i = 1; i < path.length; i += 1) {
      var ax = Number(path[i - 1][0]);
      var ay = Number(path[i - 1][1]);
      var bx = Number(path[i][0]);
      var by = Number(path[i][1]);
      var dx = bx - ax;
      var dy = by - ay;
      var lengthSquared = dx * dx + dy * dy;
      var t = lengthSquared ? ((Number(point.x) - ax) * dx + (Number(point.y) - ay) * dy) / lengthSquared : 0;
      t = Math.max(0, Math.min(1, t));
      var px = ax + t * dx;
      var py = ay + t * dy;
      var distanceSquared = Math.pow(Number(point.x) - px, 2) + Math.pow(Number(point.y) - py, 2);
      if (distanceSquared < best) best = distanceSquared;
    }
  });
  return best;
}

function identifyRoadAtMapPoint(view, event) {
  var configLayers = APP_DATA && APP_DATA.mapConfig && APP_DATA.mapConfig.layers;
  var roadGroup = window._geoSceneRoadLayer;
  if (!configLayers || !configLayers.roadLayerUrl || !roadGroup || !roadGroup.visible || !event.mapPoint || !view.extent) {
    return Promise.resolve(null);
  }
  var point = event.mapPoint;
  var sr = point.spatialReference || view.spatialReference;
  var wkid = sr && (sr.latestWkid || sr.wkid);
  var spatialReference = wkid ? { wkid: wkid } : (sr && sr.toJSON ? sr.toJSON() : undefined);
  var geometry = { x: Number(point.x), y: Number(point.y), spatialReference: spatialReference };
  var extent = view.extent.toJSON ? view.extent.toJSON() : {
    xmin: view.extent.xmin, ymin: view.extent.ymin,
    xmax: view.extent.xmax, ymax: view.extent.ymax,
    spatialReference: spatialReference
  };
  var body = new URLSearchParams();
  body.set('f', 'json');
  body.set('geometry', JSON.stringify(geometry));
  body.set('geometryType', 'esriGeometryPoint');
  if (wkid) body.set('sr', String(wkid));
  body.set('layers', 'all:' + Number(configLayers.roadLayerId || 0));
  body.set('tolerance', String(ROAD_IDENTIFY_TOLERANCE_PX));
  body.set('mapExtent', JSON.stringify(extent));
  body.set('imageDisplay', [Math.max(1, Number(view.width || 1200)), Math.max(1, Number(view.height || 700)), 96].join(','));
  body.set('returnGeometry', 'true');
  body.set('returnFieldName', 'true');
  return fetch(configLayers.roadLayerUrl.replace(/\/$/, '') + '/identify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    body: body.toString()
  }).then(function(response) {
    if (!response.ok) throw new Error('Road identify HTTP ' + response.status);
    return response.json();
  }).then(function(payload) {
    var results = (payload && payload.results) || [];
    var roadResults = results.filter(function(result) {
      return result && result.geometry && result.geometry.paths && result.attributes;
    });
    if (!roadResults.length || !window._geoSceneModules || !window._geoSceneModules.Graphic) return null;
    roadResults.sort(function(a, b) {
      return roadGeometryDistanceSquared(a.geometry, point) - roadGeometryDistanceSquared(b.geometry, point);
    });
    var selected = roadResults[0];
    var selectedGeometry = Object.assign({ type: 'polyline' }, selected.geometry);
    if (!selectedGeometry.spatialReference && spatialReference) selectedGeometry.spatialReference = spatialReference;
    return new window._geoSceneModules.Graphic({
      geometry: selectedGeometry,
      attributes: selected.attributes
    });
  }).catch(function(error) {
    console.warn('[Web] 道路 Identify 查询失败:', error && (error.message || error));
    return null;
  });
}

function selectRoadGraphic(view, event, graphic) {
  if (!graphic || !graphic.attributes) return false;
  highlightGeoSceneFacility(view, null);
  clearMetroConnections();
  clearGeoSceneBuildingHighlight(true);
  highlightSelectedRoad(graphic);
  showRoadPopup(graphic, { x: event.x, y: event.y });
  return true;
}

function showRoadPopup(graphic, point) {
  if (!graphic || !graphic.attributes) return;
  clearMapPopups();
  var map = document.getElementById('dashMap');
  if (!map) return;
  var attrs = graphic.attributes;
  var statusKey = getRoadAccessStatus(attrs);
  var status = ROAD_ACCESS_STYLES[statusKey];
  var roadType = ROAD_HIGHWAY_LABELS[String(attrs.highway || '').toLowerCase()] || getRoadFieldDisplay(attrs.highway);
  var title = attrs.road_name || roadType + '片段';
  var length = Number(attrs.length_m);
  var walkMinutes = Number(attrs.walk_min);
  var safeMinutes = Number(attrs.safe_min);
  var yesNo = { yes: '是', no: '否', designated: '指定通行', limited: '部分支持', unknown: '未知' };
  var surfaceLabels = {
    asphalt: '沥青', concrete: '混凝土', paving_stones: '铺装石', cobblestone: '鹅卵石',
    gravel: '碎石', fine_gravel: '细碎石', ground: '自然地面', dirt: '土路', unpaved: '未铺装'
  };
  var crossingLabels = {
    traffic_signals: '信号灯控制', controlled: '受控过街', uncontrolled: '无控制过街',
    unmarked: '无标线过街', marked: '有标线过街', zebra: '斑马线'
  };
  var rows = [
    ['道路类型', roadType],
    ['线段长度', isFinite(length) ? length.toFixed(length < 100 ? 1 : 0) + ' 米' : '未标注'],
    ['普通步行', isFinite(walkMinutes) ? walkMinutes.toFixed(1) + ' 分钟' : '未标注'],
    ['安全成本', isFinite(safeMinutes) ? safeMinutes.toFixed(1) + ' 分钟' : '未标注'],
    ['路面材质', getRoadFieldDisplay(attrs.surface, surfaceLabels)],
    ['照明情况', getRoadFieldDisplay(attrs.lit, yesNo)],
    ['触觉铺装', getRoadFieldDisplay(attrs.tactile, yesNo)],
    ['过街方式', getRoadFieldDisplay(attrs.crossing, crossingLabels)]
  ];
  var confidence = getRoadFieldDisplay(attrs.confidence, { high: '高', medium: '中', low: '低' });
  var popup = document.createElement('div');
  popup.className = 'facility-map-popup-web road-map-popup-web';
  popup.style.setProperty('--facility-color', status.color);
  popup.innerHTML =
    '<div class="pop-close" title="关闭">✕</div>' +
    '<div class="facility-popup-kicker">道路信息 · ' + escapeMapText(status.label) + '</div>' +
    '<div class="pop-title">' + escapeMapText(title) + '</div>' +
    '<div class="road-status-banner status-' + statusKey + '"><span></span><b>' + escapeMapText(status.label) + '</b>' +
      '<small>风险分 ' + Number(attrs.risk_score || 0).toFixed(1) + '</small></div>' +
    '<div class="facility-popup-grid road-popup-grid">' + rows.map(function(row) {
      return '<span class="key">' + escapeMapText(row[0]) + '</span><span class="value">' + escapeMapText(row[1]) + '</span>';
    }).join('') + '</div>' +
    '<div class="road-risk-note"><small>判断依据</small>' + escapeMapText(getRoadReasonText(attrs.risk_reason)) + '</div>' +
    '<div class="road-data-meta"><span>数据可信度：' + escapeMapText(confidence) + '</span><span>OSM ' + escapeMapText(attrs.osm_id || '未记录') + '</span></div>' +
    '<div class="facility-popup-actions"><button class="mini-btn accent road-focus-btn" type="button">聚焦此路段</button></div>';
  map.appendChild(popup);
  var x = point && isFinite(Number(point.x)) ? Number(point.x) : map.clientWidth / 2;
  var y = point && isFinite(Number(point.y)) ? Number(point.y) : map.clientHeight / 2;
  popup.style.left = Math.max(12, Math.min(x + 14, map.clientWidth - Math.min(374, map.clientWidth - 20))) + 'px';
  popup.style.top = Math.max(12, Math.min(y - 80, map.clientHeight - Math.min(popup.offsetHeight + 12, map.clientHeight - 20))) + 'px';
  popup.querySelector('.pop-close').addEventListener('click', function(event) {
    popup.remove();
    clearSelectedRoad();
    event.stopPropagation();
  });
  popup.querySelector('.road-focus-btn').addEventListener('click', function(event) {
    if (window._geoSceneView && graphic.geometry) {
      window._geoSceneView.goTo({
        target: graphic.geometry,
        scale: Math.max(Math.min(Number(window._geoSceneView.scale || 9000) / 2, 5000), 900)
      }, { duration: 750 }).catch(function() {});
    }
    event.stopPropagation();
  });
}

function showMapFacilityPopup(item, point) {
  if (!item) return;
  clearMapPopups();
  var map = document.getElementById('dashMap');
  if (!map) return;
  var style = MAP_FACILITY_STYLES[item.category] || { color: '#00d4ff', label: item.categoryLabel || '设施' };
  var entranceCount = item.category === 'metroStation' ? showMetroConnections(item) : 0;
  if (item.category !== 'metroStation') clearMetroConnections();

  var rows = [];
  function addRow(key, value) {
    if (!value) return;
    rows.push('<span class="key">' + escapeMapText(key) + '</span><span class="value">' + escapeMapText(value) + '</span>');
  }
  addRow('类别', item.categoryLabel || style.label);
  addRow('线路', item.lines);
  addRow('出入口', item.entranceRef ? item.entranceRef + '口' : '');
  addRow('关联出口', entranceCount ? entranceCount + '个' : '');
  addRow('位置', item.address || item.location);
  addRow('联系电话', item.phone);
  addRow('医院等级', [item.hospitalLevel, item.hospitalGrade].filter(Boolean).join(' '));
  addRow('服务内容', item.serviceContent);
  addRow('开放时间', item.openingHours);
  addRow('面积', item.areaSquareMeters ? Number(item.areaSquareMeters).toLocaleString() + '㎡' : '');
  addRow('数据来源', item.source);

  var accessText = item.accessibility || getWheelchairDisplay(item.wheelchair);
  var accessUnknown = !item.accessibility && String(item.wheelchair || '').toLowerCase() === 'unknown';
  var popup = document.createElement('div');
  popup.className = 'facility-map-popup-web';
  popup.style.setProperty('--facility-color', style.color);
  popup.innerHTML =
    '<div class="pop-close" title="关闭">✕</div>' +
    '<div class="facility-popup-kicker">' + escapeMapText(style.label || item.categoryLabel) + '</div>' +
    '<div class="pop-title">' + escapeMapText(item.name) + '</div>' +
    '<div class="facility-popup-grid">' + rows.join('') + '</div>' +
    '<div class="facility-access-card' + (accessUnknown ? ' unknown' : '') + '">♿ ' + escapeMapText(accessText) + '</div>' +
    '<div class="facility-popup-actions"><button class="mini-btn accent" type="button">聚焦此设施</button>' +
    (item.category === 'metroStation' ? '<button class="mini-btn metro-links-btn" type="button">显示相关出入口</button>' : '') +
    '</div>';
  map.appendChild(popup);

  var x = point && isFinite(Number(point.x)) ? Number(point.x) : map.clientWidth / 2;
  var y = point && isFinite(Number(point.y)) ? Number(point.y) : map.clientHeight / 2;
  popup.style.left = Math.max(12, Math.min(x + 14, map.clientWidth - Math.min(344, map.clientWidth - 20))) + 'px';
  popup.style.top = Math.max(12, Math.min(y - 40, map.clientHeight - Math.min(popup.offsetHeight + 12, map.clientHeight - 20))) + 'px';
  popup.querySelector('.pop-close').addEventListener('click', function(event) {
    popup.remove();
    event.stopPropagation();
  });
  popup.querySelector('.mini-btn.accent').addEventListener('click', function(event) {
    focusMapFacility(item.id);
    event.stopPropagation();
  });
  var linksButton = popup.querySelector('.metro-links-btn');
  if (linksButton) linksButton.addEventListener('click', function(event) {
    var count = showMetroConnections(item);
    setMapDataLayerVisibility('metroEntrance', true);
    toast('已连接 ' + count + ' 个相关出入口');
    event.stopPropagation();
  });
}

function findMapSemanticBuilding(buildingId) {
  return getMapBuildingSemantics().find(function(feature) {
    return feature && feature.properties && feature.properties.building_id === buildingId;
  }) || null;
}

function focusSemanticBuilding(properties) {
  if (!window._geoSceneView || !properties) return;
  var lon = Number(properties.centroid_lon);
  var lat = Number(properties.centroid_lat);
  if (!isFinite(lon) || !isFinite(lat)) return;
  window._geoSceneView.goTo({
    position: { longitude: lon, latitude: lat, z: Math.max(Number(properties.height_m || 20) * 3.2, 360) },
    heading: 0,
    tilt: 66
  }, { duration: 900 }).catch(function() {});
}

function showSemanticBuildingPopup(properties, point) {
  if (!properties) return;
  clearMapPopups();
  var map = document.getElementById('dashMap');
  if (!map) return;
  var style = MAP_FACILITY_STYLES[properties.primary_category] || MAP_FACILITY_STYLES.metroStation;
  var facilityIds = String(properties.facility_ids || '').split('|').filter(Boolean);
  var facilities = facilityIds.map(findMapFacility).filter(Boolean);
  var names = facilities.map(function(item) { return item.name; }).filter(Boolean);
  if (!names.length && properties.facility_names) names = String(properties.facility_names).split('、');
  var title = properties.building_name || (names[0] ? names[0] + '所在建筑' : style.label + '语义建筑');
  var categoryLabels = Array.from(new Set(facilities.map(function(item) {
    return item.categoryLabel || (MAP_FACILITY_STYLES[item.category] && MAP_FACILITY_STYLES[item.category].label);
  }).filter(Boolean)));
  if (!categoryLabels.length) categoryLabels = [properties.primary_label || style.label];
  var popup = document.createElement('div');
  popup.className = 'facility-map-popup-web semantic-building-popup-web';
  popup.style.setProperty('--facility-color', style.color);
  popup.innerHTML =
    '<div class="pop-close" title="关闭">✕</div>' +
    '<div class="facility-popup-kicker">语义建筑 · ' + escapeMapText(style.label) + '</div>' +
    '<div class="pop-title">' + escapeMapText(title) + '</div>' +
    '<div class="semantic-building-stats">' +
      '<span><b>' + Number(properties.facility_count || facilities.length) + '</b>关联设施</span>' +
      '<span><b>' + Number(properties.accessible_count || 0) + '</b>已知无障碍</span>' +
      '<span><b>' + Number(properties.height_m || 0).toFixed(0) + 'm</b>建筑高度</span>' +
    '</div>' +
    '<div class="semantic-chip-row">' + categoryLabels.map(function(label) {
      return '<span>' + escapeMapText(label) + '</span>';
    }).join('') + '</div>' +
    '<div class="semantic-facility-list"><small>建筑内及关联设施</small>' +
      names.slice(0, 6).map(function(name) { return '<div>◆ ' + escapeMapText(name) + '</div>'; }).join('') +
    '</div>' +
    '<div class="semantic-match-note">' +
      (properties.match_method === 'inside' ? '设施点位于建筑轮廓内' : '设施按限定距离关联至最近建筑') +
    '</div>' +
    '<div class="facility-popup-actions"><button class="mini-btn accent semantic-focus-btn" type="button">聚焦这栋建筑</button></div>';
  map.appendChild(popup);
  var x = point && isFinite(Number(point.x)) ? Number(point.x) : map.clientWidth / 2;
  var y = point && isFinite(Number(point.y)) ? Number(point.y) : map.clientHeight / 2;
  popup.style.left = Math.max(12, Math.min(x + 14, map.clientWidth - Math.min(354, map.clientWidth - 20))) + 'px';
  popup.style.top = Math.max(12, Math.min(y - 55, map.clientHeight - Math.min(popup.offsetHeight + 12, map.clientHeight - 20))) + 'px';
  popup.querySelector('.pop-close').addEventListener('click', function(event) {
    popup.remove();
    event.stopPropagation();
  });
  popup.querySelector('.semantic-focus-btn').addEventListener('click', function(event) {
    focusSemanticBuilding(properties);
    event.stopPropagation();
  });
}

function highlightGeoSceneFacility(view, graphic) {
  if (window._geoSceneFacilityHighlight) {
    try { window._geoSceneFacilityHighlight.remove(); } catch (e) {}
    window._geoSceneFacilityHighlight = null;
  }
  if (!view || !graphic || !graphic.layer) return;
  view.whenLayerView(graphic.layer).then(function(layerView) {
    window._geoSceneFacilityHighlight = layerView.highlight(graphic);
  }).catch(function() {});
}

function findNearestVisibleFacilityAtScreen(view, event, maxPixels) {
  if (!view || !event) return null;
  var best = null;
  var bestDistance = Number(maxPixels || 38);
  Object.keys(window._geoSceneFacilityLayers || {}).forEach(function(category) {
    var layer = window._geoSceneFacilityLayers[category];
    if (!layer || !layer.visible || !layer.source || !layer.source.forEach) return;
    layer.source.forEach(function(graphic) {
      if (graphic.attributes && graphic.attributes.linked_building === 'yes') return;
      var screen = view.toScreen(graphic.geometry);
      if (!screen) return;
      var dx = Number(screen.x) - Number(event.x);
      var dy = Number(screen.y) - Number(event.y);
      var distance = Math.sqrt(dx * dx + dy * dy);
      if (distance > bestDistance) return;
      var item = findMapFacility(graphic.attributes && graphic.attributes.facility_id);
      if (!item) return;
      bestDistance = distance;
      best = { graphic: graphic, item: item };
    });
  });
  return best;
}

function getGeoSceneStatusText(eventCount) {
  var basemapName = window._geoSceneBasemapName || '道路底图';
  var waterName = window._geoSceneWaterLayer
    ? (window._geoSceneWaterLayerReady ? ' · 动态水面' : ' · 动态水面加载中')
    : '';
  var roadName = window._geoSceneRoadLayer
    ? (window._geoSceneRoadLayerReady ? ' · 福田路网' : ' · 福田路网加载中')
    : '';
  var local = APP_DATA && APP_DATA.mapConfig && APP_DATA.mapConfig.localBuildings;
  var buildingCount = Number(local && local.featureCount) || 8897;
  var facilityCount = getMapFacilityFeatures().filter(function(item) {
    return window._mapLayerVisibility && window._mapLayerVisibility[item.category] && !item.semanticBuildingId;
  }).length;
  var semanticCategories = getSemanticThemeCategories(ACTIVE_MAP_THEME);
  var semanticCount = getMapBuildingSemantics().filter(function(feature) {
    return feature && feature.properties && semanticCategories.indexOf(feature.properties.primary_category) >= 0;
  }).length;
  var semanticText = semanticCount && (!window._mapLayerVisibility || window._mapLayerVisibility.semantic !== false)
    ? ' · ' + semanticCount.toLocaleString() + ' 栋语义建筑'
    : '';
  var facilityText = facilityCount ? ' · ' + facilityCount.toLocaleString() + ' 个独立设施' : '';
  if (window._geoSceneLocalBuildingLayer) {
    return basemapName + waterName + roadName + ' · 完整白模 ' + buildingCount.toLocaleString() + ' 栋' + semanticText + facilityText + ' · ' + eventCount + ' 个事件';
  }
  if (window._geoSceneBuildingLayer) {
    return basemapName + waterName + roadName + ' · 完整白模 ' + buildingCount.toLocaleString() + ' 栋（分块加载）' + semanticText + facilityText + ' · ' + eventCount + ' 个事件';
  }
  return basemapName + waterName + roadName + ' · SceneView' + semanticText + facilityText + ' · ' + eventCount + ' 个事件';
}

function getSceneEventSignature() {
  var events = APP_DATA && APP_DATA.dashboard && APP_DATA.dashboard.map
    ? (APP_DATA.dashboard.map.events || [])
    : [];
  return JSON.stringify({
    selected: SELECTED_EVENT_ID || '',
    visibility: window._eventLayerVisibility || {},
    events: events.map(function(evt) {
      return [
        evt.id, evt.lon, evt.lat, evt.title, evt.type, evt.status, evt.priority,
        evt.location, evt.reporter, evt.time, evt.description,
        isEventLayerVisible(evt)
      ];
    })
  });
}

function getLocalBuildingSymbol(color) {
  return {
    type: 'polygon-3d',
    symbolLayers: [{
      type: 'extrude',
      material: { color: color },
      edges: {
        type: 'solid',
        color: [40, 91, 112, 0.24],
        size: 0.34
      }
    }]
  };
}

function getGeoSceneBuildingRenderer(theme) {
  var palette = {
    overview: { color: [194, 214, 226, 0.97], edge: [48, 105, 126, 0.34] },
    accessible: { color: [142, 166, 179, 0.9], edge: [54, 142, 145, 0.34] },
    transit: { color: [157, 181, 195, 0.92], edge: [42, 112, 151, 0.3] },
    services: { color: [169, 190, 202, 0.93], edge: [66, 112, 131, 0.3] }
  }[theme || ACTIVE_MAP_THEME] || { color: [194, 214, 226, 0.97], edge: [48, 105, 126, 0.34] };
  return {
    type: 'simple',
    symbol: {
      type: 'mesh-3d',
      symbolLayers: [{
        type: 'fill',
        material: {
          color: palette.color,
          colorMixMode: 'replace'
        },
        edges: {
          type: 'solid',
          color: palette.edge,
          size: 0.42
        },
        castShadows: true
      }]
    }
  };
}

function getLocalBuildingRenderer(heightField) {
  function buildingMaterial(value, label, color) {
    return {
      value: value,
      label: label,
      symbol: getLocalBuildingSymbol(color)
    };
  }

  return {
    type: 'unique-value',
    field: 'bldg_class',
    defaultSymbol: getLocalBuildingSymbol([203, 216, 222, 0.96]),
    uniqueValueInfos: [
      buildingMaterial('residential', '住宅建筑', [203, 216, 222, 0.96]),
      buildingMaterial('commercial', '商业建筑', [190, 211, 220, 0.97]),
      buildingMaterial('industrial', '工业建筑', [173, 188, 195, 0.96]),
      buildingMaterial('public', '公共建筑', [214, 209, 223, 0.97]),
      buildingMaterial('utility', '附属建筑', [148, 163, 172, 0.94]),
      buildingMaterial('generic', '其他建筑', [203, 216, 222, 0.96])
    ],
    visualVariables: [{
      type: 'size',
      field: heightField,
      valueUnit: 'meters'
    }]
  };
}

function createLocalBuildingLayer(GeoJSONLayer, cfg) {
  var local = cfg && cfg.localBuildings;
  if (!GeoJSONLayer || !local || !local.enabled || !local.url) return null;
  var heightField = local.heightField || 'height_m';
  return new GeoJSONLayer({
    url: local.url,
    title: local.name || '福田区建筑白模',
    visible: !window._mapLayerVisibility || window._mapLayerVisibility.buildings !== false,
    geometryType: 'polygon',
    outFields: [
      'building_id', 'name', 'building', 'bldg_class',
      'height_m', 'levels_est', 'footprint_area_m2'
    ],
    legendEnabled: false,
    elevationInfo: { mode: 'relative-to-ground', offset: 0 },
    renderer: getLocalBuildingRenderer(heightField),
    popupTemplate: {
      title: '建筑 {building_id}',
      content: [{
        type: 'fields',
        fieldInfos: [
          { fieldName: 'name', label: '建筑名称' },
          { fieldName: 'building', label: '建筑类型' },
          { fieldName: 'bldg_class', label: '建筑分类' },
          { fieldName: 'height_m', label: '建筑高度（米）', format: { places: 1, digitSeparator: true } },
          { fieldName: 'levels_est', label: '估算楼层', format: { places: 0, digitSeparator: true } },
          { fieldName: 'footprint_area_m2', label: '基底面积（平方米）', format: { places: 1, digitSeparator: true } },
          { fieldName: 'height_source', label: '高度来源' },
          { fieldName: 'source', label: '数据来源' }
        ]
      }]
    }
  });
}

function addLocalBuildingLayer(map, modules, cfg, reason) {
  if (window._geoSceneAbandoned) return null;
  if (window._geoSceneLocalBuildingLayer) return window._geoSceneLocalBuildingLayer;
  var layer = createLocalBuildingLayer(modules.GeoJSONLayer, cfg);
  if (!layer) return null;
  map.add(layer, 0);
  window._geoSceneLocalBuildingLayer = layer;
  var status = document.getElementById('sceneStatus');
  if (status) status.textContent = '福田建筑白模加载中';
  layer.when(function() {
    if (window._geoSceneAbandoned) return;
    window._geoSceneBuildingReady = true;
    markGeoSceneContentReady();
    var currentStatus = document.getElementById('sceneStatus');
    var eventCount = createGeoSceneEventGraphics(modules.Graphic).length;
    if (currentStatus) {
      currentStatus.textContent = getGeoSceneStatusText(eventCount);
      currentStatus.title = reason || '浏览器端 GeoJSON 高度拉伸';
    }
  }).catch(function(err) {
    if (window._geoSceneAbandoned) return;
    var currentStatus = document.getElementById('sceneStatus');
    if (currentStatus) {
      currentStatus.textContent = '建筑白模加载失败，事件图层仍可使用';
      currentStatus.title = (err && (err.message || err.toString())) || 'unknown';
    }
    console.warn('[Web] 本地 GeoJSON 白模加载失败:', err && (err.message || err));
  });
  return layer;
}

function getGeoSceneBuildingLayers() {
  return [window._geoSceneBuildingLayer, window._geoSceneLocalBuildingLayer].filter(Boolean);
}

function getGeoSceneBuildingSignature(graphic) {
  if (!graphic) return '';
  var objectId = graphic.getObjectId ? graphic.getObjectId() : null;
  if (objectId == null && graphic.attributes) {
    objectId = graphic.attributes.ObjectID || graphic.attributes.OBJECTID || graphic.attributes.objectid;
  }
  var layerId = graphic.layer && (graphic.layer.id || graphic.layer.title || graphic.layer.url);
  return String(layerId || 'building') + ':' + String(objectId == null ? '' : objectId);
}

function clearGeoSceneBuildingHighlight(selected) {
  var handleKey = selected ? '_geoSceneSelectedBuildingHighlight' : '_geoSceneHoverBuildingHighlight';
  var signatureKey = selected ? '_geoSceneSelectedBuildingSignature' : '_geoSceneHoverBuildingSignature';
  var requestKey = selected ? '_geoSceneSelectedHighlightRequest' : '_geoSceneHoverHighlightRequest';
  window[requestKey] = (window[requestKey] || 0) + 1;
  if (window[handleKey]) {
    try { window[handleKey].remove(); } catch (e) {}
  }
  window[handleKey] = null;
  window[signatureKey] = '';
  if (selected) clearGeoSceneBuildingSelectionOverlay();
}

function setGeoSceneBuildingHighlight(view, graphic, selected) {
  if (!view || !graphic || !graphic.layer) return;
  var handleKey = selected ? '_geoSceneSelectedBuildingHighlight' : '_geoSceneHoverBuildingHighlight';
  var signatureKey = selected ? '_geoSceneSelectedBuildingSignature' : '_geoSceneHoverBuildingSignature';
  var requestKey = selected ? '_geoSceneSelectedHighlightRequest' : '_geoSceneHoverHighlightRequest';
  var signature = getGeoSceneBuildingSignature(graphic);
  if (signature && window[signatureKey] === signature) return;
  clearGeoSceneBuildingHighlight(selected);
  var requestId = window[requestKey];
  view.whenLayerView(graphic.layer).then(function(layerView) {
    if (window._geoSceneAbandoned || window[requestKey] !== requestId) return;
    window[handleKey] = layerView.highlight(graphic);
    window[signatureKey] = signature;
    if (graphic.layer === window._geoSceneBuildingLayer) window._geoSceneBuildingLayerView = layerView;
    if (graphic.layer === window._geoSceneLocalBuildingLayer) window._geoSceneLocalBuildingLayerView = layerView;
  }).catch(function() {});
}

function clearGeoSceneBuildingSelectionOverlay() {
  if (window._geoSceneBuildingSelectionLayer && window._geoSceneBuildingSelectionLayer.removeAll) {
    window._geoSceneBuildingSelectionLayer.removeAll();
  }
}

function showGeoSceneBuildingSelectionOverlay(highlight) {
  var layer = window._geoSceneBuildingSelectionLayer;
  var modules = window._geoSceneModules || {};
  var geometry = highlight && highlight.geometry;
  if (!layer || !modules.Graphic || !geometry || geometry.type !== 'Polygon') {
    clearGeoSceneBuildingSelectionOverlay();
    return false;
  }
  var rings = geometry.coordinates;
  if (!Array.isArray(rings) || !rings.length || !Array.isArray(rings[0]) || rings[0].length < 3) {
    clearGeoSceneBuildingSelectionOverlay();
    return false;
  }
  var height = Number(highlight.heightM);
  var minHeight = Number(highlight.minHeightM);
  if (!isFinite(height) || height <= 0) height = 12;
  if (!isFinite(minHeight) || minHeight < 0) minHeight = 0;
  var extrusionHeight = Math.max(1, height - minHeight);
  layer.elevationInfo = { mode: 'relative-to-ground', offset: minHeight + 1.2 };
  layer.visible = window._mapLayerVisibility.buildings !== false;
  window._geoSceneBuildingSelectionLayer.removeAll();
  layer.add(new modules.Graphic({
    geometry: {
      type: 'polygon',
      rings: rings,
      spatialReference: { wkid: 4326 }
    },
    symbol: {
      type: 'polygon-3d',
      symbolLayers: [{
        type: 'extrude',
        size: extrusionHeight,
        material: { color: [0, 232, 255, 0.72] },
        edges: {
          type: 'solid',
          color: [218, 253, 255, 0.98],
          size: 2.3
        }
      }]
    },
    attributes: {
      building_id: highlight.buildingId || ''
    }
  }));
  return true;
}

function installGeoSceneBuildingInteractions(view, sceneDiv) {
  if (!view || !sceneDiv || window._geoSceneBuildingInteractionsInstalled) return;
  window._geoSceneBuildingInteractionsInstalled = true;
  var latestPointer = null;
  var framePending = false;
  var moveSequence = 0;

  view.on('pointer-move', function(event) {
    latestPointer = event;
    moveSequence += 1;
    if (framePending) return;
    framePending = true;
    requestAnimationFrame(function() {
      framePending = false;
      var pointer = latestPointer;
      var sequence = moveSequence;
      var layers = getGeoSceneBuildingLayers();
      if (!pointer || !layers.length || window._geoSceneAbandoned) return;
      view.hitTest(pointer, { include: layers }).then(function(response) {
        if (sequence !== moveSequence || window._geoSceneAbandoned) return;
        var buildingHit = (response.results || []).find(function(item) {
          return item.graphic && layers.indexOf(item.graphic.layer) >= 0;
        });
        if (buildingHit && buildingHit.graphic) {
          sceneDiv.style.setProperty('--map-interaction-cursor', 'pointer');
          setGeoSceneBuildingHighlight(view, buildingHit.graphic, false);
        } else {
          sceneDiv.style.removeProperty('--map-interaction-cursor');
          clearGeoSceneBuildingHighlight(false);
        }
      }).catch(function() {});
    });
  });

  sceneDiv.addEventListener('pointerleave', function() {
    sceneDiv.style.removeProperty('--map-interaction-cursor');
    clearGeoSceneBuildingHighlight(false);
  });
}

var BUILDING_TYPE_LABELS = {
  residential: '住宅建筑',
  apartments: '住宅建筑',
  commercial: '商业建筑',
  retail: '商业建筑',
  office: '办公建筑',
  public: '公共建筑',
  civic: '公共建筑',
  school: '教育建筑',
  hospital: '医疗建筑',
  industrial: '工业建筑',
  warehouse: '仓储建筑',
  utility: '附属建筑',
  generic: '其他建筑',
  yes: '一般建筑'
};

function getWgs84BuildingPoint(point) {
  if (!point) return null;
  var longitude = Number(point.longitude);
  var latitude = Number(point.latitude);
  if (isFinite(longitude) && isFinite(latitude)) {
    return { longitude: longitude, latitude: latitude };
  }
  var modules = window._geoSceneModules || {};
  var webMercatorUtils = modules.webMercatorUtils;
  if (webMercatorUtils && point.spatialReference && webMercatorUtils.isWebMercator(point.spatialReference)) {
    try {
      var geographic = webMercatorUtils.webMercatorToGeographic(point);
      longitude = Number(geographic.longitude != null ? geographic.longitude : geographic.x);
      latitude = Number(geographic.latitude != null ? geographic.latitude : geographic.y);
      if (isFinite(longitude) && isFinite(latitude)) {
        return { longitude: longitude, latitude: latitude };
      }
    } catch (error) {}
  }
  longitude = Number(point.x);
  latitude = Number(point.y);
  if (isFinite(longitude) && isFinite(latitude) && Math.abs(longitude) <= 180 && Math.abs(latitude) <= 90) {
    return { longitude: longitude, latitude: latitude };
  }
  return null;
}

function getBuildingDisplayValue(value, suffix) {
  if (value == null || value === '' || (typeof value === 'number' && !isFinite(value))) return '暂无数据';
  return String(value) + (suffix || '');
}

function showBuildingInfoPopup(state, payload, point) {
  clearMapPopups(true);
  var map = document.getElementById('dashMap');
  if (!map) return;
  var popup = document.createElement('div');
  popup.className = 'facility-map-popup-web building-info-popup-web state-' + state;
  popup.style.setProperty('--facility-color', '#72dff3');
  var body = '';
  if (state === 'loading') {
    body =
      '<div class="facility-popup-kicker">建筑白模</div>' +
      '<div class="pop-title">正在读取建筑信息…</div>' +
      '<div class="facility-access-card unknown">正在匹配 8,897 栋建筑属性</div>';
  } else if (state === 'success' && payload && payload.building) {
    var building = payload.building;
    var typeKey = String(building.buildingClass || building.buildingType || '').toLowerCase();
    var typeLabel = BUILDING_TYPE_LABELS[typeKey] || building.buildingClass || building.buildingType || '暂无数据';
    var roofLabel = { flat: '平屋顶', gabled: '双坡屋顶', hipped: '四坡屋顶', pyramidal: '锥形屋顶' }[String(building.roofShape || '').toLowerCase()] || building.roofShape;
    var rows = [
      ['建筑类型', typeLabel],
      ['建筑高度', getBuildingDisplayValue(building.heightM, ' 米')],
      ['估算楼层', getBuildingDisplayValue(building.estimatedLevels, ' 层')],
      ['占地面积', getBuildingDisplayValue(building.footprintAreaM2, ' ㎡')],
      ['屋顶类型', roofLabel || '暂无数据'],
      ['数据来源', building.source || '暂无数据'],
      ['高度来源', building.heightSource || '暂无数据'],
      ['建筑编号', building.buildingId || '暂无数据']
    ];
    body =
      '<div class="facility-popup-kicker">建筑白模 · ' + escapeMapText(payload.matchType === 'nearest' ? '邻近匹配' : '轮廓匹配') + '</div>' +
      '<div class="pop-title">' + escapeMapText(building.name || '未命名建筑') + '</div>' +
      '<div class="facility-popup-grid building-popup-grid">' + rows.map(function(row) {
        return '<span class="key">' + escapeMapText(row[0]) + '</span><span class="value">' + escapeMapText(row[1]) + '</span>';
      }).join('') + '</div>' +
      (payload.matchType === 'nearest'
        ? '<div class="semantic-match-note">点击位置距建筑轮廓约 ' + escapeMapText(getBuildingDisplayValue(payload.distanceMeters, ' 米')) + '</div>'
        : '<div class="semantic-match-note">点击位置位于建筑轮廓内</div>');
  } else if (state === 'unmatched') {
    body =
      '<div class="facility-popup-kicker">建筑白模</div>' +
      '<div class="pop-title">建筑属性暂未匹配</div>' +
      '<div class="facility-access-card unknown">已识别白模，但附近没有对应的属性轮廓</div>';
  } else {
    body =
      '<div class="facility-popup-kicker">建筑白模</div>' +
      '<div class="pop-title">建筑信息服务暂不可用</div>' +
      '<div class="facility-access-card unknown">白模仍可浏览，请稍后再次点击</div>';
  }
  popup.innerHTML = '<div class="pop-close" title="关闭">✕</div>' + body;
  map.appendChild(popup);
  var x = point && isFinite(Number(point.x)) ? Number(point.x) : map.clientWidth / 2;
  var y = point && isFinite(Number(point.y)) ? Number(point.y) : map.clientHeight / 2;
  popup.style.left = Math.max(12, Math.min(x + 14, map.clientWidth - Math.min(364, map.clientWidth - 20))) + 'px';
  popup.style.top = Math.max(12, Math.min(y - 55, map.clientHeight - Math.min(popup.offsetHeight + 12, map.clientHeight - 20))) + 'px';
  popup.querySelector('.pop-close').addEventListener('click', function(event) {
    window._buildingIdentifyRequestId = (window._buildingIdentifyRequestId || 0) + 1;
    popup.remove();
    clearGeoSceneBuildingHighlight(true);
    event.stopPropagation();
  });
}

function identifyGeoSceneBuildingAtHit(view, event, graphic) {
  var requestId = (window._buildingIdentifyRequestId || 0) + 1;
  window._buildingIdentifyRequestId = requestId;
  clearSelectedRoad();
  clearMetroConnections();
  highlightGeoSceneFacility(view, null);
  setGeoSceneBuildingHighlight(view, graphic, true);
  var screenPoint = { x: event.x, y: event.y };
  showBuildingInfoPopup('loading', null, screenPoint);

  var mapPoint = event.mapPoint;
  if (!mapPoint && view && view.toMap) {
    try { mapPoint = view.toMap(screenPoint); } catch (error) {}
  }
  var coordinates = getWgs84BuildingPoint(mapPoint);
  if (!coordinates) {
    clearGeoSceneBuildingSelectionOverlay();
    showBuildingInfoPopup('error', null, screenPoint);
    return Promise.resolve(null);
  }
  var apiBase = getWebApiBase(APP_DATA);
  var url = apiBase + '/api/web/map/buildings/identify?longitude=' +
    encodeURIComponent(coordinates.longitude.toFixed(7)) + '&latitude=' +
    encodeURIComponent(coordinates.latitude.toFixed(7));
  return fetchWebJSON(url, { headers: authHeaders() }).then(function(result) {
    if (requestId !== window._buildingIdentifyRequestId) return null;
    if (result && result.matched && result.building) {
      showGeoSceneBuildingSelectionOverlay(result.highlight);
      showBuildingInfoPopup('success', result, screenPoint);
    } else {
      clearGeoSceneBuildingSelectionOverlay();
      showBuildingInfoPopup('unmatched', result, screenPoint);
    }
    return result;
  }).catch(function(error) {
    if (requestId !== window._buildingIdentifyRequestId) return null;
    console.warn('[Web] 建筑属性查询失败:', error && (error.message || error));
    clearGeoSceneBuildingSelectionOverlay();
    showBuildingInfoPopup('error', null, screenPoint);
    return null;
  });
}

function getWebNavigationElement(id) {
  return document.getElementById(id);
}

function setWebNavigationSelecting(selecting) {
  var map = getWebNavigationElement('mapBg');
  if (map) map.classList.toggle('web-navigation-selecting', Boolean(selecting));
}

function formatWebNavigationPoint(point) {
  if (!point) return '等待选择';
  return Number(point.lon).toFixed(6) + '°E, ' + Number(point.lat).toFixed(6) + '°N';
}

function updateWebNavigationPanel(message, errorMessage) {
  var hint = getWebNavigationElement('webNavigationHint');
  var origin = getWebNavigationElement('webNavigationOrigin');
  var destination = getWebNavigationElement('webNavigationDestination');
  var error = getWebNavigationElement('webNavigationError');
  if (hint && message) hint.textContent = message;
  if (origin) origin.textContent = formatWebNavigationPoint(WEB_NAVIGATION_STATE.origin);
  if (destination) destination.textContent = formatWebNavigationPoint(WEB_NAVIGATION_STATE.destination);
  if (error) {
    error.textContent = errorMessage || '';
    error.hidden = !errorMessage;
  }
}

function formatWebNavigationDistance(meters) {
  meters = Number(meters || 0);
  return meters >= 1000 ? (meters / 1000).toFixed(2) + ' km' : Math.round(meters) + ' m';
}

function formatWebNavigationDuration(seconds) {
  var minutes = Math.max(1, Math.round(Number(seconds || 0) / 60));
  return minutes + ' 分钟';
}

function getWebNavigationNearbyEventCount(route) {
  var events = (APP_DATA && APP_DATA.events) || [];
  if (!Array.isArray(route) || !route.length) return 0;
  return events.filter(function(item) {
    if (item.status === '已修复' || item.status === '驳回') return false;
    var pair = String(item.coords || '').split(',').map(Number);
    if (pair.length < 2 || !isFinite(pair[0]) || !isFinite(pair[1])) return false;
    return route.some(function(point) {
      var latitude = (pair[1] + Number(point.lat)) * Math.PI / 360;
      var dx = (pair[0] - Number(point.lon)) * Math.cos(latitude) * 111320;
      var dy = (pair[1] - Number(point.lat)) * 110540;
      return Math.sqrt(dx * dx + dy * dy) <= 60;
    });
  }).length;
}

function renderWebNavigationResult(result) {
  var summary = getWebNavigationElement('webNavigationSummary');
  if (!summary) return;
  if (!result) {
    summary.innerHTML = '<span class="web-navigation-route-sample"></span><span>黄色路线将在求解后缓缓延伸</span>';
    return;
  }
  var snapInfo = result.snapInfo || [];
  var maxSnap = snapInfo.reduce(function(maximum, item) {
    return Math.max(maximum, Number(item.distanceMeters || 0));
  }, 0);
  var riskCount = getWebNavigationNearbyEventCount(result.route || []);
  summary.innerHTML = '<div class="web-navigation-metrics">' +
    '<div class="web-navigation-metric"><small>路线距离</small><b>' + escapeMapText(formatWebNavigationDistance(result.distanceMeters)) + '</b></div>' +
    '<div class="web-navigation-metric"><small>预计时间</small><b>' + escapeMapText(formatWebNavigationDuration(result.durationSeconds)) + '</b></div>' +
    '<div class="web-navigation-metric"><small>附近未解决事件</small><b>' + riskCount + ' 个</b></div>' +
    '<div class="web-navigation-metric"><small>最大吸附距离</small><b>' + Math.round(maxSnap * 10) / 10 + ' m</b></div>' +
    '<div class="web-navigation-metric"><small>路线引擎</small><b>GeoScene</b></div>' +
    '<div class="web-navigation-metric"><small>演示方式</small><b>黄色延伸</b></div>' +
    '</div>';
}

function cancelWebNavigationAnimation() {
  if (WEB_NAVIGATION_STATE.animationFrame !== null) {
    cancelAnimationFrame(WEB_NAVIGATION_STATE.animationFrame);
    WEB_NAVIGATION_STATE.animationFrame = null;
  }
}

function clearWebNavigationRouteGraphics() {
  cancelWebNavigationAnimation();
  var layer = window._geoSceneNavigationLayer;
  var casingLayer = window._geoSceneNavigationCasingLayer;
  if (casingLayer && casingLayer.remove && WEB_NAVIGATION_STATE.routeGraphics[0]) {
    try { casingLayer.remove(WEB_NAVIGATION_STATE.routeGraphics[0]); } catch (error) {}
  }
  if (layer && layer.remove && WEB_NAVIGATION_STATE.routeGraphics[1]) {
    try { layer.remove(WEB_NAVIGATION_STATE.routeGraphics[1]); } catch (error) {}
  }
  WEB_NAVIGATION_STATE.routeGraphics = [];
}

function clearAllWebNavigationGraphics() {
  cancelWebNavigationAnimation();
  if (window._geoSceneNavigationLayer && window._geoSceneNavigationLayer.removeAll) {
    window._geoSceneNavigationLayer.removeAll();
  }
  if (window._geoSceneNavigationCasingLayer && window._geoSceneNavigationCasingLayer.removeAll) {
    window._geoSceneNavigationCasingLayer.removeAll();
  }
  WEB_NAVIGATION_STATE.markerGraphics = [];
  WEB_NAVIGATION_STATE.routeGraphics = [];
}

function createWebNavigationMarker(point, role) {
  var modules = window._geoSceneModules || {};
  if (!modules.Graphic || !point) return null;
  var isOrigin = role === 'origin';
  return new modules.Graphic({
    geometry: {
      type: 'point', longitude: point.lon, latitude: point.lat,
      spatialReference: { wkid: 4326 }
    },
    symbol: {
      type: 'point-3d',
      symbolLayers: [{
        type: 'icon', resource: { primitive: 'circle' },
        material: { color: isOrigin ? '#4bea8d' : '#ff6178' },
        size: 15,
        outline: { color: '#f4ffff', size: 1.5 }
      }],
      verticalOffset: { screenLength: 18, maxWorldLength: 45, minWorldLength: 4 },
      callout: { type: 'line', color: isOrigin ? '#4bea8d' : '#ff6178', size: 1.5 }
    },
    attributes: { navigation_role: role }
  });
}

function renderWebNavigationMarkers() {
  var layer = window._geoSceneNavigationLayer;
  if (!layer) return;
  clearAllWebNavigationGraphics();
  var originGraphic = createWebNavigationMarker(WEB_NAVIGATION_STATE.origin, 'origin');
  var destinationGraphic = createWebNavigationMarker(WEB_NAVIGATION_STATE.destination, 'destination');
  WEB_NAVIGATION_STATE.markerGraphics = [originGraphic, destinationGraphic].filter(Boolean);
  WEB_NAVIGATION_STATE.markerGraphics.forEach(function(graphic) { layer.add(graphic); });
}

function getWebNavigationWgs84Point(view, event) {
  var mapPoint = event && event.mapPoint;
  if (!mapPoint && view && view.toMap) {
    try { mapPoint = view.toMap({ x: event.x, y: event.y }); } catch (error) {}
  }
  if (!mapPoint) return null;
  var modules = window._geoSceneModules || {};
  if (modules.webMercatorUtils && mapPoint.spatialReference && mapPoint.spatialReference.isWebMercator) {
    mapPoint = modules.webMercatorUtils.webMercatorToGeographic(mapPoint);
  }
  var lon = Number(mapPoint.longitude !== undefined ? mapPoint.longitude : mapPoint.x);
  var lat = Number(mapPoint.latitude !== undefined ? mapPoint.latitude : mapPoint.y);
  if (!isFinite(lon) || !isFinite(lat) || lon < -180 || lon > 180 || lat < -90 || lat > 90) return null;
  return { lon: Number(lon.toFixed(7)), lat: Number(lat.toFixed(7)) };
}

function startWebNavigationTest() {
  if (!window._geoSceneView || !window._geoSceneNavigationLayer) {
    toast('GeoScene 场景仍在加载，请稍后再试');
    return;
  }
  var panel = getWebNavigationElement('webNavigationPanel');
  var toggle = getWebNavigationElement('webNavigationToggle');
  if (panel) panel.hidden = false;
  if (toggle) toggle.classList.add('active');
  WEB_NAVIGATION_STATE.active = true;
  resetWebNavigationPoints();
}

function handleWebNavigationMapClick(view, event) {
  if (!WEB_NAVIGATION_STATE.active || (WEB_NAVIGATION_STATE.stage !== 'origin' && WEB_NAVIGATION_STATE.stage !== 'destination')) {
    return false;
  }
  var point = getWebNavigationWgs84Point(view, event);
  if (!point) {
    updateWebNavigationPanel('没有取得有效地图坐标，请重新点击', '当前点击位置无法用于路线规划');
    return true;
  }
  document.querySelectorAll('.event-map-popup,.event-cluster-popup,.facility-map-popup-web,.building-info-popup-web,.road-map-popup-web').forEach(function(item) { item.remove(); });
  clearSelectedRoad();
  clearMetroConnections();
  highlightGeoSceneFacility(view, null);
  clearGeoSceneBuildingHighlight(true);
  if (WEB_NAVIGATION_STATE.stage === 'origin') {
    WEB_NAVIGATION_STATE.origin = point;
    WEB_NAVIGATION_STATE.stage = 'destination';
    renderWebNavigationMarkers();
    updateWebNavigationPanel('起点已设置，请点击地图选择终点');
  } else {
    WEB_NAVIGATION_STATE.destination = point;
    WEB_NAVIGATION_STATE.stage = 'solving';
    setWebNavigationSelecting(false);
    renderWebNavigationMarkers();
    updateWebNavigationPanel('正在调用 GeoScene 无障碍路网求解…');
    requestWebNavigationRoute(view);
  }
  return true;
}

function createWebNavigationRouteGraphics(coordinates) {
  var modules = window._geoSceneModules || {};
  var layer = window._geoSceneNavigationLayer;
  var casingLayer = window._geoSceneNavigationCasingLayer;
  if (!modules.Graphic || !layer || !casingLayer || coordinates.length < 2) return [];
  var geometry = { type: 'polyline', paths: [coordinates], spatialReference: { wkid: 4326 } };
  var casing = new modules.Graphic({
    geometry: geometry,
    symbol: { type: 'simple-line', color: '#071726', width: 9, style: 'solid', cap: 'round', join: 'round' },
    attributes: { navigation_role: 'route-casing' }
  });
  var core = new modules.Graphic({
    geometry: geometry,
    symbol: { type: 'simple-line', color: '#ffe45c', width: 5, style: 'solid', cap: 'round', join: 'round' },
    attributes: { navigation_role: 'route-core' }
  });
  casingLayer.add(casing);
  layer.add(core);
  WEB_NAVIGATION_STATE.markerGraphics.forEach(function(marker) {
    try { layer.remove(marker); layer.add(marker); } catch (error) {}
  });
  return [casing, core];
}

function webNavigationSegmentLength(a, b) {
  var latitude = (Number(a[1]) + Number(b[1])) * Math.PI / 360;
  var dx = (Number(b[0]) - Number(a[0])) * Math.cos(latitude) * 111320;
  var dy = (Number(b[1]) - Number(a[1])) * 110540;
  return Math.sqrt(dx * dx + dy * dy);
}

function getGrowingWebNavigationPath(coordinates, cumulative, targetDistance) {
  if (targetDistance <= 0) return [coordinates[0], coordinates[0]];
  var grown = [coordinates[0]];
  for (var index = 1; index < coordinates.length; index += 1) {
    if (cumulative[index] <= targetDistance) {
      grown.push(coordinates[index]);
      continue;
    }
    var segmentStart = cumulative[index - 1];
    var segmentLength = Math.max(0.000001, cumulative[index] - segmentStart);
    var ratio = Math.max(0, Math.min(1, (targetDistance - segmentStart) / segmentLength));
    grown.push([
      coordinates[index - 1][0] + (coordinates[index][0] - coordinates[index - 1][0]) * ratio,
      coordinates[index - 1][1] + (coordinates[index][1] - coordinates[index - 1][1]) * ratio
    ]);
    break;
  }
  return grown.length > 1 ? grown : [coordinates[0], coordinates[0]];
}

function animateWebNavigationRoute(route, distanceMeters) {
  clearWebNavigationRouteGraphics();
  var coordinates = (route || []).map(function(point) { return [Number(point.lon), Number(point.lat)]; })
    .filter(function(pair) { return isFinite(pair[0]) && isFinite(pair[1]); });
  if (coordinates.length < 2) return false;
  var cumulative = [0];
  for (var index = 1; index < coordinates.length; index += 1) {
    cumulative.push(cumulative[index - 1] + webNavigationSegmentLength(coordinates[index - 1], coordinates[index]));
  }
  var totalLength = cumulative[cumulative.length - 1];
  if (!totalLength) return false;
  var initial = [coordinates[0], coordinates[0]];
  var graphics = createWebNavigationRouteGraphics(initial);
  if (graphics.length !== 2) return false;
  WEB_NAVIGATION_STATE.routeGraphics = graphics;
  var duration = Math.max(2000, Math.min(4000, 1800 + distanceMeters * 0.35));
  var startedAt = null;
  function frame(timestamp) {
    if (startedAt === null) startedAt = timestamp;
    var progress = Math.min(1, (timestamp - startedAt) / duration);
    var eased = progress * progress * (3 - 2 * progress);
    var path = getGrowingWebNavigationPath(coordinates, cumulative, totalLength * eased);
    var geometry = { type: 'polyline', paths: [path], spatialReference: { wkid: 4326 } };
    graphics[0].geometry = geometry;
    graphics[1].geometry = geometry;
    if (progress < 1) {
      WEB_NAVIGATION_STATE.animationFrame = requestAnimationFrame(frame);
    } else {
      WEB_NAVIGATION_STATE.animationFrame = null;
    }
  }
  WEB_NAVIGATION_STATE.animationFrame = requestAnimationFrame(frame);
  return true;
}

function requestWebNavigationRoute(view) {
  if (!WEB_NAVIGATION_STATE.origin || !WEB_NAVIGATION_STATE.destination) return Promise.resolve(null);
  clearWebNavigationRouteGraphics();
  renderWebNavigationResult(null);
  var requestId = WEB_NAVIGATION_STATE.requestId + 1;
  WEB_NAVIGATION_STATE.requestId = requestId;
  var apiBase = getWebApiBase(APP_DATA);
  return fetchWebJSON(apiBase + '/api/web/map/navigation/solve', {
    method: 'POST',
    headers: Object.assign({ 'Content-Type': 'application/json' }, authHeaders()),
    body: JSON.stringify({
      origin: WEB_NAVIGATION_STATE.origin,
      destination: WEB_NAVIGATION_STATE.destination
    })
  }).then(function(result) {
    if (requestId !== WEB_NAVIGATION_STATE.requestId) return null;
    if (!result || !Array.isArray(result.route) || result.route.length < 2) throw new Error('GeoScene 未返回有效路线');
    WEB_NAVIGATION_STATE.result = result;
    WEB_NAVIGATION_STATE.stage = 'ready';
    setWebNavigationSelecting(false);
    updateWebNavigationPanel('路线已生成，可重播动画或交换起终点');
    renderWebNavigationResult(result);
    var routeGeometry = {
      type: 'polyline',
      paths: [result.route.map(function(point) { return [Number(point.lon), Number(point.lat)]; })],
      spatialReference: { wkid: 4326 }
    };
    var move = view && view.goTo ? view.goTo({ target: routeGeometry }, { duration: 700 }).catch(function() {}) : Promise.resolve();
    return Promise.resolve(move).then(function() {
      if (requestId !== WEB_NAVIGATION_STATE.requestId) return null;
      animateWebNavigationRoute(result.route, Number(result.distanceMeters || 0));
      return result;
    });
  }).catch(function(error) {
    if (requestId !== WEB_NAVIGATION_STATE.requestId) return null;
    WEB_NAVIGATION_STATE.result = null;
    WEB_NAVIGATION_STATE.stage = 'destination';
    setWebNavigationSelecting(true);
    clearWebNavigationRouteGraphics();
    updateWebNavigationPanel('求解失败，请点击地图重新选择终点', error && error.message ? error.message : 'GeoScene 路径服务暂不可用');
    return null;
  });
}

function swapWebNavigationPoints() {
  if (!WEB_NAVIGATION_STATE.origin || !WEB_NAVIGATION_STATE.destination || !window._geoSceneView) {
    toast('请先选择完整的起点和终点');
    return;
  }
  var originalOrigin = WEB_NAVIGATION_STATE.origin;
  WEB_NAVIGATION_STATE.origin = WEB_NAVIGATION_STATE.destination;
  WEB_NAVIGATION_STATE.destination = originalOrigin;
  WEB_NAVIGATION_STATE.result = null;
  WEB_NAVIGATION_STATE.stage = 'solving';
  setWebNavigationSelecting(false);
  renderWebNavigationMarkers();
  updateWebNavigationPanel('起终点已交换，正在重新求解…');
  requestWebNavigationRoute(window._geoSceneView);
}

function replayWebNavigationRoute() {
  var result = WEB_NAVIGATION_STATE.result;
  if (!result || !Array.isArray(result.route) || result.route.length < 2) {
    toast('当前没有可重播的导航路线');
    return;
  }
  animateWebNavigationRoute(result.route, Number(result.distanceMeters || 0));
}

function resetWebNavigationPoints() {
  WEB_NAVIGATION_STATE.requestId += 1;
  clearAllWebNavigationGraphics();
  WEB_NAVIGATION_STATE.origin = null;
  WEB_NAVIGATION_STATE.destination = null;
  WEB_NAVIGATION_STATE.result = null;
  WEB_NAVIGATION_STATE.active = true;
  WEB_NAVIGATION_STATE.stage = 'origin';
  setWebNavigationSelecting(true);
  renderWebNavigationResult(null);
  updateWebNavigationPanel('请在地图上点击选择起点');
}

function clearWebNavigationTest() {
  WEB_NAVIGATION_STATE.requestId += 1;
  clearAllWebNavigationGraphics();
  WEB_NAVIGATION_STATE.active = false;
  WEB_NAVIGATION_STATE.stage = 'idle';
  WEB_NAVIGATION_STATE.origin = null;
  WEB_NAVIGATION_STATE.destination = null;
  WEB_NAVIGATION_STATE.result = null;
  setWebNavigationSelecting(false);
  var panel = getWebNavigationElement('webNavigationPanel');
  var toggle = getWebNavigationElement('webNavigationToggle');
  if (panel) panel.hidden = true;
  if (toggle) toggle.classList.remove('active');
  renderWebNavigationResult(null);
  updateWebNavigationPanel('请在地图上点击选择起点');
}

function disposeWebNavigationLayer() {
  cancelWebNavigationAnimation();
  if (window._geoSceneNavigationLayer && window._geoSceneNavigationLayer.removeAll) {
    window._geoSceneNavigationLayer.removeAll();
  }
  if (window._geoSceneNavigationCasingLayer && window._geoSceneNavigationCasingLayer.removeAll) {
    window._geoSceneNavigationCasingLayer.removeAll();
  }
  WEB_NAVIGATION_STATE.markerGraphics = [];
  WEB_NAVIGATION_STATE.routeGraphics = [];
  WEB_NAVIGATION_STATE.active = false;
  WEB_NAVIGATION_STATE.stage = 'idle';
  setWebNavigationSelecting(false);
}

function syncGeoSceneEventLayer() {
  var layer = window._geoSceneEventLayer;
  var modules = window._geoSceneModules;
  if (!layer || !modules || !modules.Graphic) return;
  var graphics = createGeoSceneEventGraphics(modules.Graphic);
  var signature = getSceneEventSignature();
  if (!window._geoSceneEventLayerReady) {
    var pendingStatus = document.getElementById('sceneStatus');
    if (pendingStatus && window._geoSceneView) {
      pendingStatus.textContent = getGeoSceneStatusText(graphics.length);
    }
    renderGeoSceneDomEventMarkers(window._geoSceneView);
    return;
  }
  if (signature === window._geoSceneEventSignature) {
    var unchangedStatus = document.getElementById('sceneStatus');
    if (unchangedStatus && window._geoSceneView) {
      unchangedStatus.textContent = getGeoSceneStatusText(graphics.length);
    }
    renderGeoSceneDomEventMarkers(window._geoSceneView);
    return;
  }
  if (layer.applyEdits && layer.queryFeatures) {
    if (window._geoSceneSyncing) {
      window._geoSceneSyncPending = true;
      return;
    }
    window._geoSceneSyncing = true;
    layer.queryFeatures({
      where: '1=1',
      outFields: ['ObjectID'],
      returnGeometry: false
    }).then(function(result) {
      return layer.applyEdits({
        deleteFeatures: result.features || [],
        addFeatures: graphics
      });
    }).then(function() {
      window._geoSceneEventSignature = signature;
    }).catch(function(err) {
      console.warn('[Web] GeoScene 事件图层同步失败:', err && (err.message || err));
    }).finally(function() {
      window._geoSceneSyncing = false;
      if (window._geoSceneSyncPending) {
        window._geoSceneSyncPending = false;
        syncGeoSceneEventLayer();
      }
    });
  }
  var status = document.getElementById('sceneStatus');
  if (status && window._geoSceneView) {
    status.textContent = getGeoSceneStatusText(graphics.length);
  }
  renderGeoSceneDomEventMarkers(window._geoSceneView);
}

function groupGeoSceneEventsByCoordinate(graphics) {
  var groupsByCoordinate = {};
  var groups = [];
  (graphics || []).forEach(function(graphic) {
    var eventId = graphic.attributes && graphic.attributes.event_id;
    var mapEvent = getMapEventById(eventId);
    if (!eventId || !mapEvent) return;
    var lon = Number(mapEvent.lon);
    var lat = Number(mapEvent.lat);
    if (!isFinite(lon) || !isFinite(lat)) return;
    var key = lon.toFixed(6) + ',' + lat.toFixed(6);
    if (!groupsByCoordinate[key]) {
      groupsByCoordinate[key] = { key: key, graphic: graphic, events: [] };
      groups.push(groupsByCoordinate[key]);
    }
    groupsByCoordinate[key].events.push(mapEvent);
  });
  return groups;
}

function showMapEventClusterPopup(cluster, point) {
  if (!cluster || !cluster.events || !cluster.events.length) return;
  clearMapPopups();
  var map = document.getElementById('dashMap');
  if (!map) return;

  var pop = document.createElement('div');
  pop.className = 'event-cluster-popup';
  var close = document.createElement('button');
  close.type = 'button';
  close.className = 'pop-close';
  close.title = '关闭';
  close.setAttribute('aria-label', '关闭同位置事件列表');
  close.textContent = '✕';
  close.addEventListener('click', function() { pop.remove(); });
  pop.appendChild(close);

  var title = document.createElement('div');
  title.className = 'pop-title';
  title.textContent = '此位置有 ' + cluster.events.length + ' 条事件';
  pop.appendChild(title);

  var hint = document.createElement('div');
  hint.className = 'cluster-hint';
  hint.textContent = '请选择一条查看现场信息';
  pop.appendChild(hint);

  var list = document.createElement('div');
  list.className = 'cluster-event-list';
  cluster.events.forEach(function(evt) {
    var option = document.createElement('button');
    option.type = 'button';
    option.className = 'cluster-event-option marker-' + getEventLayerKey(evt).replace('-dots', '');

    var dot = document.createElement('span');
    dot.className = 'cluster-option-dot';
    var text = document.createElement('span');
    text.className = 'cluster-option-text';
    var strong = document.createElement('strong');
    strong.textContent = evt.id + ' · ' + evt.title;
    var detail = document.createElement('small');
    detail.textContent = (evt.status || '待审核') + ' · ' + (evt.location || '位置未记录');
    text.appendChild(strong);
    text.appendChild(detail);
    option.appendChild(dot);
    option.appendChild(text);

    option.addEventListener('click', function(e) {
      pop.remove();
      SELECTED_EVENT_ID = evt.id;
      showMapEventPopup(evt, point);
      highlightSelectedEventMarker();
      e.stopPropagation();
    });
    list.appendChild(option);
  });
  pop.appendChild(list);
  map.appendChild(pop);

  var rect = map.getBoundingClientRect();
  var x = point && isFinite(point.x) ? point.x : rect.width / 2;
  var y = point && isFinite(point.y) ? point.y : rect.height / 2;
  pop.style.left = Math.max(8, Math.min(rect.width - 320, x + 14)) + 'px';
  pop.style.top = Math.max(8, Math.min(rect.height - 270, y - 32)) + 'px';
}

function getEventGroupStyleEvent(events) {
  return events.find(function(evt) { return getEventLayerKey(evt) === 'danger-dots'; }) ||
    events.find(function(evt) { return getEventLayerKey(evt) === 'warning-dots'; }) ||
    events[0];
}

function renderGeoSceneDomEventMarkers(view) {
  if (!view || !view.ready || window._geoSceneAbandoned || !window._geoSceneModules || !window._geoSceneModules.Graphic) return;
  var mapBg = document.getElementById('mapBg');
  if (!mapBg) return;
  var overlay = ensureSceneEventOverlay(mapBg);
  var width = mapBg.clientWidth;
  var height = mapBg.clientHeight;
  var activeKeys = {};
  var visibleGroups = 0;
  var visibleEvents = 0;
  var graphics = createGeoSceneEventGraphics(window._geoSceneModules.Graphic);

  groupGeoSceneEventsByCoordinate(graphics).forEach(function(cluster) {
    var screen;
    try { screen = view.toScreen(cluster.graphic.geometry); } catch (e) { screen = null; }
    if (!screen || !isFinite(screen.x) || !isFinite(screen.y) ||
        screen.x < 0 || screen.y < 0 || screen.x > width || screen.y > height) return;

    var marker = Array.prototype.find.call(overlay.querySelectorAll('.scene-event-marker'), function(item) {
      return item.getAttribute('data-event-key') === cluster.key;
    });
    if (!marker) {
      marker = document.createElement('button');
      marker.type = 'button';
      marker.innerHTML = '<span class="scene-event-dot"></span><span class="scene-event-label"></span><span class="scene-event-count"></span>';
      marker.addEventListener('click', function(e) {
        var eventIds = (e.currentTarget.getAttribute('data-event-ids') || '').split('|').filter(Boolean);
        var events = eventIds.map(getMapEventById).filter(Boolean);
        if (!events.length) return;
        var clickPoint = {
          x: Number(e.currentTarget.dataset.screenX),
          y: Number(e.currentTarget.dataset.screenY)
        };
        if (events.length > 1) {
          showMapEventClusterPopup({ events: events }, clickPoint);
        } else {
          SELECTED_EVENT_ID = events[0].id;
          showMapEventPopup(events[0], clickPoint);
          highlightSelectedEventMarker();
        }
        e.stopPropagation();
      });
      overlay.appendChild(marker);
    }

    var eventIds = cluster.events.map(function(evt) { return evt.id; });
    var styleEvent = getEventGroupStyleEvent(cluster.events);
    var isCluster = cluster.events.length > 1;
    var isSelected = cluster.events.some(function(evt) { return evt.id === SELECTED_EVENT_ID; });
    marker.className = 'scene-event-marker compact marker-' + getEventLayerKey(styleEvent).replace('-dots', '') +
      (isCluster ? ' cluster' : '') + (isSelected ? ' selected' : '');
    marker.setAttribute('data-event-key', cluster.key);
    marker.setAttribute('data-event-ids', eventIds.join('|'));
    marker.setAttribute('data-event-count', String(cluster.events.length));
    if (isCluster) marker.removeAttribute('data-event-id');
    else marker.setAttribute('data-event-id', eventIds[0]);
    marker.style.left = screen.x + 'px';
    marker.style.top = screen.y + 'px';
    marker.dataset.screenX = String(screen.x);
    marker.dataset.screenY = String(screen.y);
    marker.querySelector('.scene-event-label').textContent = isCluster ? '' : eventIds[0];
    marker.querySelector('.scene-event-count').textContent = isCluster ? String(cluster.events.length) : '';
    marker.title = isCluster ? cluster.events.length + ' 条同位置事件' : eventIds[0] + ' · ' + styleEvent.title;
    marker.setAttribute('aria-label', isCluster
      ? cluster.events.length + ' 条同位置事件，点击选择'
      : eventIds[0] + '，' + styleEvent.title + '，点击查看信息');
    activeKeys[cluster.key] = true;
    visibleGroups += 1;
    visibleEvents += cluster.events.length;
  });

  overlay.querySelectorAll('.scene-event-marker').forEach(function(marker) {
    if (!activeKeys[marker.getAttribute('data-event-key')]) marker.remove();
  });
  overlay.dataset.debug = 'geoscene-screen-groups=' + visibleGroups + ';events=' + visibleEvents;
}

function scheduleGeoSceneDomEventMarkerRender(view) {
  if (!view || window._geoSceneAbandoned || window._geoSceneEventRenderFrame) return;
  window._geoSceneEventRenderFrame = window.requestAnimationFrame(function() {
    window._geoSceneEventRenderFrame = null;
    renderGeoSceneDomEventMarkers(view);
  });
}

function focusGeoSceneEvent(evt) {
  if (!window._geoSceneView || !evt || !isFinite(Number(evt.lon)) || !isFinite(Number(evt.lat))) {
    return Promise.resolve(false);
  }
  return window._geoSceneView.goTo({
    target: {
      type: 'point',
      longitude: Number(evt.lon),
      latitude: Number(evt.lat),
      spatialReference: { wkid: 4326 }
    },
    scale: 6500,
    heading: 0,
    tilt: 62
  }, { duration: 750 }).then(function() {
    return true;
  }).catch(function() {
    return false;
  });
}

function initGeoSceneMap() {
  if (!APP_DATA || !APP_DATA.mapConfig) return Promise.resolve(false);
  initializeMapLayerVisibility();
  var configuredLayers = APP_DATA.mapConfig.layers || {};
  var hasConfiguredGeoSceneContent = Boolean(
    APP_DATA.mapConfig.webSceneId ||
    (APP_DATA.mapConfig.basemap && APP_DATA.mapConfig.basemap.vectorTileUrl) ||
    configuredLayers.buildingLayerUrl ||
    configuredLayers.roadLayerUrl ||
    configuredLayers.waterLayerUrl ||
    configuredLayers.eventLayerUrl ||
    (APP_DATA.mapConfig.localBuildings && APP_DATA.mapConfig.localBuildings.enabled)
  );
  if (!hasConfiguredGeoSceneContent) return Promise.resolve(false);
  if (window._geoSceneStarted) {
    syncGeoSceneEventLayer();
    return Promise.resolve(true);
  }
  if (window._geoSceneFailed) return Promise.resolve(false);
  window._geoSceneStarted = true;
  window._geoSceneAbandoned = false;
  window._geoSceneFallbackStarted = false;
  window._geoSceneRoadLayer = null;
  window._geoSceneRoadLayerView = null;
  window._geoSceneRoadLayerReady = false;
  window._geoSceneWaterLayer = null;
  window._geoSceneWaterLayerReady = false;

  var cfg = APP_DATA.mapConfig;
  var mapBg = document.getElementById('mapBg');
  if (!mapBg) return Promise.resolve(false);
  var parts = ensureSceneContainer(mapBg);
  var sceneDiv = parts.sceneDiv;
  var status = parts.status;
  status.textContent = 'GeoScene 场景加载中';

  return probeGeoSceneVectorBasemap(cfg).then(function(available) {
    cfg._geosceneBasemapAvailable = available;
    if (available) return false;
    return probeTiandituBasemap(cfg);
  }).then(function(available) {
    cfg._tiandituAvailable = available;
    if (!cfg._geosceneBasemapAvailable && !available && getTiandituKeyFromConfig(cfg)) {
      console.warn('[Web] 天地图瓦片不可用，已切换到 OSM 单底图模式');
    }
    return loadGeoSceneModules();
  }).then(function(modules) {
    window._geoSceneModules = modules;
    if (modules.config) {
      // 使用 SDK 自己计算的 CDN 资源根路径，避免手动追加目录后产生重复路径。
      if (cfg.portalUrl) modules.config.portalUrl = cfg.portalUrl;
    }

    var geosceneBasemap = createGeoSceneBasemap(modules, cfg);
    var map = cfg.webSceneId
      ? new modules.WebScene({ portalItem: { id: cfg.webSceneId } })
      : new modules.Map({
          basemap: geosceneBasemap,
          ground: {
            surfaceColor: [11, 35, 58, 1]
          }
        });

    var roadLayer = createGeoSceneRoadLayerV4(modules, cfg);
    if (roadLayer) {
      roadLayer.visible = window._mapLayerVisibility.roads !== false;
      map.add(roadLayer);
      window._geoSceneRoadLayer = roadLayer;
    }

    // 优先使用 I3S SceneLayer。它保留完整建筑集，但会按镜头范围分块和按
    // LOD 调度几何，避免整份 GeoJSON 在每次镜头移动时都参与 WebGL 重绘。
    // 服务不可用时再回退到本地完整 GeoJSON，且任何时刻只保留一个白模图层。
    var localBuildingLayer = null;
    var useLocalBuildingFallback = function(reason) {
      if (window._geoSceneAbandoned) return null;
      window._geoSceneBuildingReady = false;
      if (window._geoSceneBuildingLayer && map.remove) {
        map.remove(window._geoSceneBuildingLayer);
        window._geoSceneBuildingLayer = null;
      }
      localBuildingLayer = addLocalBuildingLayer(map, modules, cfg, reason);
      if (window._geoSceneWaterLayer && map.reorder) {
        map.reorder(window._geoSceneWaterLayer, 0);
      }
      return localBuildingLayer;
    };

    if (cfg.layers && cfg.layers.buildingLayerUrl && modules.SceneLayer) {
      try {
        var meshLayerOptions = {
          url: cfg.layers.buildingLayerUrl,
          title: '深圳建筑白模',
          popupEnabled: false,
          legendEnabled: false,
          visible: window._mapLayerVisibility.buildings !== false,
          screenSizePerspectiveEnabled: true,
          renderer: getGeoSceneBuildingRenderer(ACTIVE_MAP_THEME)
        };
        if (!/\/layers\/\d+\/?(?:\?|$)/i.test(cfg.layers.buildingLayerUrl)) {
          meshLayerOptions.layerId = 0;
        }
        var meshLayer = new modules.SceneLayer(meshLayerOptions);
        map.add(meshLayer, 0);
        window._geoSceneBuildingLayer = meshLayer;
        status.textContent = '福田建筑白模正在分块加载';
        meshLayer.when().then(function() {
          if (window._geoSceneAbandoned) throw new Error('GeoScene view abandoned');
          return view.whenLayerView(meshLayer);
        }).then(function(layerView) {
          if (window._geoSceneAbandoned) return;
          window._geoSceneBuildingLayerView = layerView;
          window._geoSceneBuildingReady = true;
          markGeoSceneContentReady();
          var currentStatus = document.getElementById('sceneStatus');
          if (currentStatus) {
            currentStatus.textContent = getGeoSceneStatusText(createGeoSceneEventGraphics(modules.Graphic).length);
            currentStatus.title = 'I3S SceneLayer 分块与 LOD 渲染';
          }
        }).catch(function(err) {
          if (window._geoSceneAbandoned) return;
          console.warn('[Web] GeoScene SceneLayer 加载失败:', err && (err.message || err));
          useLocalBuildingFallback('GeoScene SceneLayer 不可用，已自动切换本地完整白模');
        });
      } catch (e) {
        console.warn('[Web] GeoScene SceneLayer 初始化失败:', e && (e.message || e));
        useLocalBuildingFallback('GeoScene SceneLayer 初始化失败，已自动切换本地完整白模');
      }
    } else {
      useLocalBuildingFallback('本地 GeoJSON 完整白模单图层模式');
    }

    var waterLayer = null;
    try {
      if (window.BlindWaterVisuals && window.BlindWaterVisuals.createWaterLayer) {
        waterLayer = window.BlindWaterVisuals.createWaterLayer(modules.FeatureLayer, cfg);
      }
      if (waterLayer) {
        if (window._mapLayerVisibility && typeof window._mapLayerVisibility.water === 'boolean') {
          waterLayer.visible = window._mapLayerVisibility.water;
        }
        map.add(waterLayer, 0);
        window._geoSceneWaterLayer = waterLayer;
        window._geoSceneWaterLayerReady = false;
        waterLayer.when().then(function() {
          if (window._geoSceneAbandoned) return;
          window._geoSceneWaterLayerReady = true;
          var currentStatus = document.getElementById('sceneStatus');
          if (currentStatus) {
            currentStatus.textContent = getGeoSceneStatusText(createGeoSceneEventGraphics(modules.Graphic).length);
            currentStatus.title = '福田动态水面 · 764 个水域要素';
          }
        }).catch(function(error) {
          if (window._geoSceneAbandoned) return;
          if (map.remove) map.remove(waterLayer);
          window._geoSceneWaterLayer = null;
          window._geoSceneWaterLayerReady = false;
          var currentStatus = document.getElementById('sceneStatus');
          if (currentStatus) {
            currentStatus.textContent = getGeoSceneStatusText(createGeoSceneEventGraphics(modules.Graphic).length);
            currentStatus.title = '动态水面加载失败，其他场景图层继续可用';
          }
          console.warn('[Web] GeoScene 动态水面加载失败:', error && (error.message || error));
        });
      }
    } catch (error) {
      if (waterLayer && map.remove) map.remove(waterLayer);
      window._geoSceneWaterLayer = null;
      window._geoSceneWaterLayerReady = false;
      status.textContent = getGeoSceneStatusText(createGeoSceneEventGraphics(modules.Graphic).length);
      status.title = '动态水面初始化失败，其他场景图层继续可用';
      console.warn('[Web] GeoScene 动态水面初始化失败:', error && (error.message || error));
    }

    var eventLayer = createGeoSceneEventLayer(modules.FeatureLayer, modules.Graphic);
    map.add(eventLayer);
    window._geoSceneEventLayer = eventLayer;
    window._geoSceneEventSignature = getSceneEventSignature();
    window._geoSceneEventLayerReady = false;
    eventLayer.when(function() {
      window._geoSceneEventLayerReady = true;
      syncGeoSceneEventLayer();
    }).catch(function(err) {
      console.warn('[Web] GeoScene 事件图层 ready 检查未完成:', err && (err.message || err));
    });

    addGeoSceneContextLayers(map, modules);

    var center = cfg.center || {};
    var view = new modules.SceneView({
      container: sceneDiv,
      map: map,
      // 让 SDK 按显卡能力选择质量档，避免完整白模在高档下耗尽 WebGL 显存。
      // 模型材质由 I3S 本身提供，不依赖 qualityProfile 强制提档。
      viewingMode: 'local',
      center: [
        Number(center.longitude || 114.0550),
        Number(center.latitude || 22.5350)
      ],
      scale: Number(center.scale || 52000),
      heading: Number(center.heading || 0),
      tilt: Number(center.tilt || 55),
      environment: {
        background: { type: 'color', color: [5, 15, 29, 1] },
        atmosphereEnabled: false,
        starsEnabled: false,
        lighting: {
          type: 'virtual',
          directShadowsEnabled: true,
          ambientOcclusionEnabled: true
        }
      }
    });
    window._geoSceneView = view;
    syncGeoSceneRoadLod(Number(view.scale || Number.POSITIVE_INFINITY));
    view.watch('scale', function(scale) {
      syncGeoSceneRoadLod(Number(scale));
    });
    view.watch('camera', function() {
      scheduleGeoSceneDomEventMarkerRender(view);
    });
    view.watch('stationary', function(stationary) {
      if (stationary) renderGeoSceneDomEventMarkers(view);
    });
    view.ui.components = [];
    view.highlightOptions = {
      color: '#5de4ff',
      haloOpacity: 0.9,
      fillOpacity: 0.22
    };
    if (roadLayer) {
      roadLayer.when().then(function() {
        if (window._geoSceneAbandoned) throw new Error('GeoScene view abandoned');
        return Promise.all(getGeoSceneRoadLayers().map(function(layer) { return layer.when(); }));
      }).then(function(layerView) {
        if (window._geoSceneAbandoned) return;
        window._geoSceneRoadLayerView = layerView;
        window._geoSceneRoadLayerReady = true;
        var currentStatus = document.getElementById('sceneStatus');
        if (currentStatus) {
          currentStatus.textContent = getGeoSceneStatusText(createGeoSceneEventGraphics(modules.Graphic).length);
          currentStatus.title = 'GeoScene 福田无障碍道路专题 · MapServer 图层 ' + Number(cfg.layers.roadLayerId || 0);
        }
      }).catch(function(error) {
        console.warn('[Web] GeoScene 福田路网加载失败:', error && (error.message || error));
      });
    }
    installGeoSceneBuildingInteractions(view, sceneDiv);
    // 禁用 SDK 默认的全场景点击查询，只保留下方按指定图层执行的一次 hitTest。
    view.popupEnabled = false;

    view.watch('fatalError', function(error) {
      if (!error) return;
      var detail = (error && (error.message || error.toString())) || 'ArcGIS fatalError';
      scheduleGeoSceneRecovery(view, 'ArcGIS WebGL 上下文恢复失败', detail);
    });

    if (!sceneDiv.dataset.webglRecoveryBound) {
      sceneDiv.dataset.webglRecoveryBound = 'true';
      sceneDiv.addEventListener('webglcontextlost', function(event) {
        event.preventDefault();
        scheduleGeoSceneRecovery(view, '浏览器 WebGL 上下文已丢失', 'webglcontextlost');
      }, true);
      sceneDiv.addEventListener('webglcontextrestored', function() {
        if (window._geoSceneRecoveryTimer) {
          clearTimeout(window._geoSceneRecoveryTimer);
          window._geoSceneRecoveryTimer = null;
        }
        if (window._geoSceneAbandoned) return;
        sceneDiv.classList.add('ready');
        mapBg.classList.add('geoscene-ready', 'tiles-ready');
        if (view.requestRender) view.requestRender();
        markGeoSceneContentReady();
        status.textContent = getGeoSceneStatusText(createGeoSceneEventGraphics(modules.Graphic).length);
      }, true);
    }

    view.on('click', function(event) {
      if (handleWebNavigationMapClick(view, event)) return;
      var hitLayers = [window._geoSceneEventLayer];
      Object.keys(window._geoSceneFacilityLayers || {}).forEach(function(category) {
        hitLayers.push(window._geoSceneFacilityLayers[category]);
      });
      getGeoSceneSemanticLayers().forEach(function(layer) { hitLayers.push(layer); });
      getGeoSceneBuildingLayers().forEach(function(layer) { hitLayers.push(layer); });
      view.hitTest(event, { include: hitLayers }).then(function(response) {
        var facilityHit = (response.results || []).find(function(item) {
          return item.graphic && item.graphic.layer &&
            Object.keys(window._geoSceneFacilityLayers || {}).some(function(category) {
              return item.graphic.layer === window._geoSceneFacilityLayers[category];
            });
        });
        var hitFacilityAttributes = facilityHit && facilityHit.graphic
          ? (facilityHit.graphic.attributes || {})
          : {};
        var nearestFacility = (!facilityHit || (!hitFacilityAttributes.facility_id && !hitFacilityAttributes.cluster_count))
          ? findNearestVisibleFacilityAtScreen(view, event, 40)
          : null;
        if (facilityHit && facilityHit.graphic) {
          var facilityAttributes = facilityHit.graphic.attributes || {};
          if (!facilityAttributes.facility_id && facilityAttributes.cluster_count) {
            view.goTo({
              target: facilityHit.graphic.geometry,
              scale: Math.max(Number(view.scale || 12000) / 2.2, 2200)
            }, { duration: 650 }).catch(function() {});
            return;
          }
        }
        var facilityGraphic = nearestFacility && nearestFacility.graphic
          ? nearestFacility.graphic
          : (facilityHit && facilityHit.graphic);
        var facility = nearestFacility && nearestFacility.item;
        if (!facility && facilityGraphic && facilityGraphic.attributes) {
          facility = findMapFacility(facilityGraphic.attributes.facility_id);
        }
        if (facility && facilityGraphic) {
          clearSelectedRoad();
          highlightGeoSceneFacility(view, facilityGraphic);
          var nearbyBuildingHit = (response.results || []).find(function(item) {
            return item.graphic && getGeoSceneBuildingLayers().indexOf(item.graphic.layer) >= 0;
          });
          if (nearbyBuildingHit) setGeoSceneBuildingHighlight(view, nearbyBuildingHit.graphic, true);
          showMapFacilityPopup(facility, { x: event.x, y: event.y });
          return;
        }
        var hit = (response.results || []).find(function(item) {
          return item.graphic && item.graphic.layer === window._geoSceneEventLayer;
        });
        if (hit && hit.graphic && hit.graphic.attributes) {
          clearSelectedRoad();
          clearMetroConnections();
          highlightGeoSceneFacility(view, null);
          clearGeoSceneBuildingHighlight(true);
          var eventId = hit.graphic.attributes.event_id;
          var mapEvent = getMapEventById(eventId);
          if (!mapEvent) return;
          SELECTED_EVENT_ID = eventId;
          showMapEventPopup(mapEvent, { x: event.x, y: event.y });
          highlightSelectedEventMarker();
          return;
        }
        var semanticLayers = getGeoSceneSemanticLayers();
        var semanticHit = (response.results || []).find(function(item) {
          return item.graphic && semanticLayers.indexOf(item.graphic.layer) >= 0;
        });
        if (semanticHit && semanticHit.graphic && semanticHit.graphic.attributes) {
          clearSelectedRoad();
          highlightGeoSceneFacility(view, null);
          clearMetroConnections();
          setGeoSceneBuildingHighlight(view, semanticHit.graphic, true);
          showSemanticBuildingPopup(semanticHit.graphic.attributes, { x: event.x, y: event.y });
          return;
        }
        var buildingLayers = getGeoSceneBuildingLayers();
        var buildingHit = (response.results || []).find(function(item) {
          return item.graphic && buildingLayers.indexOf(item.graphic.layer) >= 0;
        });
        if (buildingHit && buildingHit.graphic) {
          return identifyGeoSceneBuildingAtHit(view, event, buildingHit.graphic);
        }
        var roadHit = (response.results || []).find(function(item) {
          return item.graphic && isRoadGraphic(item.graphic);
        });
        if (roadHit && roadHit.graphic && roadHit.graphic.attributes) {
          selectRoadGraphic(view, event, roadHit.graphic);
          return;
        }
        return identifyRoadAtMapPoint(view, event).then(function(identifiedRoad) {
          if (identifiedRoad && selectRoadGraphic(view, event, identifiedRoad)) return;
          clearSelectedRoad();
          highlightGeoSceneFacility(view, null);
          clearGeoSceneBuildingHighlight(true);
        });
      }).catch(function(err) {
        console.warn('[Web] 地图点击命中检测失败:', err && (err.message || err));
      });
    });

    return view.when().then(function() {
      if (window._geoSceneAbandoned) return false;
      window._geoSceneViewReady = true;
      sceneDiv.classList.add('ready');
      mapBg.classList.add('geoscene-ready');
      mapBg.classList.add('tiles-ready');
      markGeoSceneContentReady();
      syncMapLayerControlsFromVisibility();
      status.textContent = getGeoSceneStatusText(createGeoSceneEventGraphics(modules.Graphic).length);
      syncGeoSceneEventLayer();
      return true;
    });
  }).catch(function(err) {
    var detail = (err && (err.stack || err.message || err.toString())) || 'unknown';
    console.warn('[Web] GeoScene SceneView 加载失败，转入 3D Tiles 兜底:', detail);
    window._geoSceneFailed = true;
    disposeGeoSceneView();
    sceneDiv.classList.remove('ready');
    mapBg.classList.remove('geoscene-ready');
    mapBg.classList.remove('tiles-ready');
    status.textContent = 'GeoScene 未加载，正在切换本地白模';
    status.title = detail;
    return false;
  });
}

function syncTiles3DEventMarkers() {
  var widget = window._tiles3DWidget;
  if (!widget || !window.Cesium || !APP_DATA || !APP_DATA.dashboard || !APP_DATA.dashboard.map) return;
  var Cesium = window.Cesium;
  var scene = widget.scene;
  var signature = getSceneEventSignature() + '|' + getTiles3DEventHeight();
  if (signature === window._tiles3DEventSignature) {
    renderSceneDomEventMarkers();
    return;
  }
  window._tiles3DEventSignature = signature;
  window._tiles3DEventGeneration = (window._tiles3DEventGeneration || 0) + 1;
  var generation = window._tiles3DEventGeneration;
  window._tiles3DSurfaceCache = window._tiles3DSurfaceCache || {};
  if (window._tiles3DEventPoints) scene.primitives.remove(window._tiles3DEventPoints);
  if (window._tiles3DEventLabels) scene.primitives.remove(window._tiles3DEventLabels);
  window._tiles3DEventPoints = scene.primitives.add(new Cesium.PointPrimitiveCollection());
  window._tiles3DEventLabels = null;
  window._tiles3DEventPositions = {};

  var count = 0;
  (APP_DATA.dashboard.map.events || []).forEach(function(evt) {
    var lon = Number(evt.lon);
    var lat = Number(evt.lat);
    if (!isFinite(lon) || !isFinite(lat) || !isEventLayerVisible(evt)) return;

    var selected = evt.id === SELECTED_EVENT_ID;
    var surfaceKey = lon + ',' + lat;
    var cachedSurface = window._tiles3DSurfaceCache[evt.id];
    var position = cachedSurface && cachedSurface.key === surfaceKey
      ? cachedSurface.position
      : Cesium.Cartesian3.fromDegrees(
          lon,
          lat,
          getTiles3DEventHeight() + (selected ? 24 : 14)
        );
    var color = getCesiumEventColor(Cesium, evt);
    var point = window._tiles3DEventPoints.add({
      position: position,
      pixelSize: selected ? 20 : 15,
      color: color,
      outlineColor: Cesium.Color.WHITE.withAlpha(0.9),
      outlineWidth: selected ? 3 : 2,
      disableDepthTestDistance: Number.POSITIVE_INFINITY
    });
    point.id = evt;
    point.eventData = evt;
    window._tiles3DEventPositions[evt.id] = position;
    if (!cachedSurface || cachedSurface.key !== surfaceKey) {
      clampTilesEventPoint(scene, Cesium, point, evt.id, lon, lat, surfaceKey, generation);
    }

    count += 1;
  });

  var status = document.getElementById('sceneStatus');
  if (status) status.textContent = '道路底图 · 福田中心区建筑白模 · ' + count + ' 个无障碍事件';
  renderSceneDomEventMarkers();
  scene.requestRender();
}

function clampTilesEventPoint(scene, Cesium, point, eventId, lon, lat, surfaceKey, generation) {
  if (!scene.clampToHeightMostDetailed || scene.clampToHeightSupported === false) return;
  var probe = Cesium.Cartesian3.fromDegrees(lon, lat, getTiles3DEventHeight() + 1400);
  scene.clampToHeightMostDetailed([probe]).then(function(positions) {
    if (!positions || !positions[0]) return;
    window._tiles3DSurfaceCache = window._tiles3DSurfaceCache || {};
    window._tiles3DSurfaceCache[eventId] = { key: surfaceKey, position: positions[0] };
    if (window._tiles3DEventGeneration !== generation) return;
    point.position = positions[0];
    if (window._tiles3DEventPositions) window._tiles3DEventPositions[eventId] = positions[0];
    scene.requestRender();
  }).catch(function() {
    // Keep the configured elevation when the white model cannot be sampled.
  });
}

function renderSceneDomEventMarkers() {
  var widget = window._tiles3DWidget;
  if (!widget || !window.Cesium || !APP_DATA || !APP_DATA.dashboard || !APP_DATA.dashboard.map) return;
  var mapBg = document.getElementById('mapBg');
  if (!mapBg) return;
  var overlay = ensureSceneEventOverlay(mapBg);
  var Cesium = window.Cesium;
  var scene = widget.scene;
  var width = mapBg ? mapBg.clientWidth : 0;
  var height = mapBg ? mapBg.clientHeight : 0;
  var visible = 0;
  var activeIds = {};

  (APP_DATA.dashboard.map.events || []).forEach(function(evt) {
    if (!isEventLayerVisible(evt)) return;
    var position = window._tiles3DEventPositions && window._tiles3DEventPositions[evt.id];
    if (!position) return;
    var screen = Cesium.SceneTransforms.worldToWindowCoordinates(scene, position);
    if (!screen || screen.x < 0 || screen.y < 0 || screen.x > width || screen.y > height) return;

    var marker = overlay.querySelector('[data-event-id="' + evt.id + '"]');
    if (!marker) {
      marker = document.createElement('button');
      marker.type = 'button';
      marker.setAttribute('data-event-id', evt.id);
      marker.innerHTML = '<span class="scene-event-dot"></span><span class="scene-event-label"></span>';
      marker.addEventListener('click', function(e) {
        var eventId = e.currentTarget.getAttribute('data-event-id');
        var mapEvent = getMapEventById(eventId);
        if (!mapEvent) return;
        SELECTED_EVENT_ID = eventId;
        showMapEventPopup(mapEvent, {
          x: Number(e.currentTarget.dataset.screenX),
          y: Number(e.currentTarget.dataset.screenY)
        });
        highlightSelectedEventMarker();
        e.stopPropagation();
      });
      overlay.appendChild(marker);
    }
    marker.className = 'scene-event-marker compact marker-' + getEventLayerKey(evt).replace('-dots', '') +
      (evt.id === SELECTED_EVENT_ID ? ' selected' : '');
    marker.style.left = screen.x + 'px';
    marker.style.top = screen.y + 'px';
    marker.title = evt.id + ' · ' + evt.title;
    marker.setAttribute('aria-label', evt.id + '，' + evt.title + '，点击查看详情');
    marker.dataset.screenX = String(screen.x);
    marker.dataset.screenY = String(screen.y);
    marker.querySelector('.scene-event-label').textContent = evt.id;
    activeIds[evt.id] = true;
    visible += 1;
  });
  overlay.querySelectorAll('.scene-event-marker').forEach(function(marker) {
    if (!activeIds[marker.getAttribute('data-event-id')]) marker.remove();
  });
  overlay.dataset.debug = 'surface-anchored-markers=' + visible;
}

function highlightSelectedEventMarker() {
  syncGeoSceneEventLayer();
  syncTiles3DEventMarkers();
}

function focusCesiumEvent(evt) {
  var widget = window._tiles3DWidget;
  if (!widget || !window.Cesium || !evt || !isFinite(Number(evt.lon)) || !isFinite(Number(evt.lat))) return;
  var Cesium = window.Cesium;
  widget.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(Number(evt.lon), Number(evt.lat), 950),
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-58),
      roll: 0
    },
    duration: 0.7
  });
}

function installSceneEventPicker(widget) {
  if (window._tiles3DEventHandler || !window.Cesium || !widget) return;
  var Cesium = window.Cesium;
  window._tiles3DEventHandler = new Cesium.ScreenSpaceEventHandler(widget.scene.canvas);
  window._tiles3DEventHandler.setInputAction(function(movement) {
    var picked = widget.scene.pick(movement.position);
    var candidates = widget.scene.drillPick ? widget.scene.drillPick(movement.position, 8) : [];
    var evt = picked && (picked.id || (picked.primitive && (picked.primitive.eventData || picked.primitive.id)));
    if (!evt) {
      candidates.some(function(candidate) {
        evt = candidate && (candidate.id || (candidate.primitive && (candidate.primitive.eventData || candidate.primitive.id)));
        return Boolean(evt);
      });
    }
    if (!evt) return;
    SELECTED_EVENT_ID = evt.id;
    showMapEventPopup(evt, { x: movement.position.x, y: movement.position.y });
    highlightSelectedEventMarker();
    widget.scene.requestRender();
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

function initTiles3DMap() {
  var mapConfig = APP_DATA && APP_DATA.mapConfig;
  var tilesConfig = mapConfig && mapConfig.tiles3d;
  var localBuildings = mapConfig && mapConfig.localBuildings;
  var canUseTiles = Boolean(tilesConfig && tilesConfig.enabled && tilesConfig.tilesetUrl);
  var canUseLocalBuildings = Boolean(localBuildings && localBuildings.enabled && localBuildings.url);
  if (!mapConfig || (!canUseTiles && !canUseLocalBuildings)) {
    return Promise.resolve(false);
  }
  if (window._tiles3DStarted) {
    syncTiles3DEventMarkers();
    return window._tiles3DPromise || Promise.resolve(Boolean(window._tiles3DWidget));
  }
  window._tiles3DStarted = true;

  var cfg = mapConfig;
  var mapBg = document.getElementById('mapBg');
  if (!mapBg) return Promise.resolve(false);
  var parts = ensureSceneContainer(mapBg);
  var sceneDiv = parts.sceneDiv;
  var status = parts.status;
  var widget = null;
  var cesiumBase = 'https://cesium.com/downloads/cesiumjs/releases/1.121/Build/Cesium/';
  window.CESIUM_BASE_URL = cesiumBase;
  status.textContent = '本地建筑白模兜底加载中';

  var cesiumAssets = withTimeout(
    Promise.all([
      loadStyleOnce('cesium-widgets-css', cesiumBase + 'Widgets/widgets.css'),
      loadScriptOnce('cesium-js', cesiumBase + 'Cesium.js')
    ]),
    MAP_SDK_LOAD_TIMEOUT_MS,
    'Cesium 地图库加载超时'
  );

  window._tiles3DPromise = cesiumAssets.then(function() {
    if (!window.Cesium) throw new Error('Cesium 未加载');
    var Cesium = window.Cesium;
    widget = new Cesium.CesiumWidget(sceneDiv, {
      scene3DOnly: true,
      requestRenderMode: true,
      maximumRenderTimeChange: Infinity,
      useBrowserRecommendedResolution: true
    });
    widget.scene.globe.show = true;
    widget.scene.skyAtmosphere.show = false;
    widget.scene.backgroundColor = Cesium.Color.fromCssColorString('#050f1d');
    if (widget.scene.globe && 'baseColor' in widget.scene.globe) {
      widget.scene.globe.baseColor = Cesium.Color.fromCssColorString('#0b233a');
    }
    if ('msaaSamples' in widget.scene) widget.scene.msaaSamples = 1;
    var fallbackBasemapAdded = false;
    var basemapAdded = false;
    window._cesiumRoadLayerReady = false;
    try {
      fallbackBasemapAdded = addCesiumOpenStreetMapBasemap(Cesium, widget);
      basemapAdded = addCesiumTiandituBasemap(Cesium, widget, cfg);
    } catch (e) {
      console.warn('[Web] 天地图底图加载失败，继续使用道路底图: ' + (e.message || e));
    }
    addCesiumGeoSceneRoadNetwork(Cesium, widget, cfg).then(function(added) {
      if (!added) return;
      var currentStatus = document.getElementById('sceneStatus');
      if (currentStatus && currentStatus.textContent.indexOf('福田路网') < 0) {
        currentStatus.textContent = '福田路网 · ' + currentStatus.textContent;
      }
    });

    // 福田本地 GeoJSON 与当前镜头坐标一致，优先于兼容保留的旧 3D Tiles 路径。
    // 这样 GeoScene/CDN 失败时仍能显示正确城区的完整白模。
    if (canUseLocalBuildings) {
      window._tiles3DUsesLocalGeoJSON = true;
      return loadCesiumLocalBuildings(Cesium, widget, cfg).then(function(buildingCount) {
        sceneDiv.classList.add('ready');
        mapBg.classList.add('tiles-ready', 'cesium-content-ready');
        status.textContent = (basemapAdded ? '天地图 / ' : '') +
          (fallbackBasemapAdded ? '道路底图 · ' : '') +
          '本地完整白模 ' + Number(buildingCount).toLocaleString() + ' 栋';
        setCesiumCameraView(widget, cfg);
        window._tiles3DWidget = widget;
        installSceneEventPicker(widget);
        if (!window._tiles3DEventOverlayHooked) {
          widget.scene.postRender.addEventListener(renderSceneDomEventMarkers);
          window._tiles3DEventOverlayHooked = true;
        }
        syncTiles3DEventMarkers();
        widget.scene.requestRender();
        return true;
      });
    }

    window._tiles3DUsesLocalGeoJSON = false;
    var url = cfg.tiles3d.tilesetUrl;
    var tilesetOptions = {
      // 限制非可见瓦片缓存；不会删减建筑，只会让移出镜头的 GPU 资源更早释放。
      cacheBytes: 128 * 1024 * 1024,
      maximumCacheOverflowBytes: 32 * 1024 * 1024,
      maximumMemoryUsage: 128,
      maximumScreenSpaceError: 24,
      dynamicScreenSpaceError: true,
      foveatedScreenSpaceError: true,
      skipLevelOfDetail: true,
      immediatelyLoadDesiredLevelOfDetail: false,
      loadSiblings: false,
      preloadWhenHidden: false,
      preloadFlightDestinations: false
    };
    var tilesetPromise = Cesium.Cesium3DTileset.fromUrl
      ? Cesium.Cesium3DTileset.fromUrl(url, tilesetOptions)
      : Promise.resolve(new Cesium.Cesium3DTileset(Object.assign({ url: url }, tilesetOptions)));

    return withTimeout(
      tilesetPromise,
      MAP_SDK_LOAD_TIMEOUT_MS,
      '3D Tiles 配置加载超时'
    ).then(function(tileset) {
      widget.scene.primitives.add(tileset);
      // 不设置全局 Cesium3DTileStyle：统一着色会覆盖 GLB 自带的 PBR 材质与纹理。
      var ready = tileset.readyPromise || Promise.resolve(tileset);
      return ready.then(function() {
        sceneDiv.classList.add('ready');
        mapBg.classList.add('tiles-ready');
        mapBg.classList.add('cesium-content-ready');
        status.textContent = (basemapAdded ? '天地图影像 / ' : '') +
          (fallbackBasemapAdded ? '道路底图 · ' : '') + '福田中心区建筑白模 · 3D Tiles';
        setCesiumCameraView(widget, cfg);
        window._tiles3DWidget = widget;
        installSceneEventPicker(widget);
        if (!window._tiles3DEventOverlayHooked) {
          widget.scene.postRender.addEventListener(renderSceneDomEventMarkers);
          window._tiles3DEventOverlayHooked = true;
        }
        syncTiles3DEventMarkers();
        widget.scene.requestRender();
        return true;
      });
    });
  }).catch(function(err) {
    var detail = (err && (err.stack || err.message || err.toString())) || 'unknown';
    console.warn('[Web] 3D Tiles 加载失败，继续使用 CSS 地图: ' + detail);
    if (window._tiles3DDataSourceTickRemover) {
      try { window._tiles3DDataSourceTickRemover(); } catch (e) {}
    }
    if (window._tiles3DDataSourceDisplay) {
      try { window._tiles3DDataSourceDisplay.destroy(); } catch (e) {}
    }
    window._tiles3DDataSourceTickRemover = null;
    window._tiles3DDataSourceDisplay = null;
    window._tiles3DDataSourceCollection = null;
    window._tiles3DDataSource = null;
    if (widget) {
      try {
        if (!widget.isDestroyed || !widget.isDestroyed()) widget.destroy();
      } catch (e) {}
    }
    window._tiles3DWidget = null;
    window._tiles3DUsesLocalGeoJSON = false;
    window._tiles3DStarted = false;
    showLightweightMap('三维地图不可用，已显示轻量道路示意图', detail);
    return false;
  }).finally(function() {
    if (!window._tiles3DStarted) window._tiles3DPromise = null;
  });
  return window._tiles3DPromise;
}

// 从 JSON 数据渲染地图建筑和事件点
function renderMapFromJSON() {
  if (!APP_DATA || !APP_DATA.dashboard || !APP_DATA.dashboard.map) return;
  initializeMapLayerVisibility();
  var m = APP_DATA.dashboard.map;
  var mapBg = document.querySelector('#mapBg');

  // 更新地图坐标
  var coordsEl = document.querySelector('.map-coords');
  if (coordsEl && m.center) {
    coordsEl.textContent = '📍 ' + m.center.lon + ', ' + m.center.lat + ' | ' + m.center.location;
  }

  // 清除旧的动态元素（保留 map-grid, map-crosshair, map-coords）
  mapBg.querySelectorAll('.building, .event-dot').forEach(function(el) { el.remove(); });

  // 渲染建筑
  if (m.buildings) {
    m.buildings.forEach(function(b) {
      var div = document.createElement('div');
      div.className = 'building' + (b.type === 'tall' ? ' tall' : '');
      div.style.cssText = 'left:' + b.left + 'px;top:' + b.top + 'px;width:' + b.width + 'px;height:' + b.height + 'px;';
      if (b.name) {
        div.textContent = b.name;
        div.setAttribute('onclick', "bldPopup(event,'" + b.name + "','" + b.coverage + "','" + b.facility + "')");
      }
      mapBg.appendChild(div);
    });
  }

  // 渲染事件点
  if (m.events) {
    m.events.forEach(function(e) {
      var div = document.createElement('div');
      div.className = 'event-dot dot-' + e.type;
      div.style.cssText = 'top:' + e.top + 'px;left:' + e.left + 'px;';
      div.title = e.title;
      div.addEventListener('click', function(evt) {
        SELECTED_EVENT_ID = e.id;
        showMapEventPopup(e, {
          x: evt.clientX - document.getElementById('dashMap').getBoundingClientRect().left,
          y: evt.clientY - document.getElementById('dashMap').getBoundingClientRect().top
        });
        highlightSelectedEventMarker();
        evt.stopPropagation();
      });
      mapBg.appendChild(div);
    });
  }

  initGeoSceneMap().then(function(ready) {
    if (!ready) initTiles3DMap();
    syncGeoSceneEventLayer();
    syncTiles3DEventMarkers();
  });
}

function renderFacilityLegend() {
  var container = document.getElementById('facilityLegendRows');
  if (!container) return;
  var context = APP_DATA && APP_DATA.mapFacilities;
  var summary = context && Array.isArray(context.summary) ? context.summary : [];
  var counts = {};
  summary.forEach(function(item) { counts[item.category] = Number(item.count || 0); });
  container.innerHTML = '';

  Object.keys(MAP_FACILITY_STYLES).forEach(function(category) {
    var style = MAP_FACILITY_STYLES[category];
    var row = document.createElement('div');
    row.className = 'leg-row leg-toggle';
    row.dataset.mapLayer = category;
    row.innerHTML =
      '<span class="facility-legend-badge badge-' + escapeMapText(style.badge) + '" style="--badge-color:' + style.color + '">' + escapeMapText(style.icon) + '</span>' +
      '<span class="leg-check">✓</span>' +
      '<span class="leg-label">' + escapeMapText(style.label) + '</span>' +
      '<span class="layer-count">' + Number(counts[category] || 0).toLocaleString() + '</span>';
    row.addEventListener('click', function() { toggleMapDataLayer(category, row); });
    container.appendChild(row);
  });

  var total = document.getElementById('mapFacilityTotal');
  if (total) total.textContent = context ? Number(context.featureCount || 0).toLocaleString() + '个设施' : '设施数据不可用';
  var note = document.getElementById('mapQualityNote');
  if (note && context && context.qualityNote) {
    note.dataset.defaultText = context.qualityNote;
    note.textContent = context.qualityNote;
  }
  var roadCount = document.getElementById('roadFeatureCount');
  var configuredRoadCount = APP_DATA && APP_DATA.mapConfig && APP_DATA.mapConfig.layers
    ? Number(APP_DATA.mapConfig.layers.roadFeatureCount || 0)
    : 0;
  if (roadCount) roadCount.textContent = configuredRoadCount ? configuredRoadCount.toLocaleString() : 'GeoScene';
  var semanticCount = document.getElementById('semanticBuildingCount');
  var semanticMetadata = APP_DATA && APP_DATA.buildingSemantics && APP_DATA.buildingSemantics.metadata;
  if (semanticCount) {
    semanticCount.textContent = semanticMetadata
      ? Number(semanticMetadata.buildingCount || 0).toLocaleString() + '栋'
      : '不可用';
  }
  syncMapLayerControlsFromVisibility();
}

// 从 JSON 数据渲染视图切换标签
function renderViewTabsFromJSON() {
  var vt = MAP_THEME_KEYS.map(function(theme) { return MAP_THEME_LABELS[theme]; });
  var container = document.getElementById('viewTabs');
  if (!container) return;
  container.innerHTML = '';
  vt.forEach(function(tab, idx) {
    var div = document.createElement('div');
    var theme = MAP_THEME_KEYS[idx];
    div.className = 'view-tab' + (theme === ACTIVE_MAP_THEME ? ' active' : '');
    div.dataset.theme = theme;
    div.textContent = tab;
    div.setAttribute('onclick', 'setView(this)');
    container.appendChild(div);
  });
}

// 从 JSON 数据渲染事件列表
function renderEventsFromJSON() {
  if (!APP_DATA || !APP_DATA.events) return;
  var events = APP_DATA.events;
  var tbody = document.querySelector('#page-events .evt-table tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  events.forEach(function(evt) {
    var tr = document.createElement('tr');
    var statusClass = getStatusClass(evt.status);
    var actions = '<span class="act-link" onclick="event.stopPropagation();openEventDetail(\'' + evt.id + '\')">查看</span>';
    if (evt.canAudit) actions += '<span class="act-link" onclick="event.stopPropagation();openEventDetail(\'' + evt.id + '\')">审核</span>';
    if (evt.canUpdate) actions += '<span class="act-link" onclick="event.stopPropagation();openEventDetail(\'' + evt.id + '\')">更新</span>';
    if (evt.canDelete) actions += '<span class="act-link act-delete" onclick="event.stopPropagation();requestDeleteEvent(\'' + evt.id + '\')">删除</span>';

    tr.setAttribute('onclick', "openEventDetail('" + evt.id + "')");
    tr.innerHTML =
      '<td style="color:var(--accent);">' + evt.id + '</td>' +
      '<td>' + evt.type + '</td>' +
      '<td>' + evt.coords + '</td>' +
      '<td>' + evt.district + '</td>' +
      '<td>' + evt.reporter + '</td>' +
      '<td>' + evt.time + '</td>' +
      '<td><span class="st-badge ' + statusClass + '">' + evt.status + '</span></td>' +
      '<td>' + actions + '</td>';
    tbody.appendChild(tr);
  });
  applyEventFilters();
}

function resolveWebReportPhotoUrl(photoUrl) {
  if (!photoUrl || !/^\/uploads\/[A-Za-z0-9._-]+$/.test(photoUrl)) return '';
  return getWebApiBase(APP_DATA) + photoUrl;
}

function getEventMarkerScreenPoint(eventId) {
  var markers = document.querySelectorAll('#sceneEventOverlay .scene-event-marker');
  var marker = Array.prototype.find.call(markers, function(item) {
    var ids = item.getAttribute('data-event-ids') || item.getAttribute('data-event-id') || '';
    return ids.split('|').indexOf(eventId) !== -1;
  });
  if (!marker) return null;
  var x = Number(marker.dataset.screenX);
  var y = Number(marker.dataset.screenY);
  return isFinite(x) && isFinite(y) ? { x: x, y: y } : null;
}

function revealLocatedMapEvent(evt) {
  if (window._geoSceneView) renderGeoSceneDomEventMarkers(window._geoSceneView);
  if (window._tiles3DWidget) renderSceneDomEventMarkers();
  showMapEventPopup(evt, getEventMarkerScreenPoint(evt.id));
  highlightSelectedEventMarker();
}

function locateEventOnMap(eventId) {
  var evt = getMapEventById(eventId);
  if (!evt && APP_DATA && APP_DATA.eventDetail && APP_DATA.eventDetail.id === eventId) {
    var detail = APP_DATA.eventDetail;
    var coordinates = String(detail.coords || '').split(',');
    evt = Object.assign({}, detail, {
      title: detail.title || detail.type,
      location: detail.location || [detail.address, detail.landmark].filter(Boolean).join(' · '),
      time: detail.time || detail.reportTime,
      lon: detail.lon != null ? detail.lon : Number(coordinates[0]),
      lat: detail.lat != null ? detail.lat : Number(coordinates[1])
    });
  }
  if (!evt || !isFinite(Number(evt.lon)) || !isFinite(Number(evt.lat))) {
    toast('该事件暂无有效地图坐标');
    return;
  }

  SELECTED_EVENT_ID = eventId;
  clearMapPopups();
  goPage('dashboard', document.querySelector('.nav-item[data-page="dashboard"]'));
  setMapDataLayerVisibility('events', true);
  initializeMapLayerVisibility();
  window._eventLayerVisibility[getEventLayerKey(evt)] = true;
  syncMapLayerControlsFromVisibility();
  highlightSelectedEventMarker();

  var sceneFocus = focusGeoSceneEvent(evt);
  focusCesiumEvent(evt);
  var focusFinished = window._geoSceneView ? sceneFocus : new Promise(function(resolve) {
    window.setTimeout(function() { resolve(false); }, 850);
  });

  Promise.resolve(focusFinished).then(function() {
    window.requestAnimationFrame(function() {
      revealLocatedMapEvent(evt);
      toast('已定位到地图：' + eventId);
    });
  });
}

// 从 JSON 数据渲染事件详情
function renderEventDetailFromJSON() {
  if (!APP_DATA || !APP_DATA.eventDetail) return;
  var ed = APP_DATA.eventDetail;
  var statusClass = getStatusClass(ed.status);
  var photoUrl = resolveWebReportPhotoUrl(ed.photoUrl);
  var photoContent = photoUrl ?
    '<div class="det-photo"><a class="det-photo-link" href="' + escapeMapText(photoUrl) + '" target="_blank" rel="noopener noreferrer" aria-label="打开现场照片原图">' +
      '<img class="det-photo-image" src="' + escapeMapText(photoUrl) + '" alt="事件 ' + escapeMapText(ed.id) + ' 的现场照片">' +
      '<span class="det-photo-error">图片暂时无法加载</span>' +
    '</a><div class="det-photo-caption">现场实拍 · 点击查看原图</div></div>' :
    '<div class="det-photo empty">📷<div>现场未上传照片</div></div>';
  var workflowActions = '';
  if (ed.canAudit === true) {
    workflowActions +=
      '<button class="btn btn-success" onclick="eventApprove()">✓ 通过 · 转入处理中</button>' +
      '<button class="btn btn-danger" onclick="eventReject()">✗ 驳回</button>';
  } else if (ed.canUpdate === true) {
    workflowActions += '<button class="btn btn-success" onclick="eventComplete()">✓ 标记已修复</button>';
  }
  workflowActions += '<button class="btn btn-outline" id="eventMapLocateButton">📍 地图定位</button>';
  var deleteCard = (window.userRole === 'admin' && ed.canDelete === true) ?
    '<div class="det-card full event-danger-zone" id="eventDeleteSection">' +
      '<h3>危险操作</h3>' +
      '<div class="event-danger-content">' +
        '<p>永久删除后，该事件会从列表、地图及统计数据中移除，此操作无法撤销。</p>' +
        '<button class="btn btn-danger" onclick="requestDeleteEvent(\'' + ed.id + '\')">🗑️ 永久删除事件</button>' +
      '</div>' +
    '</div>' : '';
  // 更新页面标题
  pages['event-detail'] = ['事件详情 — ' + ed.id, 'Web 管理端 / 事件管理 / 事件详情'];

  // 更新详情页内容
  var detailPage = document.getElementById('page-event-detail');
  if (!detailPage) return;

  var grid = detailPage.querySelector('.det-grid');
  if (!grid) return;
  grid.innerHTML =
    '<div class="det-card full">' +
      '<h3>事件详情 — ' + ed.id + ' (W-10)</h3>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;">' +
        '<div>' +
          '<div class="det-field"><span class="df-lbl">事件类型</span><span class="df-val"><span class="st-badge ' + statusClass + '" id="detStatus">' + ed.type + '</span></span></div>' +
          '<div class="det-field"><span class="df-lbl">当前状态</span><span class="df-val"><span class="st-badge ' + statusClass + '" id="detStateBadge">' + ed.status + '</span></span></div>' +
          '<div class="det-field"><span class="df-lbl">上报人</span><span class="df-val">' + ed.reporter + ' (' + ed.reporterType + ')</span></div>' +
        '</div>' +
        '<div>' +
          '<div class="det-field"><span class="df-lbl">坐标</span><span class="df-val">' + ed.coords + '</span></div>' +
          '<div class="det-field"><span class="df-lbl">区域</span><span class="df-val">' + ed.district + ' · ' + ed.address + '</span></div>' +
          '<div class="det-field"><span class="df-lbl">上报时间</span><span class="df-val">' + ed.reportTime + '</span></div>' +
        '</div>' +
        '<div>' +
          '<div class="det-field"><span class="df-lbl">参考地标</span><span class="df-val">' + ed.landmark + '</span></div>' +
          '<div class="det-field"><span class="df-lbl">优先级</span><span class="df-val" style="color:var(--danger);">' + ed.priority + '</span></div>' +
          '<div class="det-field"><span class="df-lbl">SLA</span><span class="df-val">' + ed.sla + '</span></div>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div class="det-card">' +
      '<h3>问题描述</h3>' +
      '<p style="font-size:12px;color:var(--text-secondary);line-height:1.8;">' + ed.description + '</p>' +
      '<div style="margin-top:12px;font-size:11px;color:var(--text-muted);">上报方式: ' + ed.reportMethod + '</div>' +
    '</div>' +
    '<div class="det-card">' +
      '<h3>现场照片 (W-10)</h3>' +
      photoContent +
    '</div>' +
    '<div class="det-card full" id="auditSection">' +
      '<h3>事件操作 (W-09)</h3>' +
      '<div class="det-actions">' + workflowActions + '</div>' +
    '</div>' + deleteCard;
  var photoImage = grid.querySelector('.det-photo-image');
  if (photoImage) {
    photoImage.addEventListener('error', function() {
      photoImage.hidden = true;
      var error = grid.querySelector('.det-photo-error');
      if (error) error.style.display = 'flex';
    });
  }
  var locateButton = grid.querySelector('#eventMapLocateButton');
  if (locateButton) {
    locateButton.addEventListener('click', function() {
      locateEventOnMap(ed.id);
    });
  }
}

// ========== 初始化 - 加载 JSON 数据后渲染页面 ==========
function initAllFromJSON() {
  if (APP_DATA) {
    // 用 JSON 数据覆盖 JS 配置
    if (APP_DATA.pageTitles) {
      Object.keys(APP_DATA.pageTitles).forEach(function(k) {
        pages[k] = APP_DATA.pageTitles[k];
      });
    }

    // 渲染所有页面元素
    renderDashboardFromJSON();
    renderMapFromJSON();
    renderViewTabsFromJSON();
    renderFacilityLegend();
    renderEventsFromJSON();
    renderEventDetailFromJSON();
    loadChartDataFromJSON();

    // 更新导航徽章
    var badgeEl = document.getElementById('navEventsBadge');
    if (badgeEl && APP_DATA.events) {
      badgeEl.textContent = APP_DATA.events.length;
    }
  }
}

// ========== 从外部 JSON 文件加载数据 ==========
// 合并函数：将 config（真数据/长期保留）和 mock（假数据/后端替换）合并
function deepMerge(target, source) {
  var result = {};
  for (var key in target) { if (target.hasOwnProperty(key)) { result[key] = target[key]; } }
  for (var key in source) {
    if (!source.hasOwnProperty(key)) continue;
    if (key.indexOf('_') === 0) continue; // 跳过 _xxx 注释字段
    if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key]) &&
        typeof result[key] === 'object' && result[key] !== null && !Array.isArray(result[key])) {
      result[key] = deepMerge(result[key], source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

function getWebApiBase(config) {
  var configured = config && config.api && config.api.baseUrl;
  if (configured && configured !== 'auto') return configured.replace(/\/$/, '');
  if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
    if (window.location.port === '8000') return window.location.origin;
  }
  return 'http://127.0.0.1:8000';
}

function authHeaders() {
  var token = localStorage.getItem('a11y_web_token');
  return token ? { 'Authorization': 'Bearer ' + token } : {};
}

function fetchWebJSON(url, options) {
  return fetch(url, options || {}).then(function(r) {
    return r.json().then(function(data) {
      if (!r.ok) throw new Error(data.detail || ('HTTP ' + r.status));
      return data;
    });
  });
}

function loadWebData(options) {
  options = options || {};
  var configPromise = fetch('data/web-config.json?v=' + WEB_DATA_VERSION, { cache: 'no-store' })
    .then(function(r) { return r.ok ? r.json() : {}; })
    .catch(function() { return {}; });

  var mockPromise = fetch('data/web-mock-api.json?v=' + WEB_DATA_VERSION, { cache: 'no-store' })
    .then(function(r) { return r.ok ? r.json() : {}; })
    .catch(function() { return {}; });

  return Promise.all([configPromise, mockPromise]).then(function(results) {
    var config = results[0];
    var mock = results[1];
    var apiBase = getWebApiBase(config);
    var headers = authHeaders();

    return Promise.all([
      fetchWebJSON(apiBase + '/api/web/dashboard/stats', { headers: headers }),
      fetchWebJSON(apiBase + '/api/web/map/config', { headers: headers }),
      fetchWebJSON(apiBase + '/api/web/map/data', { headers: headers }),
      fetchWebJSON(apiBase + '/api/web/events', { headers: headers }),
      fetchWebJSON(apiBase + '/api/web/charts/trend?period=day', { headers: headers }),
      fetchWebJSON(apiBase + '/api/web/charts/trend?period=week', { headers: headers }),
      fetchWebJSON(apiBase + '/api/web/charts/trend?period=month', { headers: headers }),
      fetchWebJSON(apiBase + '/api/web/charts/distribution', { headers: headers }),
      fetchWebJSON(apiBase + '/api/web/map/facilities', { headers: headers }).catch(function(error) {
        console.warn('[Web] 福田设施图层数据不可用:', error && (error.message || error));
        return { coordinateSystem: 'WGS84', featureCount: 0, summary: [], boundary: null, features: [] };
      }),
      fetchWebJSON(apiBase + '/api/web/map/building-semantics', { headers: headers }).catch(function(error) {
        console.warn('[Web] 建筑语义关联数据不可用:', error && (error.message || error));
        return { type: 'FeatureCollection', features: [], facilityLinks: {}, metadata: {} };
      })
    ]).then(function(apiResults) {
      var events = apiResults[3] || [];
      var preferredId = options.detailEventId || SELECTED_EVENT_ID;
      var firstId = events.length ? events[0].id : 'E20260701';
      if (preferredId && events.some(function(evt) { return evt.id === preferredId; })) {
        firstId = preferredId;
      }
      SELECTED_EVENT_ID = SELECTED_EVENT_ID || firstId;
      return fetchWebJSON(apiBase + '/api/web/events/' + encodeURIComponent(firstId), { headers: headers })
        .catch(function() { return mock.eventDetail || {}; })
        .then(function(eventDetail) {
          var facilities = apiResults[8] || { features: [] };
          var buildingSemantics = apiResults[9] || { features: [], facilityLinks: {}, metadata: {} };
          var facilityLinks = buildingSemantics.facilityLinks || {};
          (facilities.features || []).forEach(function(item) {
            var link = facilityLinks[item.id];
            if (!link) return;
            item.semanticBuildingId = link.buildingId || '';
            item.semanticMatchMethod = link.matchMethod || '';
          });
          APP_DATA = deepMerge(config, {
            dashboard: {
              stats: apiResults[0],
              map: apiResults[2]
            },
            mapConfig: apiResults[1],
            events: events,
            eventDetail: eventDetail,
            chartPeriods: {
              day: apiResults[4],
              week: apiResults[5],
              month: apiResults[6]
            },
            chartTypeDistribution: apiResults[7],
            mapFacilities: facilities,
            buildingSemantics: buildingSemantics
          });
          console.log('[Web] 数据已加载 (backend-api)');
        });
    }).catch(function(apiErr) {
      APP_DATA = deepMerge(config, mock);
      if (Object.keys(config).length > 0 || Object.keys(mock).length > 0) {
        console.warn('[Web] 后端 API 不可用，使用 mock JSON:', apiErr.message);
        return;
      }
      throw new Error('所有外部 JSON 加载失败');
    });
  }).catch(function(err) {
    console.warn('[Web] 外部 JSON 加载失败，使用内联回退数据:', err.message);
    APP_DATA = getWebFallbackData();
  });
}

function applyRoleRestrictions() {
  if (!APP_DATA) return;
  var label = document.getElementById('navEventsLabel');
  var badge = document.getElementById('navEventsBadge');
  if (window.userRole === 'user') {
    if (label) label.textContent = '事件查看';
    if (badge) badge.textContent = '';
    pages['events'] = ['事件查看', 'Web 管理端 / 事件查看'];
  } else if (badge && APP_DATA.events) {
    badge.textContent = APP_DATA.events.length;
  }

  var audit = document.getElementById('auditSection');
  if (audit) audit.style.display = window.userRole === 'user' ? 'none' : '';
  var deleteSection = document.getElementById('eventDeleteSection');
  if (deleteSection) deleteSection.style.display = window.userRole === 'admin' ? '' : 'none';

  var avatarEl = document.getElementById('topAvatar');
  var nameEl = document.getElementById('topUserName');
  if (avatarEl && nameEl && window.userName) {
    avatarEl.textContent = window.userName.charAt(0).toUpperCase();
    nameEl.textContent = window.userName;
  }

  if (window.userRole !== 'admin') {
    document.querySelectorAll('#page-events .act-link').forEach(function(link) {
      if (link.textContent.trim() !== '查看') {
        link.style.display = 'none';
      }
    });
  }
}

function refreshWebSnapshot() {
  return loadWebData({ detailEventId: SELECTED_EVENT_ID }).then(function() {
    // 自动刷新只更新业务数据；SceneView、底图和完整白模保持原实例，
    // 避免周期性刷新触发昂贵的 DOM/图层重建和 WebGL 资源抖动。
    renderDashboardFromJSON();
    renderEventsFromJSON();
    renderEventDetailFromJSON();
    loadChartDataFromJSON();
    applyRoleRestrictions();
    syncGeoSceneEventLayer();
    syncTiles3DEventMarkers();
    return true;
  }).catch(function(err) {
    console.warn('[Web] 自动刷新失败:', err.message);
    return false;
  });
}

function manualRefreshWebData(button) {
  button = button || document.getElementById('refreshWebButton');
  if (button && button.disabled) return Promise.resolve(false);
  var originalLabel = button ? button.textContent : '⟳ 刷新数据';
  if (button) {
    button.disabled = true;
    button.textContent = '⟳ 正在刷新…';
  }

  return refreshWebSnapshot().then(function(succeeded) {
    if (!succeeded) {
      toast('数据刷新失败，请检查后端连接');
      return false;
    }
    applyEventFilters();
    var activePeriod = document.querySelector('#page-charts .filter-chip.on');
    if (activePeriod) {
      switchChartPeriod(activePeriod.dataset.period || 'month', activePeriod);
    }
    toast('数据刷新成功');
    return true;
  }).finally(function() {
    if (button) {
      button.disabled = false;
      button.textContent = originalLabel;
    }
  });
}

function startWebAutoRefresh() {
  if (webRefreshTimer) clearInterval(webRefreshTimer);
  webRefreshTimer = setInterval(function() {
    if (document.hidden) return;
    refreshWebSnapshot();
  }, WEB_REFRESH_MS);
}

// Init on load — 优先从 JSON 文件加载，失败时使用内联回退数据
window.addEventListener('load', function() {
  loadWebData().then(function() {
    // Role detection
    var params = new URLSearchParams(window.location.search);
    window.userRole = params.get('role') || localStorage.getItem('a11y_web_role') || 'admin';
    window.userName = params.get('user') || localStorage.getItem('a11y_web_user') || '';

    initAllFromJSON();

    if (window.userRole === 'user') {
      var label = document.getElementById('navEventsLabel');
      if (label) label.textContent = '事件查看';
      var badge = document.getElementById('navEventsBadge');
      if (badge) badge.textContent = '';
      pages['events'] = ['事件查看', 'Web 管理端 / 事件查看'];
    }

    applyEventFilters();
    initChart();
    var hash = window.location.hash.replace('#', '');
    if (hash && pages[hash]) {
      goPage(hash);
    }

    // Hide audit section for regular users
    if (window.userRole === 'user') {
      var audit = document.getElementById('auditSection');
      if (audit) audit.style.display = 'none';
    }

    // Set user avatar & name from login
    var avatarEl = document.getElementById('topAvatar');
    var nameEl = document.getElementById('topUserName');
    if (avatarEl && nameEl && window.userName) {
      avatarEl.textContent = window.userName.charAt(0).toUpperCase();
      nameEl.textContent = window.userName;
    }

    // Regular users: only keep "查看" action in event list
    if (window.userRole !== 'admin') {
      document.querySelectorAll('#page-events .act-link').forEach(function(link) {
        if (link.textContent.trim() !== '查看') {
          link.style.display = 'none';
        }
      });
    }

    applyRoleRestrictions();
    startWebAutoRefresh();
  }); // end loadWebData then
}); // end load event listener
window.addEventListener('hashchange', function() {
  const hash = window.location.hash.replace('#', '');
  if (hash && pages[hash]) {
    goPage(hash);
  }
});
window.addEventListener('storage', function(e) {
  if (e.key !== 'a11y_report_updated') return;
  refreshWebSnapshot().then(function() {
    var payload = {};
    try { payload = JSON.parse(e.newValue || '{}'); } catch (err) {}
    if (payload.eventId) {
      toast(payload.action === 'deleted' ? '移动端已删除上报：' + payload.eventId : '收到移动端新上报：' + payload.eventId);
    }
  });
});

// Toast
function toast(msg) {
  const box = document.getElementById('toastBox');
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  box.appendChild(t);
  while (box.children.length > 4) { box.firstChild.remove(); }
  setTimeout(() => t.remove(), 2300);
}

// Logout
function doLogout() {
  if (confirm('确定退出登录吗？')) {
    localStorage.removeItem('a11y_web_logged_in');
    localStorage.removeItem('a11y_web_user');
    localStorage.removeItem('a11y_web_role');
    localStorage.removeItem('a11y_web_token');
    window.location.href = '登录.html';
  }
}

// 内联回退数据 - 与 data/web-manager-data.json 保持同步
// 当 JSON 文件无法通过 HTTP 加载时使用此数据
function getWebFallbackData() {
  return {"app":{"name":"无障碍出行助手","subtitle":"GeoScene · 深圳福田","defaultUser":"管理员"},"pageTitles":{"dashboard":["三维数字孪生大屏","Web 管理端 / 三维数字孪生大屏"],"events":["事件管理","Web 管理端 / 事件管理模块"],"event-detail":["事件详情 — E20260701","Web 管理端 / 事件管理 / 事件详情"],"charts":["趋势图表分析","Web 管理端 / 趋势图表分析"]},"dashboard":{"stats":[{"icon":"📏","iconBg":"rgba(0,212,255,0.13)","value":"18.6","unit":"km","label":"示范区盲道里程 (W-06)","change":"深圳福田中心区","changeColor":"success","action":"events"},{"icon":"📊","iconBg":"rgba(46,204,113,0.13)","value":"86.4%","unit":"","label":"盲道可通行率 (W-02)","change":"福田中心区示范数据","changeColor":"success","action":"toast","actionMsg":"福田中心区盲道可通行率：86.4%"},{"icon":"⚠️","iconBg":"rgba(255,69,96,0.13)","value":"3","unit":"","label":"待处理事件 (W-06)","change":"需紧急: 1","changeColor":"danger","action":"events"},{"icon":"📈","iconBg":"rgba(168,85,247,0.13)","value":"5","unit":"","label":"本月新增上报 (W-06)","change":"↑ +15% vs 上月","changeColor":"success","action":"charts"}],"map":{"center":{"lon":"114.055°E","lat":"22.535°N","location":"深圳福田中心区示范区"},"viewTabs":["示范区总览","市民中心","香蜜湖-市民中心"],"buildings":[{"left":55,"top":170,"width":70,"height":50,"type":"normal","name":"卓悦中心","coverage":"78%","facility":"120m"},{"left":150,"top":100,"width":48,"height":80,"type":"tall","name":"领展中心城","coverage":"65%","facility":"200m"},{"left":230,"top":190,"width":82,"height":42,"type":"normal","name":"香蜜湖广场","coverage":"82%","facility":"80m"},{"left":340,"top":90,"width":52,"height":90,"type":"tall","name":"平安金融中心","coverage":"71%","facility":"150m"},{"left":120,"top":290,"width":60,"height":38,"type":"normal","name":"","coverage":"","facility":""},{"left":280,"top":270,"width":88,"height":46,"type":"normal","name":"","coverage":"","facility":""},{"left":410,"top":240,"width":44,"height":68,"type":"tall","name":"","coverage":"","facility":""},{"left":380,"top":320,"width":64,"height":36,"type":"normal","name":"","coverage":"","facility":""}],"heatmap":[{"top":130,"left":80,"width":190,"height":140,"color":"rgba(255,69,96,0.22)"},{"top":90,"left":290,"width":150,"height":100,"color":"rgba(240,160,48,0.18)"},{"top":240,"left":170,"width":130,"height":90,"color":"rgba(46,204,113,0.12)"}],"events":[{"top":155,"left":145,"type":"danger","id":"E20260701","title":"盲道被占","location":"福华路市民中心"},{"top":210,"left":275,"type":"warning","id":"E20260702","title":"盲道损坏","location":"深南大道"},{"top":290,"left":360,"type":"danger","id":"E20260703","title":"盲道缺失","location":"彩田路"},{"top":115,"left":395,"type":"warning","id":"E20260704","title":"盲道被占","location":"福民路"}],"legend":[{"key":"danger-dots","color":"#ff4560","label":"盲道被占","enabled":true},{"key":"warning-dots","color":"#f0a030","label":"盲道损坏","enabled":true},{"key":"muted-dots","color":"#5a6380","label":"盲道缺失","enabled":true},{"key":"heat-spots","color":"rgba(255,69,96,0.5)","label":"热力覆盖","enabled":true}]}},"events":[{"id":"E20260701","type":"盲道被占","coords":"114.055,22.535","district":"福田区","reporter":"张**","time":"07-01 09:32","status":"待审核","canAudit":true,"canUpdate":false,"detailPage":true},{"id":"E20260702","type":"盲道损坏","coords":"114.060,22.537","district":"福田区","reporter":"李**","time":"07-01 10:15","status":"处理中","canAudit":false,"canUpdate":true,"detailPage":true},{"id":"E20260703","type":"盲道缺失","coords":"114.049,22.541","district":"福田区","reporter":"王**","time":"07-02 08:44","status":"已修复","canAudit":false,"canUpdate":false,"detailPage":false},{"id":"E20260704","type":"盲道被占","coords":"114.066,22.529","district":"福田区","reporter":"赵**","time":"07-02 14:20","status":"待审核","canAudit":true,"canUpdate":false,"detailPage":true},{"id":"E20260705","type":"盲道损坏","coords":"114.058,22.539","district":"福田区","reporter":"孙**","time":"07-03 11:08","status":"驳回","canAudit":false,"canUpdate":false,"detailPage":true}],"eventDetail":{"id":"E20260701","type":"盲道被占","status":"待审核","reporter":"张**","reporterType":"低视力","coords":"114.055, 22.535","district":"福田区","address":"福华路","landmark":"市民中心地铁站C口","priority":"高","sla":"48小时内响应","reportTime":"2026-07-01 09:32","description":"\"福华路市民中心往香蜜湖方向，地铁站C出口外约30米处，大量共享单车堆积占用盲道，视障人士需绕行机动车道，存在严重安全隐患。\"","reportMethod":"语音一键上报 (M-11)"},"chartPeriods":{"day":{"title":"上报事件趋势 — 近14天 (W-11)","points":"60,165 90,145 120,125 150,100 180,135 210,85 240,110 270,75 300,95 330,65 360,80 390,55 420,70 450,50","labels":[{"x":60,"y":255,"label":"6/24"},{"x":150,"y":255,"label":"6/27"},{"x":240,"y":255,"label":"6/30"},{"x":330,"y":255,"label":"7/03"},{"x":450,"y":255,"label":"7/07"}]},"week":{"title":"上报事件趋势 — 近8周 (W-11)","points":"70,170 130,120 190,145 250,80 310,110 370,65 430,95 470,55","labels":[{"x":70,"y":255,"label":"W19"},{"x":130,"y":255,"label":"W20"},{"x":190,"y":255,"label":"W21"},{"x":250,"y":255,"label":"W22"},{"x":310,"y":255,"label":"W23"},{"x":370,"y":255,"label":"W24"},{"x":430,"y":255,"label":"W25"},{"x":470,"y":255,"label":"W26"}]},"month":{"title":"上报事件趋势 — 近6月 (W-11)","points":"70,175 140,140 210,100 280,120 350,75 430,50","labels":[{"x":70,"y":255,"label":"1月"},{"x":140,"y":255,"label":"2月"},{"x":210,"y":255,"label":"3月"},{"x":280,"y":255,"label":"4月"},{"x":350,"y":255,"label":"5月"},{"x":430,"y":255,"label":"6月"}]}},"chartTypeDistribution":{"total":5,"segments":[{"type":"被占","percent":"45%","color":"#ff4560"},{"type":"损坏","percent":"30%","color":"#f0a030"},{"type":"缺失","percent":"25%","color":"#5a6380"}]}};
}
