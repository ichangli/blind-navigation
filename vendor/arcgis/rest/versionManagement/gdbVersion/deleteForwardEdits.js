/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../request","../../../core/Error","../../utils"],(function(e,t,s,r){"use strict";async function i(e,i,o,n){if(!i)throw new s("post:missing-guid","guid for version is missing");const d=r.parseUrl(e),a=o.toJSON(),u=r.asValidOptions(d.query,{query:r.encode({...a,f:"json"}),...n,method:"post"});i.startsWith("{")&&(i=i.slice(1,-1));const c=`${d.path}/versions/${i}/deleteForwardEdits`,{data:l}=await t(c,u);return l}e.deleteForwardEdits=i,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
