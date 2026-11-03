/* Local-data map integrations for the static demo; no GIS service endpoints. */
(function () {
  'use strict';
  var D=window.BlindDemo;
  // Pages may need longer than the original local-server timeout on a cold load.
  MAP_SDK_LOAD_TIMEOUT_MS=120000;
  ['loadStyleOnce','loadScriptOnce'].forEach(function(name){
    var original=window[name];
    window[name]=function(id,url){
      function attempt(count){
        return original(id,url).catch(function(){
          var node=document.getElementById(id);if(node)node.remove();
          if(count<2)return new Promise(function(resolve){setTimeout(resolve,1000*(count+1));}).then(function(){return attempt(count+1);});
          var error=new Error((name==='loadStyleOnce'?'三维样式':'三维脚本')+'加载失败（已重试）：'+url);window._demo3DError=error.message;throw error;
        });
      }
      return attempt(0).then(function(){
        if(id==='geoscene-arcgis-js')return window.loadScriptOnce('demo-arcgis-modules',new URL('vendor/arcgis/__ARCGIS_MODULE_BUNDLE__',D.base).href);
      });
    };
  });
  function data(name){return new URL('data/'+name,D.base).href;}
  var assetsURL=new URL('vendor/arcgis/esri/assets/',D.base).href;
  var workerSettings={loaderUrl:new URL('vendor/arcgis/__ARCGIS_WORKER_INIT__',D.base).href,workerPath:new URL('vendor/arcgis/worker-client.js',D.base).href,loaderConfig:{baseUrl:new URL('vendor/arcgis/',D.base).href,packages:[{name:'esri',location:new URL('vendor/arcgis/esri/',D.base).href}],has:{'host-webworker':1,'host-browser':0,dom:0}}};
  // Apply before AMD modules execute; the npm assets omit the CDN worker init.
  window.esriConfig=Object.assign({},window.esriConfig,{assetsPath:assetsURL,workers:workerSettings});
  var originalModules=window.loadGeoSceneModules;
  window.loadGeoSceneModules=function(){return originalModules().then(function(m){m.config.assetsPath=assetsURL;m.config.workers=Object.assign({},m.config.workers,workerSettings);return m;}).catch(function(error){window._demo3DError=error.message;throw error;});};
  // A slow SDK can finish after the 2D map has appeared. Allow that upgrade.
  window.recoverGeoSceneAfterLateSdk=function(modules){
    if(!modules||!window._geoSceneFailed||window._geoSceneLateRetryStarted||window._geoSceneView)return;
    window._geoSceneLateRetryStarted=true;
    if(window._demoLeafletMap){window._demoLeafletMap.remove();window._demoLeafletMap=null;document.getElementById('demoLeafletFallback')?.remove();document.getElementById('mapBg')?.classList.remove('demo-map-2d');}
    window._geoSceneModulesPromise=Promise.resolve(modules);window._geoSceneFailed=false;window._geoSceneAbandoned=false;
    initGeoSceneMap().then(function(ready){if(!ready)initTiles3DMap();});
  };
  window.probeGeoSceneVectorBasemap=function(){return Promise.resolve(false);};
  window.probeTiandituBasemap=function(){return Promise.resolve(false);};
  window.createGeoSceneBasemap=function(m){
    window._geoSceneBasemapName='本地福田深蓝底图';
    function layer(file,title,color,line){return new m.GeoJSONLayer({url:data(file),title:title,popupEnabled:false,legendEnabled:false,renderer:{type:'simple',symbol:line?{type:'simple-line',color:color,width:1.1}:{type:'simple-fill',color:color,outline:{color:color,width:0}}}});}
    return new m.Basemap({title:'福田本地底图',id:'local-futian',baseLayers:[layer('context.geojson','背景','#0b233a'),layer('parks.geojson','绿地','#123d40'),layer('water.geojson','水域','#0d4862'),layer('roads.geojson','城市道路','#245471',true)].concat(BlindShowcaseRoads.createArcGISLayers(m,D.showcaseRoads,data('showcase_roads.geojson')))});
  };
  window.createGeoSceneRoadLayerV4=function(m){
    var group=new m.GroupLayer({title:'本地道路网络',visible:false,layers:[]});
    // Do not construct the 18 MiB GeoJSON layer until explicitly requested.
    function ensureRoads(visible){
      if(!visible||window._demoRoadLayer)return;
      var line=new m.GeoJSONLayer({url:data('network-display.geojson'),title:'福田无障碍路网（已有数据）',outFields:['*'],popupEnabled:false,minScale:45000,renderer:getRoadUnifiedRenderer(),elevationInfo:{mode:'on-the-ground'}});
      window._geoSceneRoadThemeLayers={base:line};window._geoSceneRoadLodBand='local';window._demoRoadLayer=line;
      group.add(line);
      window.syncGeoSceneRoadLod(window._geoSceneView?window._geoSceneView.scale:52000);
      window.applyRoadThemeV4(window._demoRoadTheme||'overview');
      line.when().catch(function(){toast('道路网络加载失败，请刷新后重试');});
    }
    group.watch('visible',ensureRoads);
    return group;
  };
  window.syncGeoSceneRoadLod=function(scale){var layer=window._demoRoadLayer;if(!layer)return;var state=window.BlindRoadVisuals.getRoadLodState(scale);layer.definitionExpression=state.definitionExpression;window._geoSceneRoadLodBand=state.band;updateRoadModeLabelV4();};
  window.applyRoadThemeV4=function(theme){
    window._demoRoadTheme=theme;
    var layer=window._demoRoadLayer;if(!layer)return;
    var thematic=theme==='accessible';
    layer.renderer=thematic?{type:'unique-value',valueExpression:"When($feature.prohibited == 1 || $feature.avoid_steps == 1, 'blocked', $feature.unknown_access == 1, 'unknown', $feature.risk_score >= 3, 'caution', 'safe')",defaultSymbol:roadLineSymbol('#7fa0b3',1.8),uniqueValueInfos:[{value:'safe',symbol:roadLineSymbol('#2ecc91',3)},{value:'caution',symbol:roadLineSymbol('#f4ac42',3)},{value:'unknown',symbol:roadLineSymbol('#748ca0',2,'short-dash')},{value:'blocked',symbol:roadLineSymbol('#ff6178',3.5)}]}:getRoadUnifiedRenderer();
    var legend=document.getElementById('roadThemeLegend');if(legend)legend.classList.toggle('active',thematic);
    updateRoadModeLabelV4();
  };
  window.identifyRoadAtMapPoint=function(view,event){if(!window._demoRoadLayer)return Promise.resolve(null);return view.hitTest(event,{include:[window._demoRoadLayer]}).then(function(r){var item=r.results.find(function(x){return x.graphic&&x.graphic.layer===window._demoRoadLayer;});return item?item.graphic:null;});};
  var waterRenderer=window.BlindWaterVisuals.getWaterRenderer;
  window.BlindWaterVisuals={createWaterLayer:function(){var m=window._geoSceneModules;return new m.GeoJSONLayer({url:data('showcase_water.geojson'),title:'福田本地水域',renderer:waterRenderer(),elevationInfo:{mode:'on-the-ground'},popupEnabled:false,legendEnabled:false});}};
  window.resolveWebReportPhotoUrl=function(id){return D.photoURL(id);};
  window.doLogout=function(){location.href='./index.html';};
  window.getGeoSceneStatusText=function(){return '本地三维地图 · 8,897 栋建筑 · 在线演示';};

  // A real 2D local-data map remains usable if WebGL or the 3D SDK cannot start.
  window.initTiles3DMap=function(){
    if(window._demoLeafletMap)return Promise.resolve(true);
    var parent=document.getElementById('mapBg');if(!parent)return Promise.resolve(false);
    var container=document.createElement('div');container.id='demoLeafletFallback';parent.appendChild(container);
    var map=L.map(container,{attributionControl:true}).setView([22.541,114.055],14);
    window._demoLeafletMap=map;
    map.attributionControl.addAttribution('© OpenStreetMap contributors · 本地数据演示');
    return Promise.all(['parks.geojson','water.geojson','roads.geojson'].map(function(file){return D.json('data/'+file).then(function(fc){L.geoJSON(fc,{pane:BlindShowcaseRoads.contextPane(map),style:{color:file==='roads.geojson'?'#4f89a6':'#176077',weight:1.2,fillColor:file==='parks.geojson'?'#164e48':'#13516c',fillOpacity:.85}}).addTo(map);});})).then(function(){
      BlindShowcaseRoads.addLeaflet(map,D.showcaseRoads);
      parent.classList.add('demo-map-2d');var status=document.getElementById('sceneStatus');if(status){status.textContent='二维本地地图 · 三维初始化未完成';status.title=window._demo3DError||status.title||'请查看控制台中的三维资源加载或 WebGL 错误';}
      (D.facilities.features||[]).filter(function(_,i){return i%6===0;}).forEach(function(f){L.circleMarker([f.lat,f.lon],{radius:3,color:'#60e6d0',weight:1}).bindPopup(f.name).addTo(map);});
      setTimeout(function(){map.invalidateSize();},100);return true;
    });
  };
  function routeButtons(){
    var parent=document.getElementById('dashMap');if(!parent)return;
    var box=document.createElement('div');box.className='demo-case-toolbar';
    var label=document.createElement('span');label.textContent='预设路线案例';box.appendChild(label);
    D.cases.forEach(function(c){var button=document.createElement('button');button.textContent=c.destination;button.onclick=function(){D.showWebRoute(c.caseId);};box.appendChild(button);});
    parent.appendChild(box);
  }
  D.showWebRoute=function(id){
    var c=D.cases.find(function(item){return item.caseId===id;});if(!c)return;
    if(window._demoLeafletMap){if(window._demoExampleLine)window._demoLeafletMap.removeLayer(window._demoExampleLine);window._demoExampleLine=L.polyline(c.route.map(function(p){return[p.lat,p.lon];}),{color:'#ffe38a',weight:5}).addTo(window._demoLeafletMap);window._demoLeafletMap.fitBounds(window._demoExampleLine.getBounds(),{padding:[30,30]});toast('预设路线案例：'+c.destination+'，'+c.distance);return;}
    if(!window._geoSceneView)return toast('地图尚在加载，请稍后点击案例');
    var panel=document.getElementById('webNavigationPanel');if(panel)panel.hidden=false;WEB_NAVIGATION_STATE.active=true;
    WEB_NAVIGATION_STATE.origin=c.originLocation;WEB_NAVIGATION_STATE.destination=c.destinationLocation;
    WEB_NAVIGATION_STATE.stage='solving';renderWebNavigationMarkers();requestWebNavigationRoute(window._geoSceneView);
  };
  window.startWebNavigationTest=function(){toast('静态演示请选择地图下方的预设路线案例');};
  window.addEventListener('load',function(){D.ready.then(routeButtons);});
  window.addEventListener('demo-data-changed',function(){if(typeof refreshWebSnapshot==='function')refreshWebSnapshot();});
}());
