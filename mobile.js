// ========== 数据层 ==========
// 数据优先从外部 JSON 文件加载，加载失败时使用内联回退数据
var MOBILE_DATA = null;
var REPORT_DRAFT = {
  type: '',
  description: '',
  location: '',
  lon: null,
  lat: null,
  photo: null,
  voiceUsed: false,
  reviewedAt: null
};
var REPORT_RESULT_IS_NEW = false;
var SELECTED_MOBILE_REPORT = null;
var reportClockTimer = null;
var FUTIAN_DEMO_ORIGIN = { name: '福田中心演示点（购物公园）', lon: 114.0550, lat: 22.5350 };
var SELECTED_BUS_STOP = null;
var BUS_ALERT_DEMO_TIMER = null;

// ========== 从外部 JSON 文件加载数据 ==========
// 合并函数：将 config（真数据/长期保留）和 mock（假数据/后端替换）合并
function deepMergeMobile(target, source) {
  var result = {};
  for (var key in target) { if (target.hasOwnProperty(key)) { result[key] = target[key]; } }
  for (var key in source) {
    if (!source.hasOwnProperty(key)) continue;
    if (key.indexOf('_') === 0) continue; // 跳过 _xxx 注释字段
    if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key]) &&
        typeof result[key] === 'object' && result[key] !== null && !Array.isArray(result[key])) {
      result[key] = deepMergeMobile(result[key], source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

function getMobileApiBase(config) {
  var configured = config && config.api && config.api.baseUrl;
  if (configured && configured !== 'auto') return configured.replace(/\/$/, '');
  if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
    if (window.location.port === '8000') return window.location.origin;
  }
  return 'http://127.0.0.1:8000';
}

function mobileAuthHeaders(extra) {
  var token = localStorage.getItem('a11y_mobile_token');
  var headers = extra || {};
  if (token) headers.Authorization = 'Bearer ' + token;
  return headers;
}

function fetchMobileJSON(url, options) {
  return fetch(url, options || {}).then(function(r) {
    return r.json().then(function(data) {
      if (!r.ok) throw new Error(data.detail || ('HTTP ' + r.status));
      return data;
    });
  });
}

function loadMobileData() {
  var configPromise = fetch('data/mobile-config.json')
    .then(function(r) { return r.ok ? r.json() : {}; })
    .catch(function() { return {}; });

  var mockPromise = fetch('data/mobile-mock-api.json')
    .then(function(r) { return r.ok ? r.json() : {}; })
    .catch(function() { return {}; });

  return Promise.all([configPromise, mockPromise]).then(function(results) {
    var config = results[0];
    var mock = results[1];
    var apiBase = getMobileApiBase(config);
    var headers = mobileAuthHeaders();

    return Promise.all([
      fetchMobileJSON(apiBase + '/api/mobile/weather'),
      fetchMobileJSON(apiBase + '/api/mobile/home', { headers: headers }),
      fetchMobileJSON(apiBase + '/api/mobile/navigation/status', { headers: headers }),
      fetchMobileJSON(apiBase + '/api/mobile/bus/realtime', { headers: headers }),
      fetchMobileJSON(apiBase + '/api/mobile/report/history', { headers: headers }),
      fetchMobileJSON(apiBase + '/api/mobile/user/profile', { headers: headers }),
      fetchMobileJSON(apiBase + '/api/mobile/user/routes', { headers: headers }),
      fetchMobileJSON(apiBase + '/api/mobile/user/settings', { headers: headers }),
      fetchMobileJSON(apiBase + '/api/mobile/perception', { headers: headers })
    ]).then(function(apiResults) {
      var profile = apiResults[5] || {};
      var reportHistory = apiResults[4] || [];
      MOBILE_DATA = deepMergeMobile(config, {
        app: { weather: apiResults[0].weather },
        home: apiResults[1],
        navigation: apiResults[2],
        bus: apiResults[3],
        report: {
          title: mock.report && mock.report.title,
          recognizedSample: mock.report && mock.report.recognizedSample,
          history: reportHistory
        },
        profile: {
          defaultName: profile.defaultName,
          city: profile.city,
          role: profile.role,
          version: profile.version,
          company: profile.company,
          favoriteRoutes: apiResults[6],
          reportHistory: reportHistory,
          settings: apiResults[7],
          perception: apiResults[8]
        }
      });
      console.log('[Mobile] 数据已加载 (backend-api)');
    }).catch(function(apiErr) {
      MOBILE_DATA = deepMergeMobile(config, mock);
      if (Object.keys(config).length > 0 || Object.keys(mock).length > 0) {
        console.warn('[Mobile] 后端 API 不可用，使用 mock JSON:', apiErr.message);
        return;
      }
      throw new Error('所有外部 JSON 加载失败');
    });
  }).catch(function(err) {
    console.warn('[Mobile] 外部 JSON 加载失败，使用内联回退数据:', err.message);
    MOBILE_DATA = getMobileFallbackData();
  });
}

// 内联数据源
function getMobileFallbackData() {
  return {"app":{"name":"无障碍出行","weather":"深圳 · 今日晴 32°C"},"tabs":[{"id":"home","icon":"🏠","label":"首页","active":true},{"id":"nav","icon":"🧭","label":"导航"},{"id":"bus","icon":"🚌","label":"公交"},{"id":"report","icon":"📝","label":"上报"},{"id":"me","icon":"👤","label":"我的"}],"home":{"quickActions":[{"icon":"🕐","title":"最近常用","desc":"市民中心地铁站F口","dest":"市民中心地铁站F口"},{"icon":"👁️","title":"AI环境感知","desc":"实时识别周边障碍","page":"me"},{"icon":"🚌","title":"智慧公交","desc":"查看附近公交","page":"bus"},{"icon":"📝","title":"一键上报","desc":"反馈盲道问题","page":"report"}],"favoriteRoutes":[{"icon":"🏠","name":"市民中心地铁站F口","detail":"福华路 · 约850m · 有盲道","dest":"市民中心地铁站F口"},{"icon":"⭐","name":"莲花山公园","detail":"约3.2km · 地铁可达","dest":"莲花山公园"}]},"navigation":{"title":"语音导航中 (M-01~M-04)","destination":"市民中心地铁站","distance":"850m","alerts":[{"type":"info","title":"语义化播报 (M-02)","content":"\"沿福华路直行200米，经过市民中心后右转，前方盲道畅通\""},{"type":"warn","title":"避障重规划 (M-03)","content":"\"前方盲道被占，已重新规划绕行路线，请沿当前方向继续\""}],"vibrationPatterns":[{"pattern":"⚡⚡⚡","label":"障碍"},{"pattern":"⚡⚡··","label":"红灯"},{"pattern":"⚡·⚡·","label":"绿灯"},{"pattern":"⚡━━","label":"偏航"}]},"bus":{"title":"智慧公交伴侣 (M-08~M-10)","subtitle":"高德实时公交API | 到站提醒","currentStation":"福华路市民中心站","lines":[{"number":"510","color":"#ff4560","route":"深圳北站 → 会展中心","status":"即将进站 (M-09)","statusColor":"#ff4560","arriveIcon":"⚡⚡","isArriving":true},{"number":"703","color":"#0066ff","route":"福田站 → 市民中心","status":"预计 5 分钟到站","arriveTime":"5分","isArriving":false},{"number":"518","color":"#2ecc71","route":"福田站 → 莲花山公园","status":"预计 12 分钟到站","arriveTime":"12分","isArriving":false}],"alightingAlert":{"targetStation":"会展中心","remainingStops":3,"hint":"到站前200米震动+语音双重提醒"}},"report":{"title":"一键上报 (M-11~M-13)","recognizedSample":{"type":"盲道被占","coords":"114.0550, 22.5350","landmark":"福华路市民中心"},"history":[{"date":"07-01","desc":"福华路盲道被占","status":"处理中","eventId":"E20260701"},{"date":"06-28","desc":"市民中心盲道损坏","status":"已修复","eventId":"E20260702"}]},"profile":{"defaultName":"视障用户","city":"深圳","role":"普通用户","version":"v1.0.0","company":"GeoScene · 深圳福田","settings":{"voiceTypes":["温柔女声","沉稳男声","清晰女声","标准女声"],"defaults":{"speed":1,"volume":80,"vibration":2,"voiceType":"温柔女声","toggles":{"nav_blind_lane":true,"nav_avoid_construction":true,"nav_avoid_stairs":false,"nav_auto_reroute":true,"ui_large_font":false,"ui_high_contrast":false,"ui_screen_reader":true,"ui_key_sound":true}}},"favoriteRoutes":[{"icon":"🏠","name":"市民中心地铁站F口","detail":"福华路 · 约850m · 有盲道","dest":"市民中心地铁站F口"},{"icon":"⭐","name":"莲花山公园","detail":"约3.2km · 地铁可达","dest":"莲花山公园"},{"icon":"🏥","name":"深圳市眼科医院","detail":"福田区 · 约5.8km","dest":"深圳市眼科医院"}],"reportHistory":[{"date":"07-01","type":"盲道被占","location":"福华路市民中心","status":"处理中","eventId":"E20260701"},{"date":"06-28","type":"盲道损坏","location":"市民中心","status":"已修复","eventId":"E20260702"}],"perception":{"trafficLight":{"type":"danger","label":"当前红灯，请等待"},"obstacle":{"type":"warn","label":"前方3米检测到锥桶"},"blindLaneQuality":{"type":"info","label":"评分 7.2/10，轻微磨损"}}}};
}

// ========== 数据驱动渲染函数 ==========
// 从 JSON 渲染首页快捷操作
function renderHomeFromJSON() {
  if (!MOBILE_DATA || !MOBILE_DATA.home) return;
  var hd = MOBILE_DATA.home;

  // 快捷操作卡片
  if (hd.quickActions) {
    var grid = document.querySelector('#mPage-home .quick-grid');
    if (grid) {
      grid.innerHTML = '';
      hd.quickActions.forEach(function(action) {
        var card = document.createElement('button');
        card.type = 'button';
        card.className = 'quick-card';
        if (action.page) {
          card.setAttribute('onclick', "mGoPage('" + action.page + "')");
        } else if (action.dest) {
          card.setAttribute('onclick', "startFavRoute('" + action.dest + "')");
        }
        card.innerHTML = '<div class="qc-title">' + action.icon + ' ' + action.title + '</div>' +
          '<div class="qc-desc">' + action.desc + '</div>';
        grid.appendChild(card);
      });
    }
  }

  // 常用路线
  if (hd.favoriteRoutes) {
    var favContainer = document.getElementById('homeFavRoutes');
    if (favContainer) {
      // 保留标题行
      var titleEl = favContainer.querySelector('.fs-title');
      favContainer.innerHTML = '';
      if (titleEl) favContainer.appendChild(titleEl);
      hd.favoriteRoutes.forEach(function(route) {
        var item = document.createElement('button');
        item.type = 'button';
        item.className = 'fav-route-item';
        item.setAttribute('onclick', "startFavRoute('" + route.dest + "')");
        item.innerHTML = '<div class="fr-icon">' + route.icon + '</div>' +
          '<div class="fr-info"><div class="fr-name">' + route.name + '</div><div class="fr-detail">' + route.detail + '</div></div>' +
          '<div class="fr-go">→</div>';
        favContainer.appendChild(item);
      });
    }
  }
}

// 从 JSON 渲染导航页信息
function renderNavFromJSON() {
  setNavigationStage('idle');
}

function isWithinFutianCoverage(coords) {
  if (!coords || !Number.isFinite(Number(coords.lon)) || !Number.isFinite(Number(coords.lat))) return false;
  var lon = Number(coords.lon);
  var lat = Number(coords.lat);
  return lon >= 113.98 && lon <= 114.14 && lat >= 22.48 && lat <= 22.59;
}

function startBusStopNavigation() {
  var stop = SELECTED_BUS_STOP;
  if (!stop) return mToast('请先选择一个公交站');
  startFavRoute(stop.name, { lon: stop.lon, lat: stop.lat });
}

function playBusArrivalDemo() {
  var stop = SELECTED_BUS_STOP;
  if (!stop) return mToast('请先选择一个公交站');
  var alertBox = document.querySelector('#mPage-bus .bus-alert');
  var alertText = document.getElementById('busAlertText');
  var button = document.getElementById('busAlertDemoBtn');
  var message = '模拟提醒：您关注的公交车辆即将到达' + stop.name + '，请在安全区域候车。';
  if (BUS_ALERT_DEMO_TIMER) clearTimeout(BUS_ALERT_DEMO_TIMER);
  if (alertBox) alertBox.classList.add('active');
  if (alertText) alertText.textContent = message;
  if (button) { button.disabled = true; button.textContent = '提醒演示中…'; }
  speakNavigation(message);
  if (navigator.vibrate) navigator.vibrate(vibrationPattern([240, 100, 240, 100, 520]));
  BUS_ALERT_DEMO_TIMER = setTimeout(function() {
    if (alertBox) alertBox.classList.remove('active');
    if (button) { button.disabled = false; button.textContent = '▶ 再次体验'; }
  }, 2400);
}

function formatBusDistance(distanceMeters) {
  var distance = Math.max(0, Number(distanceMeters) || 0);
  if (distance < 1000) return Math.round(distance) + '米';
  return (distance / 1000).toFixed(distance < 10000 ? 1 : 0) + '公里';
}

function requestNearbyBusStops(coords, locationLabel, button) {
  var status = document.getElementById('busStatus');
  var list = document.getElementById('busStationList');
  if (status) status.textContent = '正在计算最近站点…';
  if (list) list.innerHTML = '<div class="bus-loading"><span></span> 正在读取真实站点</div>';
  if (button) { button.disabled = true; button.textContent = '定位中…'; }
  var apiBase = getMobileApiBase(MOBILE_DATA);
  var url = apiBase + '/api/mobile/bus/realtime?lon=' + encodeURIComponent(coords.lon) +
    '&lat=' + encodeURIComponent(coords.lat) + '&limit=5';
  return fetchMobileJSON(url, { headers: mobileAuthHeaders() }).then(function(data) {
    data.location = data.location || {};
    data.location.label = locationLabel || data.location.label || '当前位置';
    MOBILE_DATA = MOBILE_DATA || {};
    MOBILE_DATA.bus = data;
    SELECTED_BUS_STOP = null;
    window._busLocationResolved = true;
    renderBusFromJSON();
  }).catch(function(error) {
    if (status) status.textContent = '站点加载失败';
    if (list) {
      list.innerHTML = '<div class="bus-empty">暂时无法读取附近站点<br><button type="button" onclick="refreshNearbyBusStops({ locate: false })">重新加载</button></div>';
    }
    mToast(error.message || '附近公交站加载失败');
  }).finally(function() {
    if (button) { button.disabled = false; button.textContent = '◎ 使用真实定位'; }
  });
}

function refreshNearbyBusStops(options) {
  options = options || {};
  var button = document.getElementById('busRefreshBtn');
  if (options.locate && navigator.geolocation) {
    if (button) { button.disabled = true; button.textContent = '定位中…'; }
    navigator.geolocation.getCurrentPosition(function(position) {
      var coords = wgs84ToGcj02(position.coords.longitude, position.coords.latitude);
      if (!isWithinFutianCoverage(coords)) {
        requestNearbyBusStops(FUTIAN_DEMO_ORIGIN, FUTIAN_DEMO_ORIGIN.name + '（设备不在服务区）', button);
        mToast('当前位置不在福田服务区，已切换到购物公园演示点');
        return;
      }
      window._lastKnownCoords = coords;
      requestNearbyBusStops(coords, '设备当前位置', button);
    }, function() {
      requestNearbyBusStops(FUTIAN_DEMO_ORIGIN, FUTIAN_DEMO_ORIGIN.name + '（定位不可用）', button);
      mToast('定位不可用，已显示购物公园演示点附近站点');
    }, { enableHighAccuracy: true, timeout: 8000, maximumAge: 15000 });
    return;
  }
  return requestNearbyBusStops(FUTIAN_DEMO_ORIGIN, FUTIAN_DEMO_ORIGIN.name, button);
}

function selectBusStop(index) {
  var stops = MOBILE_DATA && MOBILE_DATA.bus && MOBILE_DATA.bus.stops || [];
  var stop = stops[index];
  if (!stop) return;
  SELECTED_BUS_STOP = stop;
  document.querySelectorAll('#busStationList .bus-card').forEach(function(card, cardIndex) {
    var selected = cardIndex === index;
    card.classList.toggle('selected', selected);
    card.setAttribute('aria-pressed', selected ? 'true' : 'false');
  });
  var detail = document.getElementById('busStopDetail');
  if (detail) detail.hidden = false;
  var name = document.getElementById('busDetailName');
  var address = document.getElementById('busDetailAddress');
  var distance = document.getElementById('busDetailDistance');
  if (name) name.textContent = stop.name;
  if (address) address.textContent = stop.address || '福田区公交站点';
  if (distance) distance.textContent = '距离约 ' + formatBusDistance(stop.distanceMeters);
  var alertText = document.getElementById('busAlertText');
  if (alertText) alertText.textContent = '已关注 ' + stop.name + '，可体验模拟语音与振动提醒。';
}

function announceBusStop() {
  var stop = SELECTED_BUS_STOP;
  if (!stop) return mToast('请先选择一个公交站');
  speakNavigation(stop.name + '，距离当前位置约' + formatBusDistance(stop.distanceMeters) + '。点击步行到站，可规划无障碍接驳路线。');
  mToast('正在播报站点信息');
}

// 从真实空间数据渲染公交接驳页
function renderBusFromJSON() {
  if (!MOBILE_DATA || !MOBILE_DATA.bus) return;
  var bus = MOBILE_DATA.bus;
  var stops = Array.isArray(bus.stops) ? bus.stops : [];
  var title = document.querySelector('#mPage-bus .bus-header h2');
  var meta = document.querySelector('#mPage-bus .bus-meta');
  var locEl = document.getElementById('busLocationLabel');
  var status = document.getElementById('busStatus');
  var list = document.getElementById('busStationList');
  var detail = document.getElementById('busStopDetail');
  if (title) title.textContent = bus.title || '无障碍公交接驳';
  if (meta) meta.textContent = bus.subtitle || '福田真实公交站 · 步行接驳 · 模拟提醒';
  if (locEl) locEl.textContent = '📍 ' + ((bus.location && bus.location.label) || FUTIAN_DEMO_ORIGIN.name);
  if (status) status.textContent = stops.length ? '找到 ' + stops.length + ' 个真实站点' : '附近站点暂不可用';
  if (detail) detail.hidden = true;
  if (!list) return;
  list.innerHTML = '';
  if (!stops.length) {
    list.innerHTML = '<div class="bus-empty">没有找到附近公交站<br><button type="button" onclick="refreshNearbyBusStops({ locate: true })">重新定位</button></div>';
    return;
  }
  stops.forEach(function(stop, index) {
    var card = document.createElement('button');
    card.type = 'button';
    card.className = 'bus-card';
    card.setAttribute('aria-pressed', 'false');
    card.addEventListener('click', function() { selectBusStop(index); });
    var icon = document.createElement('span');
    icon.className = 'bus-stop-icon';
    icon.textContent = '🚌';
    var info = document.createElement('span');
    info.className = 'bus-info';
    var name = document.createElement('span');
    name.className = 'bi-line';
    name.textContent = stop.name;
    var address = document.createElement('span');
    address.className = 'bi-status';
    address.textContent = stop.address || '福田区公交站点';
    info.appendChild(name);
    info.appendChild(address);
    var distance = document.createElement('span');
    distance.className = 'bus-distance';
    distance.textContent = formatBusDistance(stop.distanceMeters);
    card.appendChild(icon);
    card.appendChild(info);
    card.appendChild(distance);
    list.appendChild(card);
  });
}

// 从 JSON 渲染上报页历史
function renderReportFromJSON() {
  if (!MOBILE_DATA || !MOBILE_DATA.report) return;
  var report = MOBILE_DATA.report;

  // 上报历史：直接展示时间、类型、内容、位置和状态，不再只弹出一句提示。
  if (report.history) {
    var rhContainer = document.querySelector('#mPage-report .report-history');
    if (rhContainer) {
      var titleEl = rhContainer.querySelector('.rh-title');
      rhContainer.innerHTML = '';
      if (titleEl) rhContainer.appendChild(titleEl);
      if (!report.history.length) {
        var empty = document.createElement('div');
        empty.className = 'rh-empty';
        empty.textContent = '还没有上报记录';
        rhContainer.appendChild(empty);
      }
      report.history.forEach(function(item) {
        var div = document.createElement('div');
        div.className = 'rh-item';
        div.setAttribute('role', 'button');
        div.setAttribute('tabindex', '0');
        var statusColor = item.status === '已修复' ? 'var(--success)' :
          (item.status === '处理中' ? 'var(--warning)' : 'var(--primary)');

        var main = document.createElement('div');
        main.className = 'rh-main';
        var time = document.createElement('span');
        time.textContent = item.dateTime || item.date || '--';
        var type = document.createElement('strong');
        type.textContent = item.type || '事件上报';
        var status = document.createElement('span');
        status.className = 'rh-status';
        status.style.color = statusColor;
        status.textContent = item.status || '待审核';
        main.appendChild(time);
        main.appendChild(type);
        main.appendChild(status);

        var desc = document.createElement('div');
        desc.className = 'rh-desc';
        desc.textContent = item.description || item.desc || '暂无描述';
        var location = document.createElement('div');
        location.className = 'rh-location';
        location.textContent = '📍 ' + (item.location || '位置未记录');

        div.appendChild(main);
        div.appendChild(desc);
        div.appendChild(location);
        if (item.photoUrl) {
          var photoUrl = resolveMobileReportPhotoUrl(item.photoUrl);
          if (photoUrl) {
            var thumbnail = document.createElement('img');
            thumbnail.className = 'rh-photo-thumbnail';
            thumbnail.src = photoUrl;
            thumbnail.alt = (item.type || '事件上报') + '现场照片';
            thumbnail.loading = 'lazy';
            thumbnail.addEventListener('error', function() {
              thumbnail.remove();
              div.classList.remove('has-photo');
            });
            div.classList.add('has-photo');
            div.appendChild(thumbnail);
          }
        }
        div.addEventListener('click', function() { showReportHistoryDetail(item); });
        div.addEventListener('keydown', function(event) {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            showReportHistoryDetail(item);
          }
        });
        rhContainer.appendChild(div);
      });
    }
  }
}

// 从 JSON 渲染"我的"页面
function renderProfileFromJSON() {
  if (!MOBILE_DATA || !MOBILE_DATA.profile) return;
  var profile = MOBILE_DATA.profile;

  // 用户信息
  var userName = localStorage.getItem('a11y_mobile_user') || profile.defaultName;
  var nameEl = document.getElementById('meUserName');
  if (nameEl) nameEl.textContent = userName;

  // 常用路线
  if (profile.favoriteRoutes) {
    var sections = document.querySelectorAll('#mPage-me .settings-section');
    sections.forEach(function(section) {
      var titleEl = section.querySelector('.ss-title');
      if (titleEl && titleEl.textContent.trim().indexOf('常用路线') !== -1) {
        var padDiv = section.querySelector('div[style]') || section.querySelector('div:last-child');
        if (padDiv) {
          // 先收集底部的添加按钮节点
          var addBtnWrapper = padDiv.querySelector('div[style]'); // 按钮的包装 div
          padDiv.innerHTML = '';
          profile.favoriteRoutes.forEach(function(route) {
            var item = document.createElement('button');
            item.type = 'button';
            item.className = 'fav-route-item';
            item.style.marginBottom = '6px';
            item.setAttribute('onclick', "startFavRoute('" + route.dest + "')");
            item.innerHTML = '<div class="fr-icon">' + route.icon + '</div>' +
              '<div class="fr-info"><div class="fr-name">' + route.name + '</div><div class="fr-detail">' + route.detail + '</div></div>' +
              '<div class="fr-go">→</div>';
            padDiv.appendChild(item);
          });
          // 重新添加底部按钮
          var btnWrap = document.createElement('div');
          btnWrap.style.cssText = 'text-align:center;margin-top:4px;';
          btnWrap.innerHTML = '<button onclick="addFavRoute()" style="font-size:11px;padding:6px 18px;border:1px dashed var(--border);border-radius:16px;background:transparent;color:var(--text3);cursor:pointer;">+ 添加常用路线</button>';
          padDiv.appendChild(btnWrap);
        }
      }
    });
  }

  // 上报历史
  if (profile.reportHistory) {
    var rhSections = document.querySelectorAll('#mPage-me .settings-section');
    rhSections.forEach(function(section) {
      var titleEl = section.querySelector('.ss-title');
      if (titleEl && titleEl.textContent.trim().indexOf('上报历史') !== -1) {
        var padDiv = section.querySelector('div[style]') || section.querySelector('div:last-child');
        if (padDiv) {
          padDiv.innerHTML = '';
          profile.reportHistory.forEach(function(item) {
            var div = document.createElement('button');
            div.type = 'button';
            div.className = 'fav-route-item';
            div.style.marginBottom = '4px';
            var statusColor = item.status === '处理中' ? 'var(--warning)' : 'var(--success)';
            div.innerHTML = '<div class="fr-info"><div class="fr-name">' + item.date + ' · ' + item.type + '</div><div class="fr-detail">' + item.location + '</div></div>' +
              '<span style="font-size:10px;color:' + statusColor + ';font-weight:600;">' + item.status + '</span>';
            if (item.photoUrl) {
              var photoUrl = resolveMobileReportPhotoUrl(item.photoUrl);
              if (photoUrl) {
                var thumbnail = document.createElement('img');
                thumbnail.className = 'rh-photo-thumbnail';
                thumbnail.src = photoUrl;
                thumbnail.alt = (item.type || '事件上报') + '现场照片';
                thumbnail.loading = 'lazy';
                thumbnail.addEventListener('error', function() {
                  thumbnail.remove();
                  div.classList.remove('profile-report-has-photo');
                });
                div.classList.add('profile-report-has-photo');
                div.appendChild(thumbnail);
              }
            }
            div.addEventListener('click', function() { showReportHistoryDetail(item); });
            padDiv.appendChild(div);
          });
          // 重新添加"查看全部"链接
          var viewWrap = document.createElement('div');
          viewWrap.style.cssText = 'text-align:center;margin-top:6px;';
          viewWrap.innerHTML = '<button type="button" class="text-action-button" onclick="mGoPage(\'report\')">查看全部上报历史 →</button>';
          padDiv.appendChild(viewWrap);
        }
      }
    });
  }

  // 环境感知
  if (profile.perception) {
    var alerts = document.querySelectorAll('#mPage-me .percept-alert');
    if (alerts.length >= 3) {
      var p = profile.perception;
      if (p.trafficLight) {
        alerts[0].innerHTML = '<strong>红绿灯识别模拟：</strong>' + p.trafficLight.label;
      }
      if (p.obstacle) {
        alerts[1].innerHTML = '<strong>障碍物检测模拟：</strong>' + p.obstacle.label;
      }
      if (p.blindLaneQuality) {
        alerts[2].innerHTML = '<strong>盲道评估模拟：</strong>' + p.blindLaneQuality.label;
      }
    }
  }
}

// 从 JSON 数据初始化所有设置默认值
function initSettingsFromJSON() {
  if (!MOBILE_DATA || !MOBILE_DATA.profile || !MOBILE_DATA.profile.settings) return;
  var defs = MOBILE_DATA.profile.settings.defaults;

  // 更新 toggle 默认值
  var toggleDefaults = [
    defs.toggles.nav_blind_lane,
    defs.toggles.nav_avoid_construction,
    defs.toggles.nav_avoid_stairs,
    defs.toggles.nav_auto_reroute,
    defs.toggles.ui_large_font,
    defs.toggles.ui_high_contrast,
    defs.toggles.ui_screen_reader,
    defs.toggles.ui_key_sound
  ];
  window._toggleDefaults = toggleDefaults;
}

function initAllMobileFromJSON() {
  if (!MOBILE_DATA) return;
  normalizeMobileCompetitionData(MOBILE_DATA);
  renderHomeFromJSON();
  renderNavFromJSON();
  renderBusFromJSON();
  renderReportFromJSON();
  renderProfileFromJSON();
  initSettingsFromJSON();
  initReportForm();

  // 更新天气
  if (MOBILE_DATA.app && MOBILE_DATA.app.weather) {
    var weatherEl = document.querySelector('#mPage-home .home-sub');
    if (weatherEl) weatherEl.textContent = MOBILE_DATA.app.weather;
  }
}

// Page switching
function mGoPage(name, tabEl, scrollToId) {
  document.querySelectorAll('.content.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('mPage-' + name);
  if (target) target.classList.add('active');

  document.querySelectorAll('.tab-item').forEach(function(t) {
    t.classList.remove('active');
    t.removeAttribute('aria-current');
  });
  if (tabEl) {
    tabEl.classList.add('active');
    tabEl.setAttribute('aria-current', 'page');
  }
  else {
    const match = document.querySelector(`.tab-item[data-tab="${name}"]`);
    if (match) {
      match.classList.add('active');
      match.setAttribute('aria-current', 'page');
    }
  }
  // Scroll to top, or to specific section if scrollToId is provided
  document.querySelectorAll('.content').forEach(function(c) {
    c.scrollTop = 0;
  });
  if (scrollToId) {
    setTimeout(function() {
      var el = document.getElementById(scrollToId);
      if (el && el.parentElement) {
        el.parentElement.scrollTop = el.offsetTop - 16;
      }
    }, 150);
  }
  if (name === 'report') updateReportDraft();
  if (name === 'bus' && !window._busLocationResolved) {
    setTimeout(function() { refreshNearbyBusStops({ locate: false }); }, 0);
  }
}

function normalizeMobileCompetitionData(data) {
  var actions = data && data.home && data.home.quickActions || [];
  actions.forEach(function(action) {
    if (action.page === 'me' && String(action.title || '').indexOf('AI') !== -1) {
      action.title = 'AI感知演示';
      action.desc = '模拟障碍与信号反馈';
    }
  });
  if (data && data.bus) {
    data.bus.location = data.bus.location || {};
    if (!data.bus.location.label || data.bus.location.source === 'demo') {
      data.bus.location.label = FUTIAN_DEMO_ORIGIN.name;
    }
  }
}

// Toast
let mToastTimer = null;
function mToast(msg) {
  let el = document.getElementById('mToast');
  if (mToastTimer) { clearTimeout(mToastTimer); mToastTimer = null; }
  el.textContent = msg;
  el.style.display = 'block';
  el.style.animation = 'none';
  el.offsetHeight;
  el.style.animation = 'mToastIn 0.25s ease, mToastOut 0.25s 2s ease forwards';
  mToastTimer = setTimeout(() => { el.style.display = 'none'; mToastTimer = null; }, 2300);
}

function setReportText(id, value) {
  var el = document.getElementById(id);
  if (el) el.textContent = value;
}

function formatReportTime(value) {
  var date = value ? new Date(value) : new Date();
  if (isNaN(date.getTime())) return String(value || '--');
  try {
    return new Intl.DateTimeFormat('zh-CN', {
      timeZone: 'Asia/Shanghai',
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    }).format(date).replace(/\//g, '-');
  } catch (e) {
    return date.toLocaleString('zh-CN', { hour12: false });
  }
}

function reportLocationText() {
  var inputLocation = (REPORT_DRAFT.location || '').trim();
  if (inputLocation) return inputLocation;
  if (REPORT_DRAFT.lon !== null && REPORT_DRAFT.lat !== null) {
    return '当前位置（' + Number(REPORT_DRAFT.lon).toFixed(5) + ', ' + Number(REPORT_DRAFT.lat).toFixed(5) + '）';
  }
  return '未填写位置，将根据描述识别';
}

function initReportForm() {
  updateReportDraft();
  if (reportClockTimer) clearInterval(reportClockTimer);
  reportClockTimer = setInterval(function() {
    setReportText('reportPreviewTime', formatReportTime());
  }, 30000);
}

function chooseReportType(button, type) {
  document.querySelectorAll('#reportTypeGrid button').forEach(function(item) {
    item.classList.remove('selected');
    item.setAttribute('aria-pressed', 'false');
  });
  if (button) {
    button.classList.add('selected');
    button.setAttribute('aria-pressed', 'true');
  }
  REPORT_DRAFT.type = type;
  updateReportDraft();
}

function selectReportTypeByValue(type) {
  var matched = null;
  document.querySelectorAll('#reportTypeGrid button').forEach(function(button) {
    if (button.textContent.indexOf(type) !== -1) matched = button;
  });
  chooseReportType(matched, type || '其他障碍');
}

function updateReportDraft() {
  var descriptionEl = document.getElementById('reportDescription');
  var locationEl = document.getElementById('reportLocationInput');
  REPORT_DRAFT.description = descriptionEl ? descriptionEl.value.trim() : REPORT_DRAFT.description;
  REPORT_DRAFT.location = locationEl ? locationEl.value.trim() : REPORT_DRAFT.location;

  setReportText('reportDescriptionCount', (descriptionEl ? descriptionEl.value.length : 0) + '/300');
  setReportText('reportPreviewType', REPORT_DRAFT.type || '尚未选择');
  setReportText('reportPreviewDescription', REPORT_DRAFT.description || '尚未填写');
  setReportText('reportPreviewLocation', reportLocationText());
  setReportText('reportPreviewTime', formatReportTime());

  var ready = Boolean(REPORT_DRAFT.type && REPORT_DRAFT.description);
  var submitButton = document.getElementById('reportSubmitButton');
  if (submitButton) submitButton.disabled = !ready;
  setReportText('reportSubmitHint', ready ? '提交前将再次展示全部内容' : '请选择问题类型并填写现场描述');
}

function refreshReportLocation() {
  var button = document.getElementById('reportLocationButton');
  var state = document.getElementById('reportLocationState');
  if (!navigator.geolocation) {
    if (state) {
      state.className = 'report-location-state error';
      state.textContent = '当前设备不支持定位，请手动填写位置';
    }
    return;
  }

  if (button) {
    button.disabled = true;
    button.textContent = '正在获取定位…';
  }
  if (state) {
    state.className = 'report-location-state';
    state.textContent = '请允许使用位置信息';
  }
  navigator.geolocation.getCurrentPosition(function(position) {
    var gcjPosition = wgs84ToGcj02(position.coords.longitude, position.coords.latitude);
    REPORT_DRAFT.lon = gcjPosition.lon;
    REPORT_DRAFT.lat = gcjPosition.lat;
    if (state) {
      state.className = 'report-location-state success';
      state.textContent = '已获取当前坐标：' + REPORT_DRAFT.lon.toFixed(5) + ', ' + REPORT_DRAFT.lat.toFixed(5);
    }
    if (button) {
      button.disabled = false;
      button.textContent = '📍 重新定位';
    }
    updateReportDraft();
  }, function(error) {
    var message = error && error.code === 1 ? '定位权限未开启，请手动填写位置' : '暂时无法获取定位，请手动填写位置';
    if (state) {
      state.className = 'report-location-state error';
      state.textContent = message;
    }
    if (button) {
      button.disabled = false;
      button.textContent = '📍 再次获取位置';
    }
  }, { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 });
}

function handleReportPhoto(input) {
  var file = input && input.files ? input.files[0] : null;
  var state = document.getElementById('reportPhotoState');
  if (!file) {
    REPORT_DRAFT.photo = null;
    if (state) state.hidden = true;
    return;
  }
  if (file.type && file.type.indexOf('image/') !== 0) {
    input.value = '';
    REPORT_DRAFT.photo = null;
    mToast('请选择图片文件');
    return;
  }
  if (file.size > 10 * 1024 * 1024) {
    input.value = '';
    REPORT_DRAFT.photo = null;
    mToast('图片不能超过 10MB');
    return;
  }
  REPORT_DRAFT.photo = file;
  if (state) {
    state.hidden = false;
    state.textContent = '✓ 已添加：' + file.name;
  }
}

function inferLocalReportType(text) {
  if (/(坏|破|裂|坑)/.test(text)) return '盲道损坏';
  if (/(没有|缺失|断了)/.test(text)) return '盲道缺失';
  if (/(占|堵|共享单车|电动车)/.test(text)) return '盲道被占';
  return '其他障碍';
}

function recognizeReportText(text) {
  var apiBase = getMobileApiBase(MOBILE_DATA);
  return fetchMobileJSON(apiBase + '/api/mobile/report/recognize', {
    method: 'POST',
    headers: mobileAuthHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ text: text, lon: REPORT_DRAFT.lon, lat: REPORT_DRAFT.lat })
  }).then(function(data) {
    selectReportTypeByValue(data.type);
    if (REPORT_DRAFT.lon === null && data.lon !== undefined) REPORT_DRAFT.lon = data.lon;
    if (REPORT_DRAFT.lat === null && data.lat !== undefined) REPORT_DRAFT.lat = data.lat;
    var locationInput = document.getElementById('reportLocationInput');
    if (locationInput && !locationInput.value && data.landmark && data.landmark !== '附近道路') {
      locationInput.value = data.landmark;
    }
    updateReportDraft();
    mToast('语音内容已填入，请核对后提交');
  }).catch(function() {
    selectReportTypeByValue(inferLocalReportType(text));
    updateReportDraft();
    mToast('已填入语音内容，请手动核对类型和位置');
  });
}

// 使用设备语音识别；不支持时保留完整的手动填写入口，不再自动塞入固定示例。
function showRecognition() {
  var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  var description = document.getElementById('reportDescription');
  var button = document.getElementById('reportVoiceButton');
  if (!SpeechRecognition) {
    if (description) description.focus();
    mToast('当前浏览器不支持语音输入，请手动填写');
    return;
  }

  var recognition = new SpeechRecognition();
  recognition.lang = 'zh-CN';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  if (button) {
    button.classList.add('listening');
    button.textContent = '正在倾听…';
  }
  recognition.onresult = function(event) {
    var transcript = event.results[0][0].transcript.trim();
    if (description) {
      description.value = transcript;
      REPORT_DRAFT.voiceUsed = true;
      updateReportDraft();
      recognizeReportText(transcript);
    }
  };
  recognition.onerror = function() {
    mToast('未识别到语音，可以再试一次或手动填写');
  };
  recognition.onend = function() {
    if (button) {
      button.classList.remove('listening');
      button.textContent = '🎤 语音描述';
    }
  };
  try {
    recognition.start();
  } catch (e) {
    recognition.onend();
    mToast('语音识别暂时不可用');
  }
}

function closeReportSheet(id) {
  var sheet = document.getElementById(id);
  if (sheet) sheet.hidden = true;
}

// 第一次点击只进入核对页，不会立即发送。
function submitReport() {
  updateReportDraft();
  if (!REPORT_DRAFT.type || !REPORT_DRAFT.description) {
    mToast('请先选择问题类型并填写描述');
    return;
  }
  REPORT_DRAFT.reviewedAt = new Date();
  setReportText('confirmReportType', REPORT_DRAFT.type);
  setReportText('confirmReportDescription', REPORT_DRAFT.description);
  setReportText('confirmReportLocation', reportLocationText());
  setReportText('confirmReportTime', formatReportTime(REPORT_DRAFT.reviewedAt));
  setReportText('confirmReportPhoto', REPORT_DRAFT.photo ? REPORT_DRAFT.photo.name : '未添加');
  var sheet = document.getElementById('reportConfirmSheet');
  if (sheet) sheet.hidden = false;
  var confirmButton = document.getElementById('confirmReportButton');
  if (confirmButton) setTimeout(function() { confirmButton.focus(); }, 50);
}

function confirmReportSubmission() {
  var button = document.getElementById('confirmReportButton');
  if (button && button.disabled) return;
  if (button) {
    button.disabled = true;
    button.textContent = '正在提交…';
  }

  var apiBase = getMobileApiBase(MOBILE_DATA);
  var method = REPORT_DRAFT.voiceUsed ? '语音识别+表单确认' : '移动端表单上报';
  var payload = {
    type: REPORT_DRAFT.type,
    description: REPORT_DRAFT.description,
    lon: REPORT_DRAFT.lon,
    lat: REPORT_DRAFT.lat,
    address: REPORT_DRAFT.location,
    landmark: REPORT_DRAFT.location,
    report_method: method
  };
  var options;
  if (REPORT_DRAFT.photo) {
    var formData = new FormData();
    Object.keys(payload).forEach(function(key) {
      if (payload[key] !== null && payload[key] !== undefined && payload[key] !== '') formData.append(key, payload[key]);
    });
    formData.append('photo', REPORT_DRAFT.photo);
    options = { method: 'POST', headers: mobileAuthHeaders(), body: formData };
  } else {
    options = {
      method: 'POST',
      headers: mobileAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(payload)
    };
  }

  fetchMobileJSON(apiBase + '/api/mobile/report', options).then(function(data) {
    closeReportSheet('reportConfirmSheet');
    showReportResult({
      eventId: data.eventId,
      type: data.type || REPORT_DRAFT.type,
      description: data.description || REPORT_DRAFT.description,
      location: data.location || reportLocationText(),
      submittedAt: data.submittedAt,
      status: data.status || '待审核',
      photoUrl: data.photoUrl
    }, true);
    try {
      localStorage.setItem('a11y_report_updated', JSON.stringify({ eventId: data.eventId, ts: Date.now() }));
    } catch (e) {}
    loadMobileData().then(function() {
      renderReportFromJSON();
      renderProfileFromJSON();
    });
  }).catch(function(err) {
    mToast(err.message || '上报失败，请稍后重试');
  }).finally(function() {
    if (button) {
      button.disabled = false;
      button.textContent = '确认提交';
    }
  });
}

function resolveMobileReportPhotoUrl(photoUrl) {
  if (!photoUrl || !/^\/uploads\/[A-Za-z0-9._-]+$/.test(photoUrl)) return '';
  return getMobileApiBase(MOBILE_DATA) + photoUrl;
}

function renderMobileReportPhoto(photoUrl) {
  var container = document.getElementById('reportResultPhoto');
  var image = document.getElementById('reportResultPhotoImage');
  var status = document.getElementById('reportResultPhotoStatus');
  if (!container || !image || !status) return;
  var resolved = resolveMobileReportPhotoUrl(photoUrl);
  container.hidden = !resolved;
  image.hidden = !resolved;
  image.removeAttribute('src');
  status.textContent = '现场照片';
  if (!resolved) return;
  image.onload = function() {
    image.hidden = false;
    status.textContent = '现场照片 · 点击可查看完整图片';
  };
  image.onerror = function() {
    image.hidden = true;
    status.textContent = '现场照片暂时无法加载';
  };
  image.onclick = function() { window.open(resolved, '_blank', 'noopener'); };
  image.src = resolved;
}

function showReportResult(data, isNew) {
  REPORT_RESULT_IS_NEW = Boolean(isNew);
  SELECTED_MOBILE_REPORT = isNew ? null : data;
  setReportText('reportResultTitle', isNew ? '上报成功' : '上报详情');
  setReportText('reportResultEventId', data.eventId || '--');
  setReportText('reportResultType', data.type || '事件上报');
  setReportText('reportResultDescription', data.description || data.desc || '暂无描述');
  setReportText('reportResultLocation', data.location || '位置未记录');
  setReportText('reportResultTime', data.submittedAt ? formatReportTime(data.submittedAt) : (data.dateTime || data.date || '--'));
  setReportText('reportResultStatus', data.status || '待审核');
  renderMobileReportPhoto(data.photoUrl);
  var deleteButton = document.getElementById('reportDeleteButton');
  if (deleteButton) deleteButton.hidden = Boolean(isNew || data.canDelete !== true);
  var sheet = document.getElementById('reportResultSheet');
  if (sheet) sheet.hidden = false;
}

function showReportHistoryDetail(item) {
  showReportResult(item, false);
}

function requestDeleteOwnReport() {
  if (!SELECTED_MOBILE_REPORT || SELECTED_MOBILE_REPORT.canDelete !== true) {
    mToast('只能删除自己提交的上报记录');
    return;
  }
  closeReportSheet('reportResultSheet');
  setReportText('reportDeleteEventId', SELECTED_MOBILE_REPORT.eventId);
  setReportText('reportDeleteDescription', SELECTED_MOBILE_REPORT.description || SELECTED_MOBILE_REPORT.desc || '这条上报记录');
  var sheet = document.getElementById('reportDeleteSheet');
  if (sheet) sheet.hidden = false;
  var button = document.getElementById('confirmDeleteReportButton');
  if (button) setTimeout(function() { button.focus(); }, 50);
}

function closeReportDeleteDialog(restoreDetail) {
  closeReportSheet('reportDeleteSheet');
  if (restoreDetail && SELECTED_MOBILE_REPORT) {
    showReportResult(SELECTED_MOBILE_REPORT, false);
  }
}

function confirmDeleteOwnReport() {
  if (!SELECTED_MOBILE_REPORT || SELECTED_MOBILE_REPORT.canDelete !== true) return;
  var eventId = SELECTED_MOBILE_REPORT.eventId;
  var button = document.getElementById('confirmDeleteReportButton');
  if (button && button.disabled) return;
  if (button) {
    button.disabled = true;
    button.textContent = '正在删除…';
  }

  var apiBase = getMobileApiBase(MOBILE_DATA);
  fetchMobileJSON(apiBase + '/api/mobile/report/' + encodeURIComponent(eventId), {
    method: 'DELETE',
    headers: mobileAuthHeaders()
  }).then(function(data) {
    closeReportSheet('reportDeleteSheet');
    closeReportSheet('reportResultSheet');
    SELECTED_MOBILE_REPORT = null;
    try {
      localStorage.setItem('a11y_report_updated', JSON.stringify({
        eventId: data.deletedEventId || eventId,
        action: 'deleted',
        ts: Date.now()
      }));
    } catch (e) {}
    return loadMobileData().then(function() {
      renderReportFromJSON();
      renderProfileFromJSON();
      mToast('上报记录已删除');
    });
  }).catch(function(err) {
    mToast(err.message || '删除失败，请稍后重试');
  }).finally(function() {
    if (button) {
      button.disabled = false;
      button.textContent = '确认删除';
    }
  });
}

function resetReportDraft() {
  REPORT_DRAFT = {
    type: '', description: '', location: '', lon: null, lat: null,
    photo: null, voiceUsed: false, reviewedAt: null
  };
  var description = document.getElementById('reportDescription');
  var location = document.getElementById('reportLocationInput');
  var photo = document.getElementById('reportPhotoInput');
  var photoState = document.getElementById('reportPhotoState');
  if (description) description.value = '';
  if (location) location.value = '';
  if (photo) photo.value = '';
  if (photoState) photoState.hidden = true;
  document.querySelectorAll('#reportTypeGrid button').forEach(function(item) {
    item.classList.remove('selected');
    item.setAttribute('aria-pressed', 'false');
  });
  var locationState = document.getElementById('reportLocationState');
  if (locationState) {
    locationState.className = 'report-location-state';
    locationState.textContent = '尚未获取定位，可填写上方位置';
  }
  updateReportDraft();
}

function closeReportResult() {
  closeReportSheet('reportResultSheet');
  if (REPORT_RESULT_IS_NEW) {
    resetReportDraft();
    var history = document.querySelector('#mPage-report .report-history');
    if (history) history.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  REPORT_RESULT_IS_NEW = false;
  SELECTED_MOBILE_REPORT = null;
}

// Vibration coding demo
function getVibrationLevel() {
  try {
    var prefs = JSON.parse(localStorage.getItem('a11y_settings') || '{}');
    return Math.max(1, Math.min(3, parseInt(prefs.vibration || '2', 10) || 2));
  } catch (e) { return 2; }
}

function vibrationPattern(pattern) {
  var scale = { 1: 0.55, 2: 1, 3: 1.55 }[getVibrationLevel()] || 1;
  return pattern.map(function(value, index) { return index % 2 ? value : Math.round(value * scale); });
}

function vibrateDemo(silent) {
  if (!navigator.vibrate) { mToast('该设备不支持震动'); return; }
  // Simulate obstacle pattern: ⚡⚡⚡
  navigator.vibrate(vibrationPattern([200, 80, 200, 80, 500]));
  if (!silent) mToast('震动演示中: ⚡⚡⚡ 障碍模式');
}

function runPerceptionDemo() {
  var scenarios = [
    {
      traffic: '当前红灯，请在停止线后等待',
      obstacle: '前方3米检测到临时锥桶，请靠右慢行',
      lane: '当前盲道连续性良好，建议保持直行',
      speech: '环境感知模拟：当前红灯，请等待。前方三米有临时锥桶，请靠右慢行。'
    },
    {
      traffic: '绿灯已亮起，预计剩余18秒',
      obstacle: '前方通道暂未发现明显障碍',
      lane: '盲道局部轻微磨损，请降低速度',
      speech: '环境感知模拟：绿灯已亮起，前方通道暂未发现明显障碍。'
    },
    {
      traffic: '未检测到信号灯，请留意路口车辆',
      obstacle: '右前方2米有共享单车占道',
      lane: '建议向左绕行约两米后回到盲道',
      speech: '环境感知模拟：右前方两米有共享单车占道，建议向左绕行。'
    }
  ];
  var index = Number(window._perceptionDemoIndex || 0) % scenarios.length;
  window._perceptionDemoIndex = index + 1;
  var scenario = scenarios[index];
  var alerts = document.querySelectorAll('#mePerceptionSection .percept-alert');
  if (alerts[0]) alerts[0].innerHTML = '<strong>红绿灯识别模拟：</strong>' + scenario.traffic;
  if (alerts[1]) alerts[1].innerHTML = '<strong>障碍物检测模拟：</strong>' + scenario.obstacle;
  if (alerts[2]) alerts[2].innerHTML = '<strong>盲道评估模拟：</strong>' + scenario.lane;
  speakNavigation(scenario.speech);
  if (navigator.vibrate) navigator.vibrate(vibrationPattern([180, 90, 360]));
  mToast('已运行第 ' + (index + 1) + ' 组感知模拟');
}

// ========== Settings & Preferences ==========
function applyDisplaySettings() {
  var inner = document.querySelector('.phone-inner');
  if (!inner) return;
  var toggles = document.querySelectorAll('#mPage-me .toggle input[type="checkbox"]');
  if (toggles.length >= 7) {
    inner.classList.toggle('large-font', toggles[4].checked);
    inner.classList.toggle('high-contrast', toggles[5].checked);
    inner.classList.toggle('screen-reader-enhanced', toggles[6].checked);
    var liveMode = toggles[6].checked ? 'assertive' : 'off';
    var toast = document.getElementById('mToast');
    if (toast) toast.setAttribute('aria-live', liveMode);
    ['navStatusTitle', 'busStatus', 'reportLocationState'].forEach(function(id) {
      var element = document.getElementById(id);
      if (element) element.setAttribute('aria-live', liveMode);
    });
  }
}

// Me page specific functions
function updateMeSetting(type, value) {
  var storedValue = value;
  var vibLabels = { '1': '弱', '2': '中', '3': '强' };
  var dispEl, valEl, suffix = '';
  if (type === 'speed') {
    dispEl = document.getElementById('meSpeedDisp');
    valEl = document.getElementById('meSpeedVal');
    suffix = 'x';
    value = parseFloat(value).toFixed(1);
  } else if (type === 'volume') {
    dispEl = document.getElementById('meVolDisp');
    valEl = document.getElementById('meVolVal');
    suffix = '%';
  } else if (type === 'vibration') {
    dispEl = document.getElementById('meVibDisp');
    valEl = document.getElementById('meVibVal');
    value = vibLabels[value] || value;
  }
  if (dispEl) dispEl.textContent = value + suffix;
  if (valEl) valEl.textContent = value + suffix;
  try {
    var prefs = JSON.parse(localStorage.getItem('a11y_settings') || '{}');
    prefs[type] = type === 'speed' ? parseFloat(storedValue) : parseInt(storedValue, 10);
    localStorage.setItem('a11y_settings', JSON.stringify(prefs));
  } catch(e) {}
  saveMePrefs(true);
}

function keySoundEnabled() {
  try {
    var prefs = JSON.parse(localStorage.getItem('a11y_settings') || '{}');
    return prefs.ui_key_sound !== false;
  } catch (e) { return true; }
}

function playKeyFeedback() {
  if (!keySoundEnabled()) return;
  try {
    var AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    window._keyAudioContext = window._keyAudioContext || new AudioContextClass();
    var context = window._keyAudioContext;
    var oscillator = context.createOscillator();
    var gain = context.createGain();
    oscillator.frequency.value = 760;
    gain.gain.setValueAtTime(0.035, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.035);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.04);
  } catch (e) {}
}

document.addEventListener('click', function(event) {
  if (event.target.closest('button, .tab-item, .quick-card, .fav-route-item, .toggle, [onclick]')) playKeyFeedback();
});

function saveMePrefs(silent) {
  var prefs = {};
  var togglePayload = {};
  try {
    prefs = JSON.parse(localStorage.getItem('a11y_settings') || '{}');
    var toggles = document.querySelectorAll('#mPage-me .toggle input[type="checkbox"]');
    var sectionNames = ['nav_blind_lane', 'nav_avoid_construction', 'nav_avoid_stairs', 'nav_auto_reroute',
                        'ui_large_font', 'ui_high_contrast', 'ui_screen_reader', 'ui_key_sound'];
    toggles.forEach(function(cb, i) {
      if (i < sectionNames.length) {
        prefs[sectionNames[i]] = cb.checked;
        togglePayload[sectionNames[i]] = cb.checked;
      }
    });
    localStorage.setItem('a11y_settings', JSON.stringify(prefs));
  } catch(e) {}
  applyDisplaySettings();
  var apiBase = getMobileApiBase(MOBILE_DATA);
  var ranges = document.querySelectorAll('#mPage-me input[type="range"]');
  var payload = {
    speed: parseFloat(ranges[0] ? ranges[0].value : '1'),
    volume: parseInt(ranges[1] ? ranges[1].value : '80', 10),
    vibration: parseInt(ranges[2] ? ranges[2].value : '2', 10),
    toggles: togglePayload
  };
  prefs.speed = payload.speed;
  prefs.volume = payload.volume;
  prefs.vibration = payload.vibration;
  delete prefs.voice_type;
  try { localStorage.setItem('a11y_settings', JSON.stringify(prefs)); } catch (e) {}
  fetchMobileJSON(apiBase + '/api/mobile/user/settings', {
    method: 'PUT',
    headers: mobileAuthHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload)
  }).then(function() {
    if (!silent) mToast('设置已保存');
  }).catch(function() {
    if (!silent) mToast('已保存到本地，后端暂不可用');
  });
}

function doLogout() {
  if (confirm('确定退出登录吗？')) {
    localStorage.removeItem('a11y_mobile_logged_in');
    localStorage.removeItem('a11y_mobile_user');
    localStorage.removeItem('a11y_mobile_role');
    localStorage.removeItem('a11y_mobile_token');
    window.location.href = '移动端登录.html';
  }
}

function getOriginSelection() {
  var input = document.getElementById('navOriginInput') || document.getElementById('homeOriginInput');
  var name = String(input && input.value || FUTIAN_DEMO_ORIGIN.name).trim();
  if (!name) name = FUTIAN_DEMO_ORIGIN.name;
  var isCurrent = name === '当前位置' || name === '我的位置' || name === FUTIAN_DEMO_ORIGIN.name;
  return {
    name: name,
    isCurrent: isCurrent,
    coords: isCurrent ? (window._lastKnownCoords || FUTIAN_DEMO_ORIGIN) : null
  };
}

function syncOriginInput(source) {
  var value = String(source && source.value || '').trim();
  ['homeOriginInput', 'navOriginInput'].forEach(function(id) {
    var input = document.getElementById(id);
    if (input && input !== source) input.value = value;
  });
  try { localStorage.setItem('a11y_origin_name', value || FUTIAN_DEMO_ORIGIN.name); } catch (e) {}
}

function applyFutianDemoOrigin(button, reason) {
  window._lastKnownCoords = { lon: FUTIAN_DEMO_ORIGIN.lon, lat: FUTIAN_DEMO_ORIGIN.lat };
  ['homeOriginInput', 'navOriginInput'].forEach(function(id) {
    var input = document.getElementById(id);
    if (input) input.value = FUTIAN_DEMO_ORIGIN.name;
  });
  try { localStorage.setItem('a11y_origin_name', FUTIAN_DEMO_ORIGIN.name); } catch (e) {}
  if (button) { button.disabled = false; button.textContent = '◎ 真实定位'; }
  mToast((reason ? reason + '，' : '') + '已使用购物公园演示点');
  return FUTIAN_DEMO_ORIGIN;
}

function useCurrentLocationAsOrigin(button) {
  if (!navigator.geolocation) return applyFutianDemoOrigin(button, '浏览器不支持定位');
  var oldText = button && button.textContent;
  if (button) { button.disabled = true; button.textContent = '定位中…'; }
  navigator.geolocation.getCurrentPosition(function(position) {
    var coords = wgs84ToGcj02(position.coords.longitude, position.coords.latitude);
    if (!isWithinFutianCoverage(coords)) {
      applyFutianDemoOrigin(button, '当前位置不在福田服务区');
      return;
    }
    window._lastKnownCoords = coords;
    ['homeOriginInput', 'navOriginInput'].forEach(function(id) {
      var input = document.getElementById(id);
      if (input) input.value = '当前位置';
    });
    try { localStorage.setItem('a11y_origin_name', '当前位置'); } catch (e) {}
    if (button) { button.disabled = false; button.textContent = oldText || '◎ 真实定位'; }
    mToast('已将当前位置设为出发点');
  }, function(error) {
    var reason = error && error.code === 1 ? '未获得定位权限' : '定位请求失败';
    applyFutianDemoOrigin(button, reason);
  }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 10000 });
}

function startFavRoute(dest, destinationCoords) {
  dest = String(dest || '').trim();
  if (!dest) return mToast('请输入目的地');
  var homeInput = document.getElementById('homeDestinationInput');
  var navInput = document.getElementById('navDestinationInput');
  if (homeInput) homeInput.value = dest;
  if (navInput) navInput.value = dest;
  var origin = getOriginSelection();
  clearNavigationResults();
  mToast('正在启动导航至：' + dest);
  mGoPage('nav');
  setNavigationStage('planning', origin.name + ' → ' + dest + ' | 计算路线中…');
  setNavigationLoading(true);
  var apiBase = getMobileApiBase(MOBILE_DATA);
  var coords = origin.coords || window._lastKnownCoords || FUTIAN_DEMO_ORIGIN;
  fetchMobileJSON(apiBase + '/api/mobile/navigation/plan', {
    method: 'POST',
    headers: mobileAuthHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({
      origin: origin.name,
      destination: dest,
      lon: coords.lon,
      lat: coords.lat,
      origin_lon: origin.coords ? origin.coords.lon : null,
      origin_lat: origin.coords ? origin.coords.lat : null,
      destination_lon: destinationCoords ? destinationCoords.lon : null,
      destination_lat: destinationCoords ? destinationCoords.lat : null
    })
  }).then(function(plan) {
    plan = applyNavigationPreferences(plan);
    MOBILE_DATA.navigation = plan;
    renderNavigationPlan(plan);
  }).catch(function(err) {
    setNavigationLoading(false);
    clearNavigationResults({ stage: 'error', detail: origin.name + ' → ' + dest + ' | ' + (err.message || '路线规划失败') });
    setNavigationStage('error', origin.name + ' → ' + dest + ' | ' + (err.message || '路线规划失败'));
    mToast(err.message || '路线规划失败');
  });
}

function getSavedPreference(name, defaultValue) {
  try {
    var prefs = JSON.parse(localStorage.getItem('a11y_settings') || '{}');
    return name in prefs ? Boolean(prefs[name]) : defaultValue;
  } catch (e) { return defaultValue; }
}

function applyNavigationPreferences(plan) {
  var options = plan && plan.routeOptions || [];
  if (options.length < 2) return plan;
  var preferAccessible = getSavedPreference('nav_blind_lane', true) || getSavedPreference('nav_avoid_stairs', false);
  var preferred = options.find(function(option) {
    return preferAccessible ? option.provider === 'geoscene-safe-route' : option.provider !== 'geoscene-safe-route';
  });
  if (!preferred || preferred.provider === plan.provider) return plan;
  return Object.assign({}, preferred, {
    routeOptions: options,
    comparison: plan.comparison,
    destination: plan.destination,
    origin: plan.origin
  });
}

function startRouteFromInput(inputId) {
  var input = document.getElementById(inputId);
  var destination = input ? input.value.trim() : '';
  if (!destination) {
    mToast('请先输入目的地');
    if (input) input.focus();
    return;
  }
  if (input) input.blur();
  startFavRoute(destination);
}

function startDestinationVoiceInput(inputId, button) {
  var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    mToast('当前浏览器不支持语音识别，请手动输入目的地');
    var fallbackInput = document.getElementById(inputId);
    if (fallbackInput) fallbackInput.focus();
    return;
  }
  if (window._destinationRecognition) {
    window._destinationRecognition.stop();
    return;
  }
  var recognition = new SpeechRecognition();
  window._destinationRecognition = recognition;
  recognition.lang = 'zh-CN';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  var hint = document.getElementById('homeVoiceHint');
  recognition.onstart = function() {
    if (button) button.classList.add('listening');
    if (hint) hint.textContent = '正在聆听，请说出目的地...';
    mToast('请说出目的地');
  };
  recognition.onresult = function(event) {
    var transcript = event.results[0][0].transcript.replace(/[。！!，,]$/g, '').trim();
    var input = document.getElementById(inputId);
    if (input) input.value = transcript;
    if (transcript) startFavRoute(transcript);
  };
  recognition.onerror = function(event) {
    var messages = {
      'not-allowed': '请允许浏览器使用麦克风',
      'no-speech': '没有听清，请再说一次',
      'audio-capture': '未检测到可用麦克风'
    };
    mToast(messages[event.error] || '语音识别失败，请手动输入');
  };
  recognition.onend = function() {
    if (button) button.classList.remove('listening');
    if (hint) hint.textContent = '点击麦克风，说出目的地 (M-01)';
    window._destinationRecognition = null;
  };
  try {
    recognition.start();
  } catch (error) {
    window._destinationRecognition = null;
    if (button) button.classList.remove('listening');
    mToast('语音识别启动失败，请重试');
  }
}

function setNavigationLoading(loading) {
  var loadingEl = document.getElementById('navLoading');
  if (loadingEl) loadingEl.hidden = !loading;
  var startBtn = document.getElementById('navStartBtn');
  if (startBtn && loading) startBtn.disabled = true;
}

function setNavigationStage(stage, detail) {
  var title = document.getElementById('navStatusTitle');
  var meta = document.querySelector('#mPage-nav .nav-meta');
  var startButton = document.getElementById('navStartBtn');
  var titles = {
    idle: '无障碍导航 (M-01~M-04)',
    planning: '正在规划无障碍路线',
    ready: '路线已就绪',
    active: '实时导航中',
    paused: '导航已暂停',
    error: '路线规划失败'
  };
  if (title) title.textContent = titles[stage] || titles.idle;
  if (meta) meta.textContent = detail || (stage === 'idle' ? '尚未规划路线' : '');
  if (startButton) {
    if (stage === 'active') startButton.textContent = '⏸ 暂停实时导航';
    else if (stage === 'paused') startButton.textContent = '▶ 继续实时导航';
    else startButton.textContent = '▶ 开始实时导航';
    startButton.disabled = stage !== 'ready' && stage !== 'active' && stage !== 'paused';
  }
}

function clearNavigationResults(options) {
  options = options || {};
  if (window._destinationRecognition) {
    try { window._destinationRecognition.stop(); } catch (e) {}
  }
  if (window._navWatchId != null && navigator.geolocation) {
    navigator.geolocation.clearWatch(window._navWatchId);
  }
  window._navWatchId = null;
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  if (window._facilityInfoWindow) window._facilityInfoWindow.close();
  if (window._navMap) {
    window._navMap.clearMap();
    window._navMap.destroy();
  }
  window._navMap = null;
  window._facilityInfoWindow = null;
  window._navPositionMarker = null;
  window._activeNavPlan = null;
  window._activeNavPath = null;
  window._activeNavStep = null;
  window._rerouteInFlight = false;
  window._lastAutoRerouteAt = null;

  var mapContainer = document.getElementById('amapNavMap');
  if (mapContainer) {
    mapContainer.classList.remove('map-ready');
    mapContainer.innerHTML =
      '<div class="nav-map-placeholder" id="navMapPlaceholder">🗺️ 选择目的地后显示真实路线</div>' +
      '<div class="nav-loading" id="navLoading" hidden><span></span> 正在规划无障碍路线...</div>';
  }
  var cards = document.querySelectorAll('#mPage-nav .alert-card');
  if (cards[0]) cards[0].innerHTML = '<strong>无障碍导航：</strong><br>请从首页或导航页输入目的地开始规划。';
  if (cards[1]) cards[1].innerHTML = '<strong>路线提示：</strong><br>规划后将显示沿途障碍和通行风险。';
  var stepsBox = document.getElementById('navSteps');
  var stepsList = document.getElementById('navStepsList');
  if (stepsList) stepsList.innerHTML = '';
  if (stepsBox) stepsBox.hidden = true;
  ['routeComparison', 'routeFacilities'].forEach(function(id) {
    var box = document.getElementById(id);
    if (box) box.hidden = true;
  });
  if (MOBILE_DATA && !options.keepData) MOBILE_DATA.navigation = null;
  setNavigationLoading(false);
  setNavigationStage(options.stage || 'idle', options.detail);
}

function loadAmapJS() {
  if (window.AMap) return Promise.resolve(window.AMap);
  if (window._amapLoadPromise) return window._amapLoadPromise;
  var apiBase = getMobileApiBase(MOBILE_DATA);
  window._amapLoadPromise = fetchMobileJSON(apiBase + '/api/mobile/navigation/map-config', {
    headers: mobileAuthHeaders()
  }).then(function(config) {
    window._AMapSecurityConfig = { securityJsCode: config.securityJsCode };
    return new Promise(function(resolve, reject) {
      var script = document.createElement('script');
      script.src = 'https://webapi.amap.com/maps?v=' + encodeURIComponent(config.version || '2.0') +
        '&key=' + encodeURIComponent(config.key);
      script.onload = function() { window.AMap ? resolve(window.AMap) : reject(new Error('高德地图初始化失败')); };
      script.onerror = function() { reject(new Error('高德地图脚本加载失败')); };
      document.head.appendChild(script);
    });
  });
  return window._amapLoadPromise;
}

function drawNavigationMap(plan) {
  var placeholder = document.getElementById('navMapPlaceholder');
  return loadAmapJS().then(function(AMap) {
    if (placeholder) placeholder.hidden = true;
    var container = document.getElementById('amapNavMap');
    container.classList.add('map-ready');
    if (!window._navMap) {
      window._navMap = new AMap.Map('amapNavMap', { zoom: 16, mapStyle: 'amap://styles/normal' });
    }
    var map = window._navMap;
    if (window._facilityInfoWindow) window._facilityInfoWindow.close();
    map.clearMap();
    window._navPositionMarker = null;
    var path = (plan.route || []).map(function(point) { return [point.lon, point.lat]; });
    if (path.length < 2) throw new Error('路线坐标不完整');
    var options = plan.routeOptions || [];
    options.forEach(function(option) {
      var optionPath = (option.route || []).map(function(point) { return [point.lon, point.lat]; });
      if (optionPath.length < 2) return;
      var isActive = option.provider === plan.provider;
      map.add(new AMap.Polyline({
        path: optionPath,
        strokeColor: option.provider === 'geoscene-safe-route' ? '#20a464' : '#3488ff',
        strokeWeight: isActive ? 8 : 5,
        strokeOpacity: isActive ? 0.95 : 0.48,
        showDir: isActive,
        lineJoin: 'round',
        zIndex: isActive ? 60 : 40
      }));
    });
    if (!options.length) {
      map.add(new AMap.Polyline({
        path: path,
        strokeColor: plan.provider === 'geoscene-safe-route' ? '#20a464' : '#3488ff',
        strokeWeight: 7,
        strokeOpacity: 0.9,
        showDir: true,
        lineJoin: 'round'
      }));
    }
    map.add(new AMap.Marker({ position: path[0], title: '起点', label: { content: '起点', direction: 'top' } }));
    map.add(new AMap.Marker({ position: path[path.length - 1], title: plan.destination, label: { content: '终点', direction: 'top' } }));
    ((plan.accessibility || {}).risks || []).forEach(function(risk) {
      if (typeof risk.lon !== 'number' || typeof risk.lat !== 'number') return;
      map.add(new AMap.Marker({
        position: [risk.lon, risk.lat],
        title: risk.type,
        content: '<div style="background:#ff4560;color:#fff;border:2px solid #fff;border-radius:50%;width:24px;height:24px;line-height:20px;text-align:center;box-shadow:0 2px 7px #666">!</div>'
      }));
    });
    var facilityIcons = { metroEntrance: '🚇', hospital: '🏥', toilet: '🚻', rehab: '♿', busStop: '🚌', park: '🌳' };
    (plan.nearbyFacilities || []).forEach(function(facility) {
      var marker = new AMap.Marker({
        position: [facility.lon, facility.lat],
        title: facility.name,
        offset: new AMap.Pixel(-11, -11),
        content: '<div style="width:22px;height:22px;display:grid;place-items:center;border:1px solid #fff;border-radius:50%;background:#fff;box-shadow:0 1px 5px #778;font-size:12px">' + (facilityIcons[facility.category] || '●') + '</div>'
      });
      marker.on('click', function() { openFacilityMapInfo(map, facility); });
      map.add(marker);
    });
    map.setFitView(null, false, [32, 32, 32, 32]);
    window._activeNavPlan = plan;
    window._activeNavPath = path;
    var startBtn = document.getElementById('navStartBtn');
    if (startBtn) startBtn.disabled = false;
  }).catch(function(err) {
    if (placeholder) {
      placeholder.hidden = false;
      placeholder.textContent = '地图加载失败：' + err.message;
    }
    throw err;
  });
}

function escapeMapHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function openFacilityMapInfo(map, facility) {
  if (!map || !window.AMap || !facility) return;
  var accessibility = facility.wheelchair === 'yes'
    ? '支持无障碍通行'
    : (facility.accessibility || '暂无详细无障碍信息');
  if (accessibility.length > 140) accessibility = accessibility.slice(0, 140) + '…';
  var content = '<div class="facility-map-popup">' +
    '<div class="facility-map-popup-title">' + escapeMapHtml(facility.name) + '</div>' +
    '<div class="facility-map-popup-row">类型：' + escapeMapHtml(facility.categoryLabel) + '</div>' +
    '<div class="facility-map-popup-row">距路线约 ' + Math.round(facility.distanceToRouteMeters || 0) + ' 米</div>' +
    (facility.address ? '<div class="facility-map-popup-row">地址：' + escapeMapHtml(facility.address) + '</div>' : '') +
    '<div class="facility-map-popup-access">♿ ' + escapeMapHtml(accessibility) + '</div></div>';
  if (window._facilityInfoWindow) window._facilityInfoWindow.close();
  window._facilityInfoWindow = new AMap.InfoWindow({ content: content, offset: new AMap.Pixel(0, -18), closeWhenClickMap: true });
  window._facilityInfoWindow.open(map, [facility.lon, facility.lat]);
}

function selectRouteOption(index) {
  var current = window._activeNavPlan;
  var options = current && current.routeOptions || [];
  var selected = options[index];
  if (!selected) return;
  var next = Object.assign({}, selected, {
    routeOptions: options,
    comparison: current.comparison,
    destination: current.destination,
    origin: current.origin
  });
  MOBILE_DATA.navigation = next;
  renderNavigationPlan(next);
}

function renderRouteComparison(plan) {
  var box = document.getElementById('routeComparison');
  var grid = document.getElementById('routeOptionGrid');
  var title = box && box.querySelector('.route-comparison-title');
  var options = plan.routeOptions || [];
  if (!box || !grid) return;
  box.hidden = options.length < 2;
  if (title && plan.comparison) {
    var extra = Number(plan.comparison.extraDistanceMeters || 0);
    title.textContent = extra > 0 ? '路线方案对比 · 安全路线多行 ' + extra + ' 米' : '路线方案对比 · 安全路线距离更短';
  }
  grid.innerHTML = '';
  options.forEach(function(option, index) {
    var safe = option.provider === 'geoscene-safe-route';
    var score = option.accessibility && option.accessibility.score;
    var card = document.createElement('div');
    card.className = 'route-option ' + (safe ? 'route-option-safe' : 'route-option-fast') + (option.provider === plan.provider ? ' active' : '');
    card.onclick = function() { selectRouteOption(index); };
    card.innerHTML = '<div class="route-option-name">' + (safe ? '♿ 无障碍安全' : '⚡ 普通步行') + '</div>' +
      '<div class="route-option-meta">' + option.distance + ' · ' + option.duration + '<br>' +
      (safe && typeof option.safeMinutes === 'number' ? '安全成本 ' + option.safeMinutes + '分钟' : '高德常规步行') +
      (typeof score === 'number' ? ' · 评分' + score : '') + '</div>';
    grid.appendChild(card);
  });
}

function renderRouteFacilities(plan, category) {
  var box = document.getElementById('routeFacilities');
  var title = box && box.querySelector('.route-facilities-title');
  var filters = document.getElementById('facilityFilter');
  var list = document.getElementById('facilityList');
  var facilities = plan.nearbyFacilities || [];
  if (!box || !filters || !list) return;
  box.hidden = facilities.length === 0;
  if (!facilities.length) return;
  if (title) {
    var entrance = plan.recommendedMetroEntrance;
    title.textContent = entrance ? '沿途保障设施 · 推荐 ' + entrance.name : '沿途无障碍保障设施';
  }
  category = category || 'all';
  var labels = { all: '全部', metroEntrance: '地铁口', hospital: '医院', toilet: '厕所', rehab: '康复', busStop: '公交', park: '公园' };
  var icons = { metroEntrance: '🚇', hospital: '🏥', toilet: '🚻', rehab: '♿', busStop: '🚌', park: '🌳' };
  var categories = ['all'].concat(Array.from(new Set(facilities.map(function(item) { return item.category; }))));
  filters.innerHTML = '';
  categories.forEach(function(key) {
    var chip = document.createElement('button');
    chip.className = 'facility-chip' + (key === category ? ' active' : '');
    chip.textContent = labels[key] || key;
    chip.onclick = function() { renderRouteFacilities(plan, key); };
    filters.appendChild(chip);
  });
  list.innerHTML = '';
  facilities.filter(function(item) { return category === 'all' || item.category === category; }).forEach(function(item) {
    var row = document.createElement('div');
    row.className = 'facility-item';
    row.innerHTML = '<div class="facility-icon">' + (icons[item.category] || '●') + '</div>' +
      '<div class="facility-info"><div class="facility-name">' + item.name + '</div><div class="facility-meta">距路线约' + item.distanceToRouteMeters + '米' +
      (item.wheelchair === 'yes' ? ' · 支持无障碍通行' : '') + '</div></div>';
    row.onclick = function() {
      if (window._navMap) {
        window._navMap.setZoomAndCenter(18, [item.lon, item.lat]);
        openFacilityMapInfo(window._navMap, item);
      } else {
        mToast(item.categoryLabel + '：' + item.name);
      }
    };
    list.appendChild(row);
  });
}

function renderNavigationPlan(plan) {
  setNavigationLoading(false);
  var sourceLabel = plan.provider === 'geoscene-safe-route' ? 'GeoScene安全路线' : '普通步行兜底';
  var routeDetail = (plan.origin || FUTIAN_DEMO_ORIGIN.name) + ' → ' + plan.destination + ' | ' +
    plan.distance + ' · ' + plan.duration + ' · ' + sourceLabel;
  setNavigationStage('planning', routeDetail + ' · 正在加载地图');
  var cards = document.querySelectorAll('#mPage-nav .alert-card');
  var accessibility = plan.accessibility || {};
  if (cards[0]) {
    var safeCost = typeof plan.safeMinutes === 'number' ? ' · 安全成本 ' + plan.safeMinutes + '分钟' : '';
    cards[0].innerHTML = '<strong>无障碍评分：' + (accessibility.score ?? '--') + '分 · ' +
      (accessibility.level || '评估中') + safeCost + '</strong><br>' + (accessibility.summary || '暂无风险信息');
  }
  if (cards[1]) {
    var showConstructionRisks = getSavedPreference('nav_avoid_construction', true);
    var risks = showConstructionRisks ? (accessibility.risks || []) : [];
    var snapWarning = (plan.snapInfo || []).filter(function(item) { return item.distanceMeters > 50; });
    cards[1].innerHTML = '<strong>路线提示：</strong><br>' +
      (snapWarning.length ? snapWarning.map(function(item) {
        return item.name + '距离可通行路网约' + Math.round(item.distanceMeters) + '米';
      }).join('；') : risks.length ? risks.slice(0, 2).map(function(risk) {
        return risk.type + '（距路线约' + risk.distanceToRouteMeters + '米）';
      }).join('；') : ((plan.instructions || [])[0] || '请沿推荐路线通行'));
  }
  var instructions = plan.instructions || [];
  renderRouteComparison(plan);
  renderRouteFacilities(plan);
  var stepsBox = document.getElementById('navSteps');
  var stepsList = document.getElementById('navStepsList');
  if (stepsBox && stepsList) {
    stepsList.innerHTML = '';
    instructions.forEach(function(text, index) {
      var item = document.createElement('li');
      item.textContent = text;
      item.dataset.step = index;
      stepsList.appendChild(item);
    });
    stepsBox.hidden = instructions.length === 0;
  }
  drawNavigationMap(plan).then(function() {
    setNavigationStage('ready', routeDetail);
    if (plan.provider === 'geoscene-safe-route') {
      mToast('GeoScene 无障碍安全路线已绘制');
    } else if (plan.provider === 'amap-walking-fallback') {
      mToast((plan.fallbackReason || '无障碍服务不可用') + '，已显示普通步行路线');
    } else {
      mToast('路线已绘制到地图');
    }
  }).catch(function(error) {
    setNavigationStage('error', routeDetail + ' · 地图加载失败');
    mToast('路线已返回，但地图加载失败：' + (error.message || '未知错误'));
  });
}

function getEffectiveAudioSettings() {
  var settings = { speed: 1, volume: 80, vibration: 2 };
  try { Object.assign(settings, JSON.parse(localStorage.getItem('a11y_settings') || '{}')); } catch (e) {}
  settings.speed = Math.max(0.5, Math.min(2, Number(settings.speed) || 1));
  settings.volume = Math.max(0, Math.min(100, Number(settings.volume) || 80));
  return settings;
}

function getChineseSpeechVoices() {
  if (!window.speechSynthesis) return [];
  var allVoices = window.speechSynthesis.getVoices() || [];
  var chineseVoices = allVoices.filter(function(voice) {
    return /^zh/i.test(voice.lang || '') || /Chinese|Mandarin|中文|普通话/i.test(voice.name || '');
  });
  return chineseVoices.length ? chineseVoices : allVoices;
}

function chooseChineseVoice() {
  var voices = getChineseSpeechVoices();
  if (!voices.length) return null;
  return voices.find(function(voice) { return voice.default; }) || voices[0];
}

function speakNavigation(text) {
  if (!text || !window.speechSynthesis) return;
  var prefs = getEffectiveAudioSettings();
  window.speechSynthesis.cancel();
  var utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-CN';
  utterance.rate = prefs.speed;
  utterance.volume = prefs.volume / 100;
  utterance.pitch = 1;
  var selectedVoice = chooseChineseVoice();
  if (selectedVoice) utterance.voice = selectedVoice;
  window.speechSynthesis.speak(utterance);
}

function previewVoiceSetting(text) {
  speakNavigation(text || '这是无障碍导航语音试听，前方路口请注意安全。');
}

function activateNavigationStep(index) {
  var plan = window._activeNavPlan;
  if (!plan || !plan.instructions || !plan.instructions[index]) return;
  if (window._activeNavStep === index) return;
  window._activeNavStep = index;
  document.querySelectorAll('#navStepsList li').forEach(function(item, itemIndex) {
    item.classList.toggle('active', itemIndex === index);
  });
  speakNavigation(plan.instructions[index]);
  var cards = document.querySelectorAll('#mPage-nav .alert-card');
  if (cards[0]) cards[0].innerHTML = '<strong>当前导航指令：</strong><br>' + plan.instructions[index];
}

function updateLivePosition(lon, lat) {
  var AMap = window.AMap;
  var map = window._navMap;
  var path = window._activeNavPath || [];
  if (!AMap || !map || !path.length) return;
  if (!window._navPositionMarker) {
    window._navPositionMarker = new AMap.Marker({
      position: [lon, lat],
      content: '<div style="width:16px;height:16px;background:#1677ff;border:3px solid #fff;border-radius:50%;box-shadow:0 0 8px #1677ff"></div>',
      zIndex: 200
    });
    map.add(window._navPositionMarker);
  } else {
    window._navPositionMarker.setPosition([lon, lat]);
  }
  var nearestIndex = 0;
  var nearestDistance = Infinity;
  path.forEach(function(point, index) {
    var dx = (point[0] - lon) * 96000;
    var dy = (point[1] - lat) * 111000;
    var distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < nearestDistance) { nearestDistance = distance; nearestIndex = index; }
  });
  var instructions = (window._activeNavPlan && window._activeNavPlan.instructions) || [];
  var stepIndex = Math.min(instructions.length - 1, Math.floor(nearestIndex / Math.max(1, path.length) * instructions.length));
  activateNavigationStep(Math.max(0, stepIndex));
  if (nearestDistance > 45) {
    var cards = document.querySelectorAll('#mPage-nav .alert-card');
    if (cards[1]) cards[1].innerHTML = '<strong>检测到偏航：</strong><br>当前位置距推荐路线约' + Math.round(nearestDistance) + '米，请重新规划。';
    if (navigator.vibrate) navigator.vibrate(vibrationPattern([300, 120, 600]));
    requestAutomaticReroute(lon, lat, nearestDistance);
  }
}

function requestAutomaticReroute(lon, lat, distance) {
  if (!getSavedPreference('nav_auto_reroute', true) || window._rerouteInFlight) return;
  if (window._lastAutoRerouteAt && Date.now() - window._lastAutoRerouteAt < 15000) return;
  var plan = window._activeNavPlan;
  if (!plan || !plan.destination) return;
  window._rerouteInFlight = true;
  window._lastAutoRerouteAt = Date.now();
  var destinationLocation = plan.destinationLocation || {};
  fetchMobileJSON(getMobileApiBase(MOBILE_DATA) + '/api/mobile/navigation/reroute', {
    method: 'POST',
    headers: mobileAuthHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({
      destination: plan.destination,
      lon: lon,
      lat: lat,
      reason: '检测到偏航约' + Math.round(distance) + '米',
      destination_lon: destinationLocation.lon,
      destination_lat: destinationLocation.lat
    })
  }).then(function(newPlan) {
    newPlan.origin = '当前位置';
    MOBILE_DATA.navigation = newPlan;
    renderNavigationPlan(newPlan);
    mToast('检测到偏航，已自动重新规划');
  }).catch(function(err) {
    mToast(err.message || '自动重新规划失败，请手动重试');
  }).finally(function() {
    window._rerouteInFlight = false;
  });
}

function startLiveNavigation() {
  var plan = window._activeNavPlan;
  if (!plan) return mToast('请先选择并规划路线');
  var button = document.getElementById('navStartBtn');
  if (window._navWatchId != null) {
    navigator.geolocation.clearWatch(window._navWatchId);
    window._navWatchId = null;
    setNavigationStage('paused', '路线已保留，可随时继续实时导航');
    return mToast('实时导航已暂停');
  }
  if (!navigator.geolocation) {
    setNavigationStage('ready', '当前浏览器不支持实时定位，可查看路线步骤');
    return mToast('当前浏览器不支持实时定位');
  }
  activateNavigationStep(0);
  window._navWatchId = navigator.geolocation.watchPosition(function(position) {
    var gcjPosition = wgs84ToGcj02(position.coords.longitude, position.coords.latitude);
    if (!isWithinFutianCoverage(gcjPosition)) {
      navigator.geolocation.clearWatch(window._navWatchId);
      window._navWatchId = null;
      setNavigationStage('ready', '设备当前位置不在福田服务区，可继续查看演示路线');
      mToast('设备当前位置不在福田服务区，实时导航未启动');
      return;
    }
    window._lastKnownCoords = gcjPosition;
    updateLivePosition(gcjPosition.lon, gcjPosition.lat);
  }, function() {
    window._navWatchId = null;
    setNavigationStage('ready', '定位不可用，路线仍可查看');
    mToast('无法获取实时位置，请检查浏览器定位权限');
  }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 3000 });
  setNavigationStage('active', '正在使用设备定位沿规划路线导航');
  mToast('实时导航已开始');
}

function endNavigation() {
  clearNavigationResults();
  mGoPage('home');
  mToast('导航已结束');
}

// Add favorite route & reset settings
function addFavRoute() {
  var dest = prompt('添加常用路线\n\n请输入目的地名称：', '');
  if (!dest) return;
  var apiBase = getMobileApiBase(MOBILE_DATA);
  fetchMobileJSON(apiBase + '/api/mobile/user/routes', {
    method: 'POST',
    headers: mobileAuthHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({
      icon: '⭐',
      name: dest,
      detail: '深圳 · 新增常用路线',
      destination: dest
    })
  }).then(function(route) {
    if (!MOBILE_DATA.profile.favoriteRoutes) MOBILE_DATA.profile.favoriteRoutes = [];
    if (!MOBILE_DATA.home.favoriteRoutes) MOBILE_DATA.home.favoriteRoutes = [];
    MOBILE_DATA.profile.favoriteRoutes.push(route);
    MOBILE_DATA.home.favoriteRoutes.push(route);
    renderHomeFromJSON();
    renderProfileFromJSON();
    mToast('已添加常用路线：' + dest);
  }).catch(function(err) {
    mToast(err.message || '添加失败，请确认已登录');
  });
}
function doResetSettings() {
  if (!confirm('确定恢复所有设置为默认值吗？')) return;
  try { localStorage.removeItem('a11y_settings'); } catch(e) {}
  var inner = document.querySelector('.phone-inner');
  if (inner) { inner.classList.remove('large-font', 'high-contrast'); }
  // Reset sliders
  document.getElementById('meSpeedVal').textContent = '1.0x';
  document.getElementById('meSpeedDisp').textContent = '1.0x';
  document.getElementById('meVolVal').textContent = '80%';
  document.getElementById('meVolDisp').textContent = '80%';
  document.getElementById('meVibVal').textContent = '中';
  document.getElementById('meVibDisp').textContent = '中';
  var ranges = document.querySelectorAll('#mPage-me input[type="range"]');
  if (ranges[0]) ranges[0].value = '1.0';
  if (ranges[1]) ranges[1].value = '80';
  if (ranges[2]) ranges[2].value = '2';
  // Reset toggles
  var toggles = document.querySelectorAll('#mPage-me .toggle input[type="checkbox"]');
  var defaults = window._toggleDefaults || [true, true, false, true, false, false, true, true];
  toggles.forEach(function(cb, i) { if (i < defaults.length) cb.checked = defaults[i]; });
  saveMePrefs(true);
  previewVoiceSetting('设置已恢复默认，这是默认导航语音。');
  mToast('设置已恢复默认');
}

function wgs84ToGcj02(lon, lat) {
  if (lon < 72.004 || lon > 137.8347 || lat < 0.8293 || lat > 55.8271) return { lon: lon, lat: lat };
  function transformLat(x, y) {
    var value = -100 + 2 * x + 3 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
    value += (20 * Math.sin(6 * x * Math.PI) + 20 * Math.sin(2 * x * Math.PI)) * 2 / 3;
    value += (20 * Math.sin(y * Math.PI) + 40 * Math.sin(y / 3 * Math.PI)) * 2 / 3;
    value += (160 * Math.sin(y / 12 * Math.PI) + 320 * Math.sin(y * Math.PI / 30)) * 2 / 3;
    return value;
  }
  function transformLon(x, y) {
    var value = 300 + x + 2 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
    value += (20 * Math.sin(6 * x * Math.PI) + 20 * Math.sin(2 * x * Math.PI)) * 2 / 3;
    value += (20 * Math.sin(x * Math.PI) + 40 * Math.sin(x / 3 * Math.PI)) * 2 / 3;
    value += (150 * Math.sin(x / 12 * Math.PI) + 300 * Math.sin(x / 30 * Math.PI)) * 2 / 3;
    return value;
  }
  var a = 6378245;
  var ee = 0.006693421622965943;
  var radLat = lat / 180 * Math.PI;
  var magic = 1 - ee * Math.sin(radLat) * Math.sin(radLat);
  var sqrtMagic = Math.sqrt(magic);
  var dLat = transformLat(lon - 105, lat - 35) * 180 / ((a * (1 - ee)) / (magic * sqrtMagic) * Math.PI);
  var dLon = transformLon(lon - 105, lat - 35) * 180 / (a / sqrtMagic * Math.cos(radLat) * Math.PI);
  return { lon: lon + dLon, lat: lat + dLat };
}

// Apply saved display settings and user info on load
window.addEventListener('load', function() {
  var savedOrigin = FUTIAN_DEMO_ORIGIN.name;
  window._lastKnownCoords = { lon: FUTIAN_DEMO_ORIGIN.lon, lat: FUTIAN_DEMO_ORIGIN.lat };
  try { localStorage.setItem('a11y_origin_name', savedOrigin); } catch (e) {}
  ['homeOriginInput', 'navOriginInput'].forEach(function(id) {
    var input = document.getElementById(id);
    if (input) input.value = savedOrigin;
  });
  // 优先从 JSON 文件加载，失败时使用内联回退数据
  loadMobileData().then(function() {
    initAllMobileFromJSON();

    var user = localStorage.getItem('a11y_mobile_user') || '视障用户';
    var nameEl = document.getElementById('meUserName');
    if (nameEl) nameEl.textContent = user;

    // Restore settings from localStorage
    try {
      var prefs = JSON.parse(localStorage.getItem('a11y_settings') || '{}');
      if (prefs.speed) {
        document.getElementById('meSpeedVal').textContent = prefs.speed + 'x';
        document.getElementById('meSpeedDisp').textContent = prefs.speed + 'x';
        document.querySelector('#mPage-me input[type="range"]').value = prefs.speed;
      }
      if (prefs.volume) {
        document.getElementById('meVolVal').textContent = prefs.volume + '%';
        document.getElementById('meVolDisp').textContent = prefs.volume + '%';
        var ranges = document.querySelectorAll('#mPage-me input[type="range"]');
        if (ranges[1]) ranges[1].value = prefs.volume;
      }
      if (prefs.vibration) {
        var labels = { '1': '弱', '2': '中', '3': '强' };
        var vl = labels[prefs.vibration] || prefs.vibration;
        document.getElementById('meVibVal').textContent = vl;
        document.getElementById('meVibDisp').textContent = vl;
        var ranges = document.querySelectorAll('#mPage-me input[type="range"]');
        if (ranges[2]) ranges[2].value = prefs.vibration;
      }
      // Restore toggles
      var sectionNames = ['nav_blind_lane', 'nav_avoid_construction', 'nav_avoid_stairs', 'nav_auto_reroute',
                          'ui_large_font', 'ui_high_contrast', 'ui_screen_reader', 'ui_key_sound'];
      var toggles = document.querySelectorAll('#mPage-me .toggle input[type="checkbox"]');
      toggles.forEach(function(cb, i) {
        if (i < sectionNames.length && sectionNames[i] in prefs) {
          cb.checked = prefs[sectionNames[i]];
        }
      });
    } catch(e) {}

    applyDisplaySettings();
  }); // end loadMobileData then
}); // end load event listener
