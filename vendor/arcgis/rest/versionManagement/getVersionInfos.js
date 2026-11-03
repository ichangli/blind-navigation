/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../request","../utils"],(function(e,n,t){"use strict";async function o(e,o,r){const s=t.parseUrl(e),i=o.toJSON(),a=t.asValidOptions(s.query,{query:t.encode({...i,f:"json"}),...r}),u=`${s.path}/versionInfos`,{data:d}=await n(u,a);return d.versions.map((e=>{const{versionName:n,versionGuid:t,...o}=e;return{...o,versionIdentifier:{name:n,guid:t}}}))}e.getVersionInfos=o,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
