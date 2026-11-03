/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../request","../utils","./support/QueryNamedTraceConfigurationsResult"],(function(t,e,s,a){"use strict";async function r(t,r,n){const o=s.parseUrl(t),i=r.toJSON();r.globalIds&&r.globalIds.length>0&&(i.globalIds=JSON.stringify(r.globalIds)),r.creators&&r.creators.length>0&&(i.creators=JSON.stringify(r.creators)),r.tags&&r.tags.length>0&&(i.tags=JSON.stringify(r.tags)),r.names&&r.names.length>0&&(i.names=JSON.stringify(r.names));const g={...i,f:"json"},l=s.encode({...o.query,...g}),u=s.asValidOptions(l,{...n,method:"post"}),c=`${o.path}/traceConfigurations/query`,{data:d}=await e(c,u);return a.fromJSON(d)}t.queryNamedTraceConfigurations=r,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
