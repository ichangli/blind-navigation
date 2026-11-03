/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../geometry","../../request","../../geometry/support/spatialReferenceUtils","../utils","./utils","../../geometry/Polygon"],(function(e,t,o,s,r,i,n){"use strict";async function a(e,t,a,l){const p=t[0].spatialReference,g=r.parseUrl(e),u={...g.query,f:"json",sr:s.srToRESTValue(p),polygons:JSON.stringify(i.encodeGeometries(t).geometries),polylines:JSON.stringify(i.encodeGeometries(a).geometries)},m=r.asValidOptions(u,l);return o(g.path+"/autoComplete",m).then((({data:e})=>(e.geometries||[]).map((({rings:e})=>new n({spatialReference:p,rings:e})))))}e.autoComplete=a,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
