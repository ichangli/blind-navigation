/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../request","../../core/urlUtils","../utils"],(function(e,t,i,n){"use strict";async function s(e,s,r){const o=n.parseUrl(e),a=n.asValidOptions(o.query,{query:n.encode({f:"json"}),...r});s.startsWith("{")&&(s=s.slice(1,-1));const u=i.join(o.path,"versions",s),{data:c}=await t(u,a),{versionName:d,versionGuid:l,...f}=c;return{...f,versionIdentifier:{name:d,guid:l}}}e.getVersion=s,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
