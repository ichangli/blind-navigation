/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../request","../../../core/Error","../../utils"],(function(s,e,t,i){"use strict";async function o(s,o,n,r){if(!o)throw new t("stop-reading:missing-guid","guid for version is missing");const a=i.parseUrl(s),d=i.asValidOptions(a.query,{query:i.encode({sessionId:n,f:"json"}),...r,method:"post"});o.startsWith("{")&&(o=o.slice(1,-1));const u=`${a.path}/versions/${o}/stopReading`,{data:c}=await e(u,d);return c||{success:!1}}s.stopReading=o,Object.defineProperty(s,Symbol.toStringTag,{value:"Module"})}));
