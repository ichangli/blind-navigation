/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../utils","./operations/query","../support/Query"],(function(e,t,r,o){"use strict";async function u(e,u,s){const n=t.parseUrl(e),{data:a}=await r.executeQueryForIds(n,o.from(u),s);return a.objectIds}e.executeForIds=u,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
