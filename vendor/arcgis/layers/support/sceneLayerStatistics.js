/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../request","../../core/Error","../../core/urlUtils"],(function(t,e,i,s){"use strict";async function n({fieldName:t,statisticsInfo:n,errorContext:a,fieldsIndex:o,path:r,customParameters:c,apiKey:l,signal:f}){if(null==n)throw new i(`${a}:no-cached-statistics`,"Cached statistics are not available for this layer");const d=o.get(t);if(null==d)throw new i(`${a}:field-unexisting`,`Field '${t}' does not exist on the layer`);const u=n.find((t=>t.name===d.name));if(null==u)throw new i(`${a}:no-cached-statistics`,"Cached statistics for this attribute are not available");const h=s.join(r,u.href),{data:y}=await e(h,{query:{f:"json",...c,token:l},responseType:"json",signal:f});return y}t.fetchStatistics=n,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
