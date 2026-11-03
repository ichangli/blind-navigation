/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../geometry","../../request","../utils","../operations/trimExtend","../support/TrimExtendParameters","../../geometry/Polyline"],(function(e,t,r,n,s,a,o){"use strict";async function i(e,t,i){t=a.from(t);const m=s.trimExtendToRESTParameters(t),p=n.parseUrl(e),d={...p.query,f:"json",...m},u=t.sr,l=n.asValidOptions(d,i);return r(p.path+"/trimExtend",l).then((({data:e})=>(e.geometries||[]).map((({paths:e})=>new o({spatialReference:u,paths:e})))))}e.trimExtend=i,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
