/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../request","../../../core/Error","../../utils"],(function(s,t,i,e){"use strict";async function o(s,o,n,r,d){if(!o)throw new i("stop-editing:missing-guid","guid for version is missing");const a=e.parseUrl(s),u=e.asValidOptions(a.query,{query:e.encode({sessionId:n,saveEdits:r,f:"json"}),...d,method:"post"});o.startsWith("{")&&(o=o.slice(1,-1));const c=`${a.path}/versions/${o}/stopEditing`,{data:g}=await t(c,u);return g||{success:!1}}s.stopEditing=o,Object.defineProperty(s,Symbol.toStringTag,{value:"Module"})}));
