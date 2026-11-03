/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../utils","./operations/query","../support/Query"],(function(e,t,o,r){"use strict";async function u(e,u,n){const a=t.parseUrl(e),{data:c}=await o.executeQueryForCount(a,r.from(u),n);return c.count}e.executeForCount=u,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
