const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..', '..', '..');
const MOBILE_HTML = fs.readFileSync(path.join(ROOT, '移动端.html'), 'utf8');
const MOBILE_JS = fs.readFileSync(path.join(ROOT, 'mobile.js'), 'utf8');
const MOBILE_CSS = fs.readFileSync(path.join(ROOT, 'styles', 'mobilecss.css'), 'utf8');
const WEB_JS = fs.readFileSync(path.join(ROOT, 'web.js'), 'utf8');
const WEB_CSS = fs.readFileSync(path.join(ROOT, 'styles', 'webcss.css'), 'utf8');

function functionSource(source, name) {
  const start = source.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `${name} must exist`);
  const next = source.indexOf('\nfunction ', start + 10);
  return source.slice(start, next === -1 ? source.length : next);
}

test('mobile report success and history details render uploaded photos', () => {
  assert.match(MOBILE_HTML, /id="reportResultPhoto"/);
  assert.match(MOBILE_HTML, /id="reportResultPhotoImage"/);
  assert.match(MOBILE_JS, /photoUrl:\s*data\.photoUrl/);
  assert.match(functionSource(MOBILE_JS, 'showReportResult'), /renderMobileReportPhoto\(data\.photoUrl\)/);
  assert.match(functionSource(MOBILE_JS, 'renderProfileFromJSON'), /item\.photoUrl/);
  assert.match(MOBILE_CSS, /\.rh-photo-thumbnail\s*\{/);
  assert.match(MOBILE_CSS, /\.report-result-photo\s*\{/);
});

test('web event detail renders the real photo URL with an empty fallback', () => {
  assert.match(functionSource(WEB_JS, 'renderEventDetailFromJSON'), /ed\.photoUrl/);
  assert.match(functionSource(WEB_JS, 'renderEventDetailFromJSON'), /det-photo-image/);
  assert.match(WEB_JS, /现场未上传照片/);
  assert.doesNotMatch(functionSource(WEB_JS, 'renderEventDetailFromJSON'), /地理位置水印已嵌入|人脸\/车牌已模糊/);
  assert.match(WEB_CSS, /\.det-photo-image\s*\{/);
});
