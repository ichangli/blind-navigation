/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../request","../../geometry/support/jsonUtils","../utils","./utils"],(function(e,t,r,s,i){"use strict";async function o(e,o,n,a){const y=o[0].spatialReference,g=s.parseUrl(e),p={...g.query,f:"json",sr:JSON.stringify(y.toJSON()),geometries:JSON.stringify(i.encodeGeometries(o)),geometry:JSON.stringify({geometryType:r.getJsonType(n),geometry:n.toJSON()})},c=s.asValidOptions(p,a);return t(g.path+"/intersect",c).then((({data:e})=>(e.geometries||[]).map((e=>r.fromJSON(e).set({spatialReference:y})))))}e.intersect=o,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
