/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../request","../../geometry/support/jsonUtils","../utils","./utils"],(function(e,t,r,s,o){"use strict";async function i(e,i,n,f){const y=i[0].spatialReference,a=s.parseUrl(e);let g={query:{...a.query,f:"json",sr:JSON.stringify(y.toJSON()),geometries:JSON.stringify(o.encodeGeometries(i)),geometry:JSON.stringify({geometryType:r.getJsonType(n),geometry:n.toJSON()})}};return f&&(g={...f,...g}),t(a.path+"/difference",g).then((({data:e})=>(e.geometries||[]).map((e=>r.fromJSON(e).set({spatialReference:y})))))}e.difference=i,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
