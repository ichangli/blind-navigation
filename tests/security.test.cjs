const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {JSDOM} = require('jsdom');
const root = path.resolve(__dirname, '..');
function extract(source, name) {
  const start = source.indexOf('function ' + name + '(');
  assert.ok(start >= 0, name);
  const next = source.indexOf('\nfunction ', start + 10);
  return source.slice(start, next < 0 ? source.length : next);
}
for (const folder of ['', 'site-demo']) test('event renderers treat hostile text as text: ' + (folder || 'source'), () => {
  const source = fs.readFileSync(path.join(root, folder, 'web.js'), 'utf8');
  const dom = new JSDOM('<div id="dashMap"></div><div id="page-events"><table class="evt-table"><tbody></tbody></table></div><div id="page-event-detail"><div class="det-grid"></div></div>', {runScripts:'outside-only'});
  const w = dom.window;
  const payload = '<img src=x onerror="window.pwned=1">';
  const id = "E'\";window.pwned=1;//";
  const event = Object.fromEntries(['type','title','status','coords','district','reporter','time','reporterType','address','reportTime','landmark','priority','sla','description','reportMethod','location'].map(k => [k,payload]));
  Object.assign(event, {id, lon:114, lat:22, canDelete:true, canAudit:true, canUpdate:true});
  Object.assign(w, {APP_DATA:{events:[event],eventDetail:event}, pages:{}, userRole:'admin', getStatusClass:()=> 'st-pending', applyEventFilters:()=>{}, clearMapPopups:()=>{}, getWebApiBase:()=>'', highlightSelectedEventMarker:()=>{}});
  for (const name of ['escapeMapText','resolveWebReportPhotoUrl','renderEventsFromJSON','renderEventDetailFromJSON','showMapEventPopup']) w.eval(extract(source,name));
  let opened, deleted;
  w.openEventDetail = value => {opened=value;};
  w.requestDeleteEvent = value => {deleted=value;};
  w.renderEventsFromJSON();
  w.document.querySelector('tbody button').click();
  assert.equal(opened,id);
  w.document.querySelector('tbody .act-delete').click();
  assert.equal(deleted,id);
  w.renderEventDetailFromJSON();
  w.document.querySelector('#eventDetailDeleteButton').click();
  assert.equal(deleted,id);
  w.showMapEventPopup(event);
  assert.equal(w.document.querySelectorAll('img,script,[onerror]').length,0);
  assert.ok(w.document.querySelector('.det-grid').textContent.includes(payload));
  assert.ok(w.document.querySelector('.event-map-popup').textContent.includes(payload));
  assert.equal(w.pwned,undefined);
  dom.window.close();
});

test('large road layer is created only on opt-in and reused across toggles', () => {
  const source=fs.readFileSync(path.join(root,'demo/demo-map.js'),'utf8');
  const start=source.indexOf('window.createGeoSceneRoadLayerV4=');
  const end=source.indexOf('window.syncGeoSceneRoadLod=',start);
  const vm=require('node:vm');
  let created=0;
  class Group {
    constructor(){this.listeners=[];this.children=[];this._visible=false;}
    watch(name, callback){this.listeners.push(callback);}
    set visible(value){this._visible=value;this.listeners.forEach(fn=>fn(value));}
    get visible(){return this._visible;}
    add(layer){this.children.push(layer);}
  }
  class Road {
    constructor(options){created++;this.url=options.url;}
    when(){return Promise.resolve();}
  }
  const context={window:{syncGeoSceneRoadLod(){},applyRoadThemeV4(){}},data:x=>x,getRoadUnifiedRenderer:()=>({}),toast(){}};
  vm.runInNewContext(source.slice(start,end),context);
  const group=context.window.createGeoSceneRoadLayerV4({GroupLayer:Group,GeoJSONLayer:Road});
  assert.equal(created,0);
  group.visible=false;assert.equal(created,0);
  group.visible=true;assert.equal(created,1);
  assert.equal(group.children[0].url,'network-display.geojson');
  group.visible=false;group.visible=true;assert.equal(created,1);
});
