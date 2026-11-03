/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../request","../../../core/Error","../../utils","./serverVersionUtils","./support/PostResult"],(function(s,e,r,o,t,i){"use strict";const n=new Map;async function a(s,a,p,c){n.has(s)||await t.addServerVersion(n,s);const u=n.get(s);if((u?.serverVersion??0)<=11.1)throw new r("post:enterprise-version","versioning API requires ArcGIS Enterprise version 11.2 or higher");if(!a)throw new r("post:missing-guid","guid for version is missing");const d=o.parseUrl(s),f=p.toJSON();p.rows&&(f.rows=JSON.stringify(p.rows));const g=o.asValidOptions(d.query,{query:o.encode({...f,f:"json"}),...c,method:"post"});a.startsWith("{")&&(a=a.slice(1,-1));const v=`${d.path}/versions/${a}/post`,{data:w}=await e(v,g);return i.fromJSON(w)}s.post=a,s.serverVersionCacheMap=n,Object.defineProperty(s,Symbol.toStringTag,{value:"Module"})}));
