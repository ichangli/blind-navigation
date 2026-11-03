/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../request","../../../core/Error","../../utils"],(function(s,t,i,e){"use strict";async function r(s,r,n,o){if(!r)throw new i("start-editing:missing-guid","guid for version is missing");const a=e.parseUrl(s),d=e.asValidOptions(a.query,{query:e.encode({sessionId:n,f:"json"}),...o,method:"post"});r.startsWith("{")&&(r=r.slice(1,-1));const u=`${a.path}/versions/${r}/startEditing`,{data:c}=await t(u,d);return c||{success:!1}}s.startEditing=r,Object.defineProperty(s,Symbol.toStringTag,{value:"Module"})}));
