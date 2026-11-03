const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..', '..', '..');
const HTML = fs.readFileSync(path.join(ROOT, '移动端.html'), 'utf8');
const LOGIN_HTML = fs.readFileSync(path.join(ROOT, '移动端登录.html'), 'utf8');
const JS = fs.readFileSync(path.join(ROOT, 'mobile.js'), 'utf8');
const MOBILE_ROUTER = fs.readFileSync(path.join(ROOT, 'backend', 'app', 'routers', 'mobile.py'), 'utf8');

function functionSource(name) {
  const start = JS.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `${name} must exist`);
  const next = JS.indexOf('\nfunction ', start + 10);
  return JS.slice(start, next === -1 ? JS.length : next);
}

test('competition mode defaults to the Futian Shopping Park demo origin without automatic geolocation', () => {
  assert.match(JS, /name:\s*'福田中心演示点（购物公园）'/);
  assert.match(JS, /lon:\s*114\.0550/);
  assert.match(JS, /lat:\s*22\.5350/);
  assert.match(HTML, /value="福田中心演示点（购物公园）"/);
  assert.match(JS, /function isWithinFutianCoverage\(coords\)/);
  assert.match(JS, /refreshNearbyBusStops\(\{ locate: false \}\)/);

  const loadHandler = JS.slice(JS.indexOf("window.addEventListener('load'"));
  assert.doesNotMatch(loadHandler, /navigator\.geolocation\.getCurrentPosition/);
});

test('device report coordinates are converted to GCJ-02 before submission', () => {
  const source = functionSource('refreshReportLocation');
  assert.match(source, /wgs84ToGcj02\(position\.coords\.longitude,\s*position\.coords\.latitude\)/s);
  assert.match(MOBILE_ROUTER, /"coordinateSystem":\s*"GCJ-02"/);
  assert.match(MOBILE_ROUTER, /"blurred":\s*False/);
});

test('navigation has truthful idle state and clears stale results around a new request', () => {
  assert.match(HTML, /<h2[^>]*id="navStatusTitle"[^>]*>无障碍导航/);
  assert.match(HTML, /<div class="nav-meta">尚未规划路线<\/div>/);
  assert.doesNotMatch(HTML, /前往: 市民中心地铁站 \| 剩余 850m/);
  assert.match(JS, /function setNavigationStage\(stage, detail\)/);
  assert.match(JS, /function clearNavigationResults\(/);

  const routeSource = functionSource('startFavRoute');
  assert.ok(
    routeSource.indexOf('clearNavigationResults(') < routeSource.indexOf("fetchMobileJSON("),
    'old route state must be cleared before requesting a new route',
  );
  assert.match(routeSource, /setNavigationStage\('error'/);
});

test('AI and photo features are presented honestly as competition simulations', () => {
  assert.match(HTML, /AI 环境感知模拟/);
  assert.match(HTML, /运行感知模拟/);
  assert.match(JS, /function runPerceptionDemo\(\)/);
  assert.doesNotMatch(HTML, /摄像头预览功能开发中|自动进行人脸和车牌模糊处理/);
  assert.match(HTML, /请避免拍摄人脸、车牌等隐私信息/);
});

test('core mobile interactions use native controls and allow browser zoom', () => {
  assert.doesNotMatch(HTML, /user-scalable=no/);
  assert.doesNotMatch(LOGIN_HTML, /user-scalable=no/);
  assert.match(HTML, /<button[^>]*class="voice-btn"/);
  assert.match(HTML, /<button[^>]*class="quick-card"/);
  assert.match(HTML, /<button[^>]*class="fav-route-item"/);
  assert.match(HTML, /<button[^>]*class="tab-item active"[^>]*aria-current="page"/);
  assert.match(HTML, /type="range"[^>]*aria-label="播报语速"/);
  assert.match(HTML, /type="checkbox"[^>]*aria-label="优先无障碍安全路线"/);
});

test('screen reader setting updates live regions and logout has no undefined toggle access', () => {
  assert.match(functionSource('applyDisplaySettings'), /aria-live/);
  assert.doesNotMatch(functionSource('doLogout'), /toggles\.length/);
  assert.match(functionSource('mGoPage'), /aria-current/);
});

test('profile removes voice-type selection while keeping standard speech controls', () => {
  assert.doesNotMatch(HTML, /语音类型|meVoiceLabel|meVoiceStatus/);
  assert.doesNotMatch(JS, /cycleVoiceTypeMe|VOICE_PROFILES|getVoiceProfile|meVoiceLabel|meVoiceStatus/);
  assert.match(JS, /delete prefs\.voice_type/);

  const speakSource = functionSource('speakNavigation');
  assert.match(speakSource, /utterance\.rate\s*=\s*prefs\.speed/);
  assert.match(speakSource, /utterance\.volume\s*=\s*prefs\.volume\s*\/\s*100/);
  assert.match(speakSource, /chooseChineseVoice\(\)/);
});
