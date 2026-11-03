/* Standalone display roads, using the original showcase data and stroke fields. */
(function(root){
  'use strict';
  var classes=['secondary','primary','expressway'];
  var strokes=['glow','casing','core'];
  function styles(fc){
    var result={};
    fc.features.forEach(function(f){result[f.properties.road_class]=f.properties;});
    return result;
  }
  function rgba(hex,alpha){return [parseInt(hex.slice(1,3),16),parseInt(hex.slice(3,5),16),parseInt(hex.slice(5,7),16),alpha/100];}
  function createArcGISLayers(m,fc,url){
    var policy=styles(fc),layers=[];
    classes.forEach(function(kind){strokes.forEach(function(stroke){
      var p=policy[kind];
      layers.push(new m.GeoJSONLayer({id:'showcase-'+kind+'-'+stroke,title:'展示主干路 · '+kind+' · '+stroke,url:url,definitionExpression:"road_class = '"+kind+"'",minScale:p.min_scale,popupEnabled:false,legendEnabled:false,elevationInfo:{mode:'on-the-ground'},renderer:{type:'simple',symbol:{type:'simple-line',color:rgba(p[stroke+'_color'],p[stroke+'_alpha']),width:p[stroke+'_width'],cap:'round',join:'round'}}}));
    });});
    return layers;
  }
  function contextPane(map){
    if(!map.getPane('demo-context'))map.createPane('demo-context').style.zIndex=300;
    return 'demo-context';
  }
  function addLeaflet(map,fc){
    if(!map.getPane('demo-showcase-roads'))map.createPane('demo-showcase-roads').style.zIndex=350;
    var policy=styles(fc),groups=[];
    classes.forEach(function(kind){
      var p=policy[kind],subset={type:'FeatureCollection',features:fc.features.filter(function(f){return f.properties.road_class===kind;})};
      var group=root.L.layerGroup();
      strokes.forEach(function(stroke){root.L.geoJSON(subset,{pane:'demo-showcase-roads',interactive:false,style:{color:p[stroke+'_color'],opacity:p[stroke+'_alpha']/100,weight:p[stroke+'_width']*4/3,lineCap:'round',lineJoin:'round'}}).addTo(group);});
      groups.push({layer:group,minScale:p.min_scale});
    });
    function update(){
      var scale=156543.03392*Math.cos(map.getCenter().lat*Math.PI/180)/Math.pow(2,map.getZoom())*96/.0254;
      groups.forEach(function(g){var visible=!g.minScale||scale<=g.minScale;if(visible&&!map.hasLayer(g.layer))g.layer.addTo(map);else if(!visible&&map.hasLayer(g.layer))map.removeLayer(g.layer);});
    }
    map.on('zoomend',update);update();
    return groups;
  }
  root.BlindShowcaseRoads={createArcGISLayers:createArcGISLayers,contextPane:contextPane,addLeaflet:addLeaflet};
})(typeof window!=='undefined'?window:globalThis);
