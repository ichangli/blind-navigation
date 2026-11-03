/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../request","../../geometry/support/jsonUtils","../utils"],(function(e,t,s,n){"use strict";async function r(e,r,o){const i=r.geometries?.[0].spatialReference,a=n.parseUrl(e),f={...a.query,f:"json",...r.toJSON()},p=n.asValidOptions(f,o);return t(a.path+"/densify",p).then((({data:e})=>(e.geometries||[]).map((e=>s.fromJSON(e).set({spatialReference:i})))))}e.densify=r,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
