const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..', '..', '..');
const html = fs.readFileSync(path.join(root, 'Web管理端.html'), 'utf8');
const script = fs.readFileSync(path.join(root, 'web.js'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'styles', 'webcss.css'), 'utf8');
const mock = JSON.parse(fs.readFileSync(path.join(root, 'data', 'web-mock-api.json'), 'utf8'));

function functionSource(name) {
  const start = script.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `${name} should exist`);
  const next = script.indexOf('\nfunction ', start + 10);
  return script.slice(start, next === -1 ? script.length : next);
}

test('manual refresh uses the backend snapshot and reports a real result', () => {
  assert.match(html, /id="refreshWebButton"[^>]*onclick="manualRefreshWebData\(this\)"/);
  assert.doesNotMatch(html, /applyEventFilters\(\);toast\('数据已刷新'\)/);

  const source = functionSource('manualRefreshWebData');
  assert.match(source, /refreshWebSnapshot\(\)/);
  assert.match(source, /button\.disabled\s*=\s*true/);
  assert.match(source, /数据刷新成功/);
  assert.match(source, /数据刷新失败/);
  assert.match(source, /button\.disabled\s*=\s*false/);
});

test('event update opens a state-aware detail workflow', () => {
  const listSource = functionSource('renderEventsFromJSON');
  assert.match(listSource, /evt\.canUpdate[\s\S]*openEventDetail/);
  assert.doesNotMatch(listSource, /状态更新中/);

  const detailSource = functionSource('renderEventDetailFromJSON');
  assert.match(detailSource, /ed\.canAudit/);
  assert.match(detailSource, /ed\.canUpdate/);
  assert.match(detailSource, /eventComplete\(\)/);
  assert.match(detailSource, /标记已修复/);
});

test('assignment and static event heat controls are removed', () => {
  assert.doesNotMatch(html, /分配处理人|事件热力|heat-spots|leg-heat|heat-spot/);
  assert.doesNotMatch(functionSource('renderEventDetailFromJSON'), /分配处理人|已分配给/);
  assert.doesNotMatch(functionSource('renderMapFromJSON'), /heatmap|heat-spot/);
  assert.doesNotMatch(styles, /\.heat-spot|@keyframes heatPulse/);
  assert.equal(Object.hasOwn(mock.dashboard.map, 'heatmap'), false);
  assert.equal(mock.dashboard.map.legend.some((item) => item.key === 'heat-spots'), false);
});

test('web assets use the refreshed cache version', () => {
  assert.match(script, /WEB_DATA_VERSION\s*=\s*'20260721-web-controls'/);
  assert.doesNotMatch(html, /20260720-event-map-location/);
});
