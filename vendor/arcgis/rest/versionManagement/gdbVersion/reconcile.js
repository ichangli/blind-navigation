/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../request","../../../core/Error","../../utils","./serverVersionUtils","./support/ReconcileResult"],(function(e,r,s,i,o,n){"use strict";const t=new Map;async function c(e,c,a,u){t.has(e)||await o.addServerVersion(t,e);const l=t.get(e);if((l?.serverVersion??0)<=11.1)throw new s("reconcile:enterprise-version","versioning API requires ArcGIS Enterprise version 11.2 or higher");if(!c)throw new s("reconcile:missing-guid","guid for version is missing");const p=i.parseUrl(e),d=a.toJSON(),v=i.asValidOptions(p.query,{query:i.encode({...d,f:"json"}),...u,method:"post"});c.startsWith("{")&&(c=c.slice(1,-1));const f=`${p.path}/versions/${c}/reconcile`,{data:g}=await r(f,v);return n.fromJSON(g)}e.reconcile=c,e.serverVersionCacheMap=t,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
