/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../request","../../core/Error","../utils","./gdbVersion/serverVersionUtils"],(function(e,r,s,t,o){"use strict";const i=new Map;async function n(e,n,a){i.has(e)||await o.addServerVersion(i,e);const d=i.get(e);if((d?.serverVersion??0)<=11.1)throw new s("deleteVersion:enterprise-version","versioning API requires ArcGIS Enterprise version 11.2 or higher");const c=t.parseUrl(e),u=n.toJSON(),l=t.asValidOptions(c.query,{query:t.encode({...u,f:"json"}),...a,authMode:"immediate",method:"post"}),p=`${c.path}/delete`,{data:h}=await r(p,l);return h.success}e.deleteVersion=n,e.serverVersionCacheMap=i,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
