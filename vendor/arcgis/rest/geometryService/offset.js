/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../request","../../geometry/support/jsonUtils","../utils","../operations/offset","../support/OffsetParameters"],(function(e,t,s,o,r,a){"use strict";async function f(e,f,n){f=a.from(f);const i=r.offsetToRESTParameters(f),p=o.parseUrl(e),u={...p.query,f:"json",...i},l=f.geometries?.[0].spatialReference,m=o.asValidOptions(u,n);return t(p.path+"/offset",m).then((({data:e})=>(e.geometries||[]).map((e=>s.fromJSON(e).set({spatialReference:l})))))}e.offset=f,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
