/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../LayerList/support/layerListUtils"],(function(e,t){"use strict";const r=e=>s(e)||i(e),s=e=>{if(!("type"in e))return!1;switch(e.type){case"feature":case"geojson":case"csv":case"graphics":case"wfs":case"map-notes":case"oriented-imagery":case"scene":case"building-scene":case"subtype-sublayer":return!0;default:return!1}},i=e=>{const s=t.getNormalizedChildLayerProperty(e);if(null!=s&&e.hasOwnProperty(s)&&null!=e[s])for(const t of e[s])if(r(t))return!0;return!1},a=(e,t)=>null!=t&&null!=e&&(t.test(e.title)?"self":!!e.children.some((e=>!1!==a(e,t)))&&"children");e.isValidSnappingLayer=r,e.isValidSnappingLayerGroup=i,e.isValidSnappingLayerSource=s,e.itemTitleMatchesFilter=a,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
