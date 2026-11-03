/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../geometry","../../request","../utils","../../geometry/Polygon"],(function(e,t,r,n,o){"use strict";async function s(e,t,s){const a=n.parseUrl(e),i={...a.query,f:"json",...t.toJSON()},f=t.outSpatialReference||t.geometries[0].spatialReference,u=n.asValidOptions(i,s);return r(a.path+"/buffer",u).then((e=>(e.data.geometries||[]).map((({rings:e})=>new o({spatialReference:f,rings:e})))))}e.buffer=s,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
