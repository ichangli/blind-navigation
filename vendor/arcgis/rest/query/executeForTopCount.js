/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../utils","./operations/queryTopFeatures","../support/TopFeaturesQuery"],(function(e,t,o,r){"use strict";async function u(e,u,n){const a=t.parseUrl(e);return(await o.executeQueryForTopCount(a,r.from(u),{...n})).data.count}e.executeForTopCount=u,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
