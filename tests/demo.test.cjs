const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
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
  w.console = {log(){},debug(){},info(){},warn(){},error(...args){errors.push(args.join(' '));}};
  w.addEventListener('error', e => errors.push(e.message));
  w.eval(fs.readFileSync(path.join(root, 'showcase-roads.js'), 'utf8'));
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
      const reverse=await p.api('web/map/navigation/solve',{method:'POST',body:JSON.stringify({origin:c.destinationLocation,destination:c.originLocation})});assert.equal(reverse.status,200);assert.equal(reverse.data.route[0].lon,c.route[c.route.length-1].lon);assert.equal(reverse.data.route[0].lat,c.route[c.route.length-1].lat);
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
    assert.equal(p.w._demoMobileMap.getPane('demo-showcase-roads').style.zIndex,'350','display roads remain below route overlays');
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

test('3D bootstrap references the packaged stylesheet, loader and CSS dependencies', async () => {
  const p=page('Web管理端.html',new IDBFactory(),true);
  try {
    const requested=[];
    p.w.loadStyleOnce=p.w.loadScriptOnce=async function(id,href){
      requested.push(href);
      const resource=path.join(root,new URL(href,p.w.document.baseURI).pathname.replace('/blind-navigation/',''));
      assert.ok(fs.existsSync(resource),'3D startup resource exists: '+href);
    };
    p.w.require=function(ids,success){success(...ids.map(id=>id==='esri/config'?{}:function(){}));};
    const modules=await p.w.loadGeoSceneModules();
    assert.equal(p.w.esriConfig.assetsPath,'https://example.github.io/blind-navigation/vendor/arcgis/esri/assets/');
    assert.match(modules.config.workers.loaderUrl,/\/vendor\/arcgis\/worker-init-[a-f0-9]{12}\.js$/);
    for(const href of [modules.config.workers.loaderUrl,modules.config.workers.workerPath]){
      const asset=path.join(root,new URL(href).pathname.replace('/blind-navigation/',''));
      assert.ok(fs.existsSync(asset),'Worker bootstrap exists: '+href);
    }
    const cssPath=requested.find(href=>href.endsWith('.css'));
    assert.equal(cssPath,'./vendor/arcgis/esri/assets/esri/themes/dark/main.css');
    const cssFile=path.join(root,cssPath);
    const css=fs.readFileSync(cssFile,'utf8');
    for(const m of css.matchAll(/url\(["']?([^"')]+)["']?\)/g)){
      if(/^(data:|https?:|#|var\()/i.test(m[1]))continue;
      const asset=path.resolve(path.dirname(cssFile),m[1].split(/[?#]/)[0]);
      assert.ok(fs.existsSync(asset),'CSS dependency exists: '+m[1]);
    }
    const html=fs.readFileSync(path.join(root,'Web管理端.html'),'utf8');
    assert.match(html,/web\.js\?v=[a-f0-9]{12}/);
    assert.match(html,/demo-map\.js\?v=[a-f0-9]{12}/);
    assert.ok(!fs.readFileSync(path.join(root,'demo-map.js'),'utf8').includes('当前设备未启用三维'));
  }finally{p.close();}
});

test('real AMD SceneView, SSAO and map modules load from the bundle without module HTTP requests', async () => {
  const p=page('Web管理端.html');
  const w=p.w;
  try {
    const base=new URL('vendor/arcgis/',w.document.baseURI).href;
    Object.defineProperty(w.document,'currentScript',{value:{src:base+'init.js'}});
    w.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});
    w.ResizeObserver=w.IntersectionObserver=class{observe(){}unobserve(){}disconnect(){}};
    w.HTMLImageElement.prototype.decode=()=>Promise.resolve();
    Object.assign(w,{TextEncoder,TextDecoder,Request,AbortController});
    w.esriConfig={assetsPath:base+'esri/assets/'};
    const injected=[];
    const insert=w.document.head.insertBefore.bind(w.document.head);
    w.document.head.insertBefore=(el,before)=>{if(el.src)injected.push(el.src);return insert(el,before);};
    w.eval(fs.readFileSync(path.join(root,'vendor/arcgis/init.js'),'utf8'));
    const bundle=fs.readdirSync(path.join(root,'vendor/arcgis')).find(f=>/^scene-modules-/.test(f));
    w.eval(fs.readFileSync(path.join(root,'vendor/arcgis',bundle),'utf8'));
    const ids=['esri/config','esri/Basemap','esri/Map','esri/WebScene','esri/views/SceneView','esri/layers/VectorTileLayer','esri/layers/WebTileLayer','esri/layers/MapImageLayer','esri/layers/GroupLayer','esri/layers/FeatureLayer','esri/layers/GraphicsLayer','esri/layers/SceneLayer','esri/layers/GeoJSONLayer','esri/Graphic','esri/geometry/support/webMercatorUtils','esri/views/3d/webgl-engine/effects/ssao/SSAO'];
    const modules=await new Promise((resolve,reject)=>{w.require.on('error',reject);w.require(ids,(...m)=>resolve(m),reject);});
    assert.equal(typeof modules[4],'function','actual SceneView constructor loaded');
    assert.equal(typeof modules.at(-1).SSAO,'function','the failing SSAO module loaded');
    await w.BlindDemo.ready;
    const displayLayers=w.BlindShowcaseRoads.createArcGISLayers({GeoJSONLayer:modules[12]},w.BlindDemo.showcaseRoads,new URL('data/showcase_roads.geojson',w.document.baseURI).href);
    assert.equal(displayLayers.length,9);
    assert.equal(displayLayers.find(l=>l.id==='showcase-expressway-glow').renderer.symbol.width,10,'SDK accepts original glow width');
    displayLayers.forEach(l=>l.destroy());
    assert.deepEqual(injected,[],'AMD modules require no individual script downloads');
    assert.equal(p.errors.length,0,p.errors.join('\n'));
  }finally{p.close();}
});

test('real worker bootstrap loads RemoteClient with one module identity and cached dependencies', async () => {
  const base='https://example.github.io/blind-navigation/vendor/arcgis/';
  const imports=[];
  class WorkerGlobalScope{}
  const worker=new WorkerGlobalScope();
  Object.assign(worker,{WorkerGlobalScope,URL,TextEncoder,TextDecoder,AbortController,Blob,MessageChannel,performance,crypto,atob,btoa,console:{log(){},warn(){},error(...args){throw new Error(args.join(' '));}},setTimeout,clearTimeout,navigator:{language:'zh-CN'},location:{href:'blob:https://example.github.io/demo-worker'}});
  worker.self=worker;
  const init=fs.readdirSync(path.join(root,'vendor/arcgis')).find(f=>/^worker-init-/.test(f));
  worker.esriConfig={assetsPath:base+'esri/assets/',workers:{loaderUrl:base+init,workerPath:base+'worker-client.js'}};
  worker.dojoConfig={async:true,baseUrl:base,packages:[{name:'esri',location:base+'esri/'}],has:{'host-webworker':1,'host-browser':0,dom:0}};
  const context=vm.createContext(worker);
  worker.importScripts=(...urls)=>{for(const url of urls){imports.push(url);const file=path.join(root,new URL(url).pathname.replace('/blind-navigation/',''));vm.runInContext(fs.readFileSync(file,'utf8'),context);}};
  vm.runInContext(fs.readFileSync(path.join(root,'vendor/arcgis',init),'utf8'),context);
  const client=await new Promise((resolve,reject)=>{worker.require.on('error',reject);worker.require([base+'worker-client.js'],resolve,reject);});
  const byId=await new Promise((resolve,reject)=>worker.require(['esri/core/workers/RemoteClient'],resolve,reject));
  assert.equal(typeof client,'function');assert.equal(client,byId,'URL entry delegates to the same AMD module');
  assert.equal(imports.length,2,'worker imports only the loader and prebuilt module cache');
});

test('3D loader retries a transient script failure before loading the module bundle', async () => {
  const p=page('Web管理端.html',new IDBFactory(),true);
  try {
    await until(()=>p.w.APP_DATA&&p.w.document.querySelectorAll('.evt-table tbody tr').length===5,'initial Web UI settled');
    const requested=[];let failures=0;
    p.w.loadScriptOnce=async(id,url)=>{requested.push({id,url});if(id==='geoscene-arcgis-js'&&failures++<2)throw new Error('503');};
    const originalTimeout=p.w.setTimeout.bind(p.w);
    p.w.setTimeout=(fn,delay)=>originalTimeout(fn,Math.min(delay,1));
    p.w.eval(fs.readFileSync(path.join(root,'demo-map.js'),'utf8'));
    await p.w.loadScriptOnce('geoscene-arcgis-js','./vendor/arcgis/init.js');
    assert.equal(requested.filter(r=>r.id==='geoscene-arcgis-js').length,3);
    assert.match(requested.at(-1).url,/scene-modules-[a-f0-9]{12}\.js$/);
  }finally{p.close();}
});

test('late SDK completion can upgrade a displayed 2D fallback', async () => {
  const p=page('Web管理端.html',new IDBFactory(),true);
  try {
    await until(()=>p.w.APP_DATA&&p.w.document.querySelectorAll('.evt-table tbody tr').length===5,'initial Web UI settled');
    let removed=false,started=false;
    p.w._geoSceneFailed=true;p.w._geoSceneLateRetryStarted=false;
    p.w._demoLeafletMap={remove(){removed=true;}};
    p.w.initGeoSceneMap=()=>{started=true;return Promise.resolve(true);};
    p.w.recoverGeoSceneAfterLateSdk({config:{}});
    await Promise.resolve();
    assert.equal(removed,true);assert.equal(started,true);
    assert.equal(p.w._demoLeafletMap,null);assert.equal(p.w._geoSceneFailed,false);
  }finally{p.close();}
});

test('the original coarse showcase roads are published and wired into the display basemap', async () => {
  const source=fs.readFileSync(path.join(__dirname,'../datasets/showcase/showcase_roads.geojson'));
  assert.deepEqual(fs.readFileSync(path.join(root,'data/showcase_roads.geojson')),source,'published display data is unchanged');
  const p=page('Web管理端.html',new IDBFactory(),true);
  try {
    await until(()=>p.w.APP_DATA&&p.w.document.querySelectorAll('.evt-table tbody tr').length===5,'Web ready');
    assert.equal(p.w.BlindDemo.showcaseRoads.features.length,130);
    function Model(options){Object.assign(this,options);}
    const basemap=p.w.createGeoSceneBasemap({GeoJSONLayer:Model,Basemap:Model});
    const layers=basemap.baseLayers.filter(l=>l.id?.startsWith('showcase-'));
    assert.equal(layers.length,9,'three strokes for each of the three road classes');
    for(const kind of ['expressway','primary','secondary']){
      const original=p.w.BlindDemo.showcaseRoads.features.find(f=>f.properties.road_class===kind).properties;
      for(const stroke of ['glow','casing','core']){
        const layer=layers.find(l=>l.id==='showcase-'+kind+'-'+stroke);
        assert.ok(layer.url.endsWith('/data/showcase_roads.geojson'));
        assert.equal(layer.renderer.symbol.width,original[stroke+'_width']);
        assert.equal(layer.minScale,original.min_scale);
        assert.equal(layer.definitionExpression,"road_class = '"+kind+"'");
      }
    }
    assert.ok(fs.readFileSync(path.join(root,'Web管理端.html'),'utf8').includes('showcase-roads.js?v='));
  }finally{p.close();}
});
