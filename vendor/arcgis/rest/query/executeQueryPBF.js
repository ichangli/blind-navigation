/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../utils","./operations/pbfJSONFeatureSet","./operations/query","../support/FeatureSet","../support/Query"],(function(e,t,r,a,u,n){"use strict";async function o(e,t,r){const a=await s(e,n.from(t),r);return u.fromJSON(a)}async function s(e,u,o){const s=t.parseUrl(e),c={...o},i=n.from(u),p=!i.quantizationParameters,{data:f}=await a.executeQueryPBF(s,i,new r.JSONFeatureSetParserContext({sourceSpatialReference:i.sourceSpatialReference,applyTransform:p}),c);return f}e.executeQueryPBF=o,e.executeRawQueryPBF=s,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
