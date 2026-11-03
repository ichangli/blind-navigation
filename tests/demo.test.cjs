const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
const { IDBFactory } = require('fake-indexeddb');
const root = path.resolve(__dirname, '..', 'site-demo');

function page(filename, factory = new IDBFactory(), scripts = false) {
  const html = fs.readFileSync(path.join(root, filename), 'utf8');
  const dom = new JSDOM(html, { url: 'https://example.github.io/blind-navigation/' + encodeURI(filename), runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  const requests = [];
  const errors = [];
  w.fetch = async function(input) {
    const u = new URL(typeof input === 'string' ? input : (input.href || input.url), w.document.baseURI);
    requests.push(u.href);
    assert.equal(u.origin, 'https://example.github.io', 'all data stays same-origin');
    const file = path.resolve(root, decodeURI(u.pathname.replace('/blind-navigation/', '')));
    assert.ok(file.startsWith(root + path.sep));
    return new Response(fs.readFileSync(file), {status:200,headers:{'content-type':file.endsWith('.json')?'application/json':'text/plain'}});
  };
  Object.assign(w, { Response, Blob, File, FormData, indexedDB: factory, BroadcastChannel: undefined });
  w.URL.createObjectURL = URL.createObjectURL;
  w.URL.revokeObjectURL = URL.revokeObjectURL;
  w.confirm = () => true;
  w.console = {log(){},warn(){},error(...args){errors.push(args.join(' '));}};
  w.addEventListener('error', e => errors.push(e.message));
  w.eval(fs.readFileSync(path.join(root, 'demo-runtime.js'), 'utf8'));
  if (scripts) {
    if (filename === 'Web管理端.html') {
      w.eval(fs.readFileSync(path.join(root, 'road-visuals.js'), 'utf8'));
      w.eval(fs.readFileSync(path.join(root, 'water-visuals.js'), 'utf8'));
      w.eval(fs.readFileSync(path.join(root, 'web.js'), 'utf8'));
      w.eval(fs.readFileSync(path.join(root, 'demo-map.js'), 'utf8'));
      // This suite checks UI/business contracts. WebGL requires separate device QA.
      w.initGeoSceneMap = () => Promise.resolve(false);
      w.initTiles3DMap = () => Promise.resolve(true);
    } else {
      w.SVGSVGElement.prototype.createSVGRect = () => ({});
      w.eval(fs.readFileSync(path.join(root, 'vendor/leaflet/leaflet.js'), 'utf8'));
      w.eval(fs.readFileSync(path.join(root, 'mobile.js'), 'utf8'));
      w.eval(fs.readFileSync(path.join(root, 'demo-mobile.js'), 'utf8'));
    }
  }
  const api = async (route, options) => {
    const r = await w.fetch('/blind-navigation/api/' + route, options);
    return {status:r.status, data:await r.json()};
  };
  return {w,api,requests,errors,close(){dom.window.close();}};
}

async function until(fn, message) {
  const end = Date.now() + 6000;
  while (Date.now() < end) { if (fn()) return; await new Promise(r => setTimeout(r,20)); }
  assert.ok(fn(), message);
}

test('same-browser submission, review, photo and deletion; another browser stays isolated', async () => {
  const shared = new IDBFactory();
  const mobile = page('移动端.html', shared);
  const admin = page('Web管理端.html', shared);
  const outsider = page('移动端.html');
  try {
    await Promise.all([mobile.w.BlindDemo.ready,admin.w.BlindDemo.ready,outsider.w.BlindDemo.ready]);
    const before = (await mobile.api('mobile/report/history')).data.length;
    const form = new FormData();
    form.set('type','盲道被占'); form.set('description','集成测试：本机演示上报'); form.set('lon','114.055');form.set('lat','22.535');form.set('address','测试地点');
    form.set('photo',new File([Uint8Array.from([137,80,78,71])],'demo.png',{type:'image/png'}));
    const submitted = await mobile.api('mobile/report',{method:'POST',body:form});
    assert.equal(submitted.status,200);
    assert.ok(submitted.data.eventId.startsWith('DEMO-'));
    assert.ok(mobile.w.BlindDemo.photoURL(submitted.data.photoUrl).startsWith('blob:'));
    let events = (await admin.api('web/events')).data;
    assert.equal(events.length,before+1);
    const id = submitted.data.eventId;
    assert.equal(events.find(e=>e.id===id).status,'待审核');
    assert.equal((await admin.api('web/events/'+id+'/status',{method:'PATCH',body:JSON.stringify({status:'处理中'})})).status,200);
    assert.equal((await mobile.api('mobile/report/history')).data.find(e=>e.eventId===id).status,'处理中');
    assert.equal((await outsider.api('mobile/report/history')).data.length,before);
    assert.equal((await admin.api('web/events/'+id,{method:'DELETE'})).status,200);
    assert.equal((await mobile.api('mobile/report/history')).data.length,before);
    assert.ok(mobile.requests.every(u=>!u.includes('/api/')),'API calls are handled in browser without network requests');
  } finally { mobile.close();admin.close();outsider.close(); }
});

test('preset route contracts, valid geometry, unsupported arbitrary destination and persistent settings', async () => {
  const p=page('移动端.html');
  try {
    await p.w.BlindDemo.ready;
    assert.equal(p.w.BlindDemo.cases.length,3);
    for(const c of p.w.BlindDemo.cases) {
      const result=await p.api('mobile/navigation/plan',{method:'POST',body:JSON.stringify({destination:c.destination})});
      assert.equal(result.status,200);assert.equal(result.data.isDemo,true);assert.equal(result.data.coordinateSystem,'WGS84');
      assert.ok(result.data.route.length>2);assert.ok(result.data.distanceMeters>0);assert.equal(result.data.routeOptions.length,2);
      assert.ok(result.data.route.every(v=>v.lon>113.9&&v.lon<114.2&&v.lat>22.4&&v.lat<22.7));
      const web=await p.api('web/map/navigation/solve',{method:'POST',body:JSON.stringify({origin:c.originLocation,destination:c.destinationLocation})});assert.equal(web.status,200);
      const reverse=await p.api('web/map/navigation/solve',{method:'POST',body:JSON.stringify({origin:c.destinationLocation,destination:c.originLocation})});assert.equal(reverse.status,200);assert.deepEqual(reverse.data.route[0],c.route[c.route.length-1]);
    }
    assert.equal((await p.api('mobile/navigation/plan',{method:'POST',body:JSON.stringify({destination:'北京故宫'})})).status,422);
    assert.equal((await p.api('mobile/navigation/plan',{method:'POST',body:JSON.stringify({destination:'莲花山'})})).status,200);
    await p.api('mobile/user/settings',{method:'PUT',body:JSON.stringify({volume:42})});
    assert.equal((await p.api('mobile/user/settings')).data.volume,42);
    assert.equal((await p.api('not-implemented')).status,404);
  }finally{p.close();}
});

test('original Web UI renders through explicit demo API and can review an event', async () => {
  const p=page('Web管理端.html',new IDBFactory(),true);
  try {
    await until(()=>p.w.APP_DATA&&p.w.document.querySelectorAll('.evt-table tbody tr').length===5,'Web rows rendered');
    assert.equal(p.w.getWebApiBase(),'/blind-navigation');
    p.w.openEventDetail('E20260701');
    await until(()=>p.w.APP_DATA.eventDetail.id==='E20260701'&&p.w.document.querySelector('#auditSection'),'event detail rendered');
    p.w.eventApprove();
    await until(()=>p.w.APP_DATA.events.find(e=>e.id==='E20260701').status==='处理中','review updates UI state');
    assert.equal(p.errors.length,0,p.errors.join('\n'));
  }finally{p.close();}
});

test('original mobile UI loads and can draw and switch preset route maps without a Key', async () => {
  const p=page('移动端.html',new IDBFactory(),true);
  try {
    await until(()=>p.w.MOBILE_DATA&&p.w.MOBILE_DATA.home,'mobile data rendered');
    assert.equal(p.w.getMobileApiBase(),'/blind-navigation');
    p.w.startFavRoute('市民中心地铁站F口');
    await until(()=>p.w._activeNavPlan&&p.w._demoMobileMap,'preset map starts');
    p.w.startFavRoute('莲花山公园');
    await until(()=>p.w._activeNavPlan&&p.w._activeNavPlan.caseId==='park'&&p.w._demoMobileMap,'map can be destroyed and recreated');
    assert.equal(p.errors.length,0,p.errors.join('\n'));
    assert.ok(p.requests.every(u=>!u.includes('amap')&&!u.includes('geoscene')));
  }finally{p.close();}
});

test('static artifact contains complete local map assets and no backend/environment database', () => {
  for(const file of ['index.html','demo-runtime.js','demo-map.js','demo-mobile.js','vendor/arcgis/init.js','vendor/arcgis/esri/Map.js','vendor/arcgis/esri/views/SceneView.js','vendor/leaflet/leaflet.js','data/buildings.geojson','data/network-display.geojson','data/routes.json'])assert.ok(fs.existsSync(path.join(root,file)),file);
  for(const file of ['backend','.env','data/demo.db','backend/.env'])assert.equal(fs.existsSync(path.join(root,file)),false,file);
});
