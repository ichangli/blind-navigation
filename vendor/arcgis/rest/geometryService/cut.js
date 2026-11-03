/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../geometry","../../request","../../geometry/support/jsonUtils","../../geometry/support/spatialReferenceUtils","../utils"],(function(e,t,r,s,o,n){"use strict";async function i(e,t,i,u){const a=n.parseUrl(e),p=t[0].spatialReference,c={...u,responseType:"json",query:{...a.query,f:"json",sr:o.srToRESTValue(p),target:JSON.stringify({geometryType:s.getJsonType(t[0]),geometries:t}),cutter:JSON.stringify(i)}},y=await r(a.path+"/cut",c),{cutIndexes:g,geometries:f=[]}=y.data;return{cutIndexes:g,geometries:f.map((e=>{const t=s.fromJSON(e);return t.spatialReference=p,t}))}}e.cut=i,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
