/* Explicit browser-only adapter. The original backend remains in the repository. */
(function () {
  'use strict';
  var base = new URL('./', document.baseURI);
  var prefix = 'blind-navigation:demo:v1:';
  var dbName = prefix + 'state';
  var originalFetch = window.fetch.bind(window);
  var state, database, memoryOnly = false;
  var photos = new Map();
  var channel = typeof BroadcastChannel === 'function' ? new BroadcastChannel(prefix + 'updates') : null;
  function clone(value) { return JSON.parse(JSON.stringify(value)); }
  function json(file) { return originalFetch(new URL(file, base)).then(function (r) { if (!r.ok) throw new Error('演示文件加载失败：' + file); return r.json(); }); }
  function storage(key, value) { try { localStorage.setItem(prefix + key, value); } catch (_) {} }
  ['web', 'mobile'].forEach(function (role) {
    storage('a11y_' + role + '_logged_in', 'true');
    storage('a11y_' + role + '_user', role === 'web' ? '演示管理员' : '演示体验者');
    storage('a11y_' + role + '_role', role === 'web' ? 'admin' : 'user');
  });
  var filesPromise = Promise.all([json('data/web-mock-api.json'), json('data/mobile-mock-api.json'), json('data/facilities.json'), json('data/building-semantics.json'), json('data/routes.json')]);
  var loaded;
  function initialState(files) {
    var web = files[0], detail = web.eventDetail;
    return {
      version: 1, sequence: 0, settings: {}, favorites: files[4].map(function(c){return {icon:'🧭',name:c.destination,dest:c.destination,destination:c.destination,detail:'预设路线案例 · '+c.distance};}),
      events: web.events.map(function (item, index) {
        var coords = item.coords.split(',').map(Number);
        return Object.assign({}, clone(detail), item, {
          lon: coords[0], lat: coords[1], reporter: '演示用户' + (index + 1),
          description: index === 0 ? detail.description : '用于作品展示的样例记录，可在当前浏览器中审核或删除。',
          priority: index === 0 ? '高' : '中', photoUrl: '', localDemo: true,
          canDelete: true, reportTime: '2026-' + item.time,
          canAudit: item.status === '待审核', canUpdate: item.status === '处理中'
        });
      })
    };
  }
  function openDatabase() {
    return new Promise(function (resolve) {
      if (!window.indexedDB) { memoryOnly = true; resolve(null); return; }
      var request;
      try { request = indexedDB.open(dbName, 1); } catch (_) { memoryOnly = true; resolve(null); return; }
      request.onupgradeneeded = function () { request.result.createObjectStore('state'); request.result.createObjectStore('photos'); };
      request.onsuccess = function () { resolve(request.result); };
      request.onerror = request.onblocked = function () { memoryOnly = true; resolve(null); };
    });
  }
  function reloadState() {
    if (!database) return Promise.resolve();
    return new Promise(function (resolve) {
      var tx = database.transaction(['state', 'photos'], 'readonly');
      var req = tx.objectStore('state').get('current');
      req.onsuccess = function () { state = req.result || initialState(loaded); };
      var cursor = tx.objectStore('photos').openCursor();
      cursor.onsuccess = function () { var entry = cursor.result; if (!entry) return; if (!photos.has(entry.key)) photos.set(entry.key, URL.createObjectURL(entry.value)); entry.continue(); };
      tx.oncomplete = tx.onerror = function () { resolve(); };
    });
  }
  function save(photoId, photo) {
    if (!database) { memoryOnly = true; updateBanner(); return Promise.resolve(); }
    return new Promise(function (resolve) {
      var tx;
      try {
        tx = database.transaction(['state', 'photos'], 'readwrite');
        tx.objectStore('state').put(clone(state), 'current');
        if (photoId && photo) tx.objectStore('photos').put(photo, photoId);
      } catch (_) { memoryOnly = true; updateBanner(); resolve(); return; }
      tx.oncomplete = function () { if (channel) channel.postMessage('changed'); updateBanner(); resolve(); };
      tx.onerror = tx.onabort = function () { memoryOnly = true; if(database)database.close();database=null;updateBanner();resolve(); };
    });
  }
  var ready = filesPromise.then(function (files) {
    loaded = files; state = initialState(files);
    return openDatabase().then(function (db) { database = db; return reloadState(); });
  });
  function response(value, code) { return new Response(JSON.stringify(value), {status: code || 200, headers: {'Content-Type': 'application/json; charset=utf-8'}}); }
  function failure(message, status) { var error = new Error(message); error.status = status || 400; throw error; }
  function bodyOf(options) {
    var body = options.body;
    if (body instanceof FormData) return Object.fromEntries(body.entries());
    if (!body) return {};
    return typeof body === 'string' ? JSON.parse(body) : body;
  }
  function eventRow(item) { return Object.assign({}, item, {canAudit: item.status === '待审核', canUpdate: item.status === '处理中', canDelete: true}); }
  function history() { return state.events.map(function (e) { return Object.assign({}, eventRow(e), {eventId:e.id, date:e.time.slice(0,5), location:e.landmark || e.address || '福田区', desc:e.description, submittedAt:e.reportTime}); }); }
  function stats() {
    var result = clone(loaded[0].dashboard.stats);
    result[2].value = String(state.events.filter(function (e) { return ['待审核','处理中'].includes(e.status); }).length);
    result[2].change = '本机演示事件'; result[3].value = String(state.events.length); result[3].change = '当前浏览器中的样例与演示上报';
    return result;
  }
  function mapData() {
    var map = clone(loaded[0].dashboard.map);
    map.events = state.events.map(function (e, i) { return Object.assign({}, e, {top:110+i*25,left:90+i*50,title:e.type,type:e.type === '盲道被占' ? 'danger' : 'warning',location:e.landmark || e.address, time:e.time}); });
    return map;
  }
  function distribution() {
    var colors = ['#ff4560','#ff8c00','#00d4ff'];
    var types = ['盲道被占','盲道损坏','盲道缺失'];
    var total = state.events.length;
    return {total:total,segments:types.map(function(type,i){var count=state.events.filter(function(e){return e.type===type;}).length;return {type:type,label:type,name:type,value:count,count:count,percent:(total?Math.round(count/total*100):0)+'%',color:colors[i]};})};
  }
  function caseFor(body) {
    var name = String(body.destination || '');
    var reverse = false;
    var found = loaded[4].find(function (c) { return c.caseId === body.caseId || name.includes(c.destination.replace('地铁站F口','')) || (name.includes('市民中心') && c.caseId === 'civic') || (name.includes('莲花山') && c.caseId === 'park'); });
    if (!found && body.destination && typeof body.destination === 'object') {
      found = loaded[4].find(function (c) { return Math.hypot(c.destinationLocation.lon-body.destination.lon,c.destinationLocation.lat-body.destination.lat)<.0001; });
      if(!found&&body.origin){found=loaded[4].find(function(c){return Math.hypot(c.originLocation.lon-body.destination.lon,c.originLocation.lat-body.destination.lat)<.0001&&Math.hypot(c.destinationLocation.lon-body.origin.lon,c.destinationLocation.lat-body.origin.lat)<.0001;});reverse=Boolean(found);}
    }
    if (!found) failure('在线演示提供市民中心、莲花山公园、会展中心三个预设路线案例，请选择案例目的地。',422);
    var result=clone(found);
    if(reverse){result.route.reverse();result.routeOptions.forEach(function(option){option.route.reverse();});var old=result.originLocation;result.originLocation=result.destinationLocation;result.destinationLocation=old;var oldName=result.origin;result.origin=result.destination;result.destination=oldName;result.instructions=['反向预设案例：从'+result.origin+'出发','沿地图案例路线查看道路与设施','到达'+result.destination+'；非现场实时导航'];}
    return result;
  }
  function segmentDistance(lon, lat, line) {
    var best=Infinity, xscale=111320*Math.cos(lat*Math.PI/180);
    for(var i=1;i<line.length;i++){var a=line[i-1],b=line[i],ax=(a[0]-lon)*xscale,ay=(a[1]-lat)*111320,dx=(b[0]-a[0])*xscale,dy=(b[1]-a[1])*111320,t=Math.max(0,Math.min(1,-(ax*dx+ay*dy)/(dx*dx+dy*dy||1)));best=Math.min(best,Math.hypot(ax+t*dx,ay+t*dy));}
    return best;
  }
  function inside(point, ring) { var hit=false;for(var i=0,j=ring.length-1;i<ring.length;j=i++){var a=ring[i],b=ring[j];if((a[1]>point[1])!==(b[1]>point[1])&&point[0]<(b[0]-a[0])*(point[1]-a[1])/(b[1]-a[1])+a[0])hit=!hit;}return hit; }
  var buildingsPromise;
  function identifyBuilding(url) {
    if (!buildingsPromise) buildingsPromise=json('data/buildings.geojson');
    return buildingsPromise.then(function (fc) {
      var point=[Number(url.searchParams.get('longitude')),Number(url.searchParams.get('latitude'))];
      var feature=fc.features.find(function (f) {var polys=f.geometry.type==='Polygon'?[f.geometry.coordinates]:f.geometry.coordinates;return polys.some(function (p) {return inside(point,p[0])&&!p.slice(1).some(function (r) {return inside(point,r);});});});
      if(!feature)return {matched:false};
      var p=feature.properties,height=Number(p.height_m||12),id=p.building_id||p.osm_id||p.OBJECTID||feature.id;
      return {matched:true,matchType:'inside',building:{buildingId:String(id),name:p.name||'福田建筑',buildingClass:p.bldg_class,heightM:height,minHeightM:p.min_height_m||0,estimatedLevels:p.levels_est||Math.round(height/3.2),footprintAreaM2:p.footprint_area_m2,roofShape:p.roof_shape,source:p.source||'本地建筑数据',heightSource:p.height_source||'已有数据/估算'},highlight:{geometry:feature.geometry,buildingId:String(id),heightM:height,minHeightM:p.min_height_m||0},properties:p};
    });
  }
  async function api(url, options) {
    await ready;
    await reloadState();
    var path=url.pathname.slice(base.pathname.length-1),method=(options.method||'GET').toUpperCase(),body=bodyOf(options);
    if(path==='/api/web/dashboard/stats')return stats();
    if(path==='/api/web/map/config')return clone(loaded[0].mapConfig);
    if(path==='/api/web/map/data')return mapData();
    if(path==='/api/web/map/facilities')return loaded[2];
    if(path==='/api/web/map/building-semantics')return loaded[3];
    if(path==='/api/web/map/buildings/identify')return identifyBuilding(url);
    if(path==='/api/web/map/navigation/solve')return caseFor(body);
    if(path==='/api/web/events')return state.events.map(eventRow);
    if(path.startsWith('/api/web/events/')){
      var id=decodeURIComponent(path.split('/')[4]),e=state.events.find(function(x){return x.id===id;});if(!e)failure('演示事件不存在',404);
      if(method==='DELETE'){state.events=state.events.filter(function(x){return x.id!==id;});await save();return {deletedEventId:id};}
      if(path.endsWith('/status')){if(!['待审核','处理中','已修复','驳回'].includes(body.status))failure('无效演示状态');e.status=body.status;await save();}
      return eventRow(e);
    }
    if(path==='/api/web/charts/distribution')return distribution();
    if(path==='/api/web/charts/trend'){var trend=clone(loaded[0].chartPeriods[url.searchParams.get('period')||'month']);trend.source='演示历史趋势';return trend;}
    if(path==='/api/mobile/weather')return {weather:'深圳福田 · 在线演示（非实时天气）'};
    if(path==='/api/mobile/home'){var home=clone(loaded[1].home);home.favoriteRoutes=clone(state.favorites);return home;}
    if(path==='/api/mobile/navigation/status')return clone(loaded[1].navigation);
    if(path==='/api/mobile/navigation/plan'||path==='/api/mobile/navigation/reroute')return caseFor(body);
    if(path==='/api/mobile/bus/realtime')return clone(loaded[1].bus);
    if(path==='/api/mobile/report/history')return history();
    if(path==='/api/mobile/user/profile')return {defaultName:'演示体验者',city:'深圳福田',role:'演示用户',version:'Pages Demo',company:'本机演示数据'};
    if(path==='/api/mobile/user/settings'){if(method!=='GET'){state.settings=Object.assign({},state.settings,body);await save();}return state.settings;}
    if(path==='/api/mobile/user/routes'){if(method==='POST'){var r={id:Date.now(),icon:'⭐',name:body.name,dest:body.destination,destination:body.destination,detail:'本机保存的演示收藏'};state.favorites.push(r);await save();return r;}return clone(state.favorites);}
    if(path==='/api/mobile/perception')return clone(loaded[1].profile.perception);
    if(path==='/api/mobile/report/recognize'){var text=String(body.text||'');return {type:/坏|破|坑/.test(text)?'盲道损坏':/没有|缺失|断/.test(text)?'盲道缺失':'盲道被占',description:text,lon:Number(body.lon)||114.055,lat:Number(body.lat)||22.535,coords:'114.055, 22.535',landmark:'福田演示位置'};}
    if(path==='/api/mobile/report'&&method==='POST'){
      if(!String(body.description||'').trim())failure('请填写演示描述');
      var now=new Date(),id='DEMO-'+Date.now()+'-'+(++state.sequence),photoId='',photo=body.photo;
      if(photo instanceof Blob&&photo.size){if(photo.size>5*1024*1024)failure('演示图片请小于5MB');if(!['image/jpeg','image/png','image/webp'].includes(photo.type))failure('仅支持JPG、PNG、WebP');photoId='/uploads/'+id;photos.set(photoId,URL.createObjectURL(photo));}
      var item={id:id,type:['盲道被占','盲道损坏','盲道缺失'].includes(body.type)?body.type:'盲道被占',description:String(body.description).slice(0,2000),lon:Number(body.lon)||114.055,lat:Number(body.lat)||22.535,coords:(Number(body.lon)||114.055).toFixed(4)+','+(Number(body.lat)||22.535).toFixed(4),district:'福田区',address:String(body.address||'演示地点'),landmark:String(body.landmark||body.address||'演示地点'),priority:'中',reporter:'演示体验者',reporterType:'演示用户',status:'待审核',sla:'本机演示审核流程',time:now.toISOString().slice(5,16).replace('T',' '),reportTime:now.toLocaleString('zh-CN',{hour12:false}),reportMethod:'浏览器本地演示',photoUrl:photoId,canAudit:true,canUpdate:false,canDelete:true,localDemo:true};
      state.events.unshift(item);await save(photoId,photo);return Object.assign({},item,{eventId:id,submittedAt:item.reportTime,location:item.address});
    }
    if(path.startsWith('/api/mobile/report/')&&method==='DELETE'){var eventId=decodeURIComponent(path.split('/').pop());state.events=state.events.filter(function(e){return e.id!==eventId;});await save();return {deletedEventId:eventId};}
    failure('该功能未纳入静态演示：'+path,404);
  }
  window.fetch=function(input,options){var url=new URL(typeof input==='string'?input:(input.href||input.url),document.baseURI);if(url.origin===base.origin&&url.pathname.startsWith(base.pathname+'api/'))return api(url,options||{}).then(function(v){return response(v);}).catch(function(e){return response({detail:e.message},e.status||500);});return originalFetch(input,options);};
  function updateBanner(){var el=document.getElementById('demoStorageStatus');if(el)el.textContent=memoryOnly?'仅本次会话 · 未持久保存':'数据仅保存在此浏览器';}
  function reset(){if(!confirm('恢复此项目的初始演示数据？只清除本项目的演示记录。'))return;ready.then(function(){state=initialState(loaded);photos.forEach(function(url){URL.revokeObjectURL(url);});photos.clear();try{Object.keys(localStorage).filter(function(k){return k.startsWith(prefix);}).forEach(function(k){localStorage.removeItem(k);});}catch(_){}if(database){var tx=database.transaction(['state','photos'],'readwrite');tx.objectStore('state').clear();tx.objectStore('photos').clear();tx.oncomplete=function(){if(channel)channel.postMessage('changed');location.reload();};}else location.reload();});}
  function banner(){var el=document.createElement('div');el.className='demo-banner';el.innerHTML='<a href="./index.html">盲行 · 在线演示</a><span id="demoStorageStatus">数据仅保存在此浏览器</span><a href="https://github.com/ichangli/blind-navigation" target="_blank" rel="noopener">完整源码 ↗</a><button type="button" id="demoResetButton">重置演示</button>';document.body.prepend(el);document.getElementById('demoResetButton').onclick=reset;updateBanner();}
  document.addEventListener('DOMContentLoaded',banner);
  if(channel)channel.onmessage=function(){reloadState().then(function(){window.dispatchEvent(new Event('demo-data-changed'));});};
  window.BlindDemo={ready:ready,base:base,apiBase:base.pathname.replace(/\/$/,''),json:json,reset:reset,photoURL:function(id){return photos.get(id)||'';},get cases(){return loaded?clone(loaded[4]):[];},get facilities(){return loaded?loaded[2]:null;},segmentDistance:segmentDistance};
}());
