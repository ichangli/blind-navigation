/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../utils","./operations/queryTopFeatures","../support/TopFeaturesQuery"],(function(e,t,o,r){"use strict";async function u(e,u,s){const a=t.parseUrl(e);return(await o.executeQueryForTopIds(a,r.from(u),{...s})).data.objectIds}e.executeForTopIds=u,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
