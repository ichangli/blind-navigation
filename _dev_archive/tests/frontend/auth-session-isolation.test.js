const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..', '..', '..');
const MOBILE_LOGIN = fs.readFileSync(path.join(ROOT, '移动端登录.html'), 'utf8');
const MOBILE_HTML = fs.readFileSync(path.join(ROOT, '移动端.html'), 'utf8');
const MOBILE_JS = fs.readFileSync(path.join(ROOT, 'mobile.js'), 'utf8');
const WEB_LOGIN = fs.readFileSync(path.join(ROOT, '登录.html'), 'utf8');
const WEB_HTML = fs.readFileSync(path.join(ROOT, 'Web管理端.html'), 'utf8');
const WEB_JS = fs.readFileSync(path.join(ROOT, 'web.js'), 'utf8');

const GENERIC_SESSION_KEY = /['"]a11y_(?:token|user|role|logged_in)['"]/;

test('mobile client owns a namespaced authentication session', () => {
  for (const suffix of ['token', 'user', 'role', 'logged_in']) {
    assert.match(MOBILE_LOGIN, new RegExp(`a11y_mobile_${suffix}`));
  }
  assert.match(MOBILE_HTML, /a11y_mobile_logged_in/);
  assert.match(MOBILE_JS, /a11y_mobile_token/);
  assert.match(MOBILE_JS, /a11y_mobile_user/);
  assert.match(MOBILE_JS, /removeItem\('a11y_mobile_logged_in'\)/);
  assert.doesNotMatch(MOBILE_LOGIN + MOBILE_HTML + MOBILE_JS, /a11y_web_/);
  assert.doesNotMatch(MOBILE_LOGIN + MOBILE_HTML + MOBILE_JS, GENERIC_SESSION_KEY);
});

test('web client owns a separate namespaced authentication session', () => {
  for (const suffix of ['token', 'user', 'role', 'logged_in']) {
    assert.match(WEB_LOGIN, new RegExp(`a11y_web_${suffix}`));
  }
  assert.match(WEB_HTML, /a11y_web_logged_in/);
  assert.match(WEB_JS, /a11y_web_token/);
  assert.match(WEB_JS, /a11y_web_user/);
  assert.match(WEB_JS, /removeItem\('a11y_web_token'\)/);
  assert.doesNotMatch(WEB_LOGIN + WEB_HTML + WEB_JS, /a11y_mobile_/);
  assert.doesNotMatch(WEB_LOGIN + WEB_HTML + WEB_JS, GENERIC_SESSION_KEY);
});
