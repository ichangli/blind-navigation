/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../request","../../../core/Error","../../utils","./serverVersionUtils"],(function(e,r,s,i,t){"use strict";const n=new Map;async function o(e,o,a,c){n.has(e)||await t.addServerVersion(n,e);const u=n.get(e);if((u?.serverVersion??0)<=11.1)throw new s("alterVersion:enterprise-version","versioning API requires ArcGIS Enterprise version 11.2 or higher");if(!o)throw new s("alterVersion:missing-guid","guid for version is missing");const d=i.parseUrl(e),l=a.toJSON(),h=i.asValidOptions(d.query,{query:i.encode({...l,f:"json"}),...c,authMode:"immediate",method:"post"});o.startsWith("{")&&(o=o.slice(1,-1));const p=`${d.path}/versions/${o}/alter`,{data:v}=await r(p,h);return!!v&&v.success}e.alterVersion=o,e.serverVersionCacheMap=n,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
