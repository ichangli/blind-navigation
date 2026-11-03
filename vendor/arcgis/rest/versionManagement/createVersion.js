/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../request","../utils"],(function(e,t,i){"use strict";async function n(e,n,o){const r=i.parseUrl(e),a=n.toJSON(),s=i.asValidOptions(r.query,{query:i.encode({...a,f:"json"}),...o,authMode:"immediate",method:"post"}),u=`${r.path}/create`,{data:d}=await t(u,s),{versionName:c,versionGuid:f,...l}=d.versionInfo;return{...l,versionIdentifier:{name:c,guid:f}}}e.createVersion=n,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
