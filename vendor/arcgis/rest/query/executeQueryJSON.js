/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../utils","./operations/query","../support/FeatureSet","../support/Query"],(function(e,t,r,u,n){"use strict";async function o(e,t,r){const n=await a(e,t,r);return u.fromJSON(n)}async function a(e,u,o){const a=t.parseUrl(e),c={...o},s=n.from(u),{data:i}=await r.executeQuery(a,s,s.sourceSpatialReference,c);return i}e.executeQueryJSON=o,e.executeRawQueryJSON=a,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
