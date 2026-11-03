(function(){
  'use strict';
  var D=window.BlindDemo;
  window.getCoords=function(){return {lon:114.055,lat:22.535};};
  window.wgs84ToGcj02=function(lon,lat){return {lon:lon,lat:lat};};
  window.resolveMobileReportPhotoUrl=function(id){return D.photoURL(id);};
  window.doLogout=function(){location.href='./index.html';};
  window.useCurrentLocationAsOrigin=function(){applyFutianDemoOrigin(null,'静态演示使用固定案例起点');};
  window.startLiveNavigation=function(){if(!window._activeNavPlan)return mToast('请先选择路线案例');activateNavigationStep(0);setNavigationStage('ready','预设路线演示 · 不进行实时定位导航');mToast('正在播报路线案例，非实时导航');};
  window.requestAutomaticReroute=function(){mToast('静态演示不提供实时重规划，请选择预设路线案例');};
  window.openFacilityMapInfo=function(map,f){L.popup().setLatLng([f.lat,f.lon]).setContent(String(f.name||'设施')).openOn(map);};
  var contextPromise;
  function context(map){
    if(map._demoContextReady)return Promise.resolve();
    if(!contextPromise)contextPromise=Promise.all(['parks.geojson','water.geojson','roads.geojson'].map(function(file){return D.json('data/'+file);}));
    return contextPromise.then(function(files){files.forEach(function(fc,i){L.geoJSON(fc,{pane:BlindShowcaseRoads.contextPane(map),interactive:false,style:{color:i===2?'#7a9fb2':'#c5e4e3',weight:i===2?1.2:0,fillColor:i===0?'#d3e9dd':'#b9dce7',fillOpacity:.8}}).addTo(map);});BlindShowcaseRoads.addLeaflet(map,D.showcaseRoads);map._demoContextReady=true;});
  }
  window.drawNavigationMap=function(plan){
    window._activeNavPlan=plan;window._activeNavPath=(plan.route||[]).map(function(p){return[p.lon,p.lat];});
    var placeholder=document.getElementById('navMapPlaceholder');if(placeholder)placeholder.hidden=true;
    var container=document.getElementById('amapNavMap');container.classList.add('map-ready');
    if(!window._demoMobileMap){window._demoMobileMap=L.map(container,{zoomControl:true}).setView([22.54,114.055],15);window._demoMobileMap.attributionControl.addAttribution('© OpenStreetMap contributors · 预设案例');}
    var map=window._demoMobileMap;
    if(window._demoMobileRoutes)map.removeLayer(window._demoMobileRoutes);
    window._demoMobileRoutes=L.layerGroup().addTo(map);
    var group=window._demoMobileRoutes;
    return context(map).then(function(){
      var options=plan.routeOptions&&plan.routeOptions.length?plan.routeOptions:[plan];
      options.forEach(function(option){var active=option.provider===plan.provider;L.polyline(option.route.map(function(p){return[p.lat,p.lon];}),{color:option.provider==='demo-safe-route'?'#1a9d75':'#4886d9',weight:active?6:3,opacity:active?.96:.45}).addTo(group);});
      var route=plan.route.map(function(p){return[p.lat,p.lon];});
      L.circleMarker(route[0],{radius:7,color:'#167d55',fillOpacity:1}).bindPopup('案例起点').addTo(group);
      L.circleMarker(route[route.length-1],{radius:7,color:'#d44c61',fillOpacity:1}).bindPopup(plan.destination).addTo(group);
      map.invalidateSize();map.fitBounds(L.latLngBounds(route),{padding:[25,25]});
      window._navMap={setZoomAndCenter:function(z,c){map.setView([c[1],c[0]],z);},clearMap:function(){group.clearLayers();},destroy:function(){map.remove();window._demoMobileMap=null;window._demoMobileRoutes=null;},add:function(){}};
    });
  };
  window.addEventListener('demo-data-changed',function(){if(typeof loadMobileData==='function')loadMobileData().then(function(){renderReportFromJSON();renderProfileFromJSON();});});
  window.addEventListener('load',function(){D.ready.then(function(){
    var input=document.getElementById('homeDestinationInput');if(input)input.placeholder='选择案例：市民中心 / 莲花山 / 会展中心';
    ['homeOriginInput','navOriginInput'].forEach(function(id){var el=document.getElementById(id);if(el){el.readOnly=true;el.value='购物公园演示点';}});
    document.querySelectorAll('.location-origin-btn').forEach(function(b){b.textContent='◎ 演示起点';});
    var start=document.getElementById('navStartBtn');if(start)start.textContent='播报案例';
    var title=document.querySelector('.home-sub');if(title)title.textContent='深圳福田 · 在线演示（非实时天气）';
  });});
}());
