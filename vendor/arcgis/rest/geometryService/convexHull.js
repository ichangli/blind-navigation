/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../request","../../geometry/support/jsonUtils","../utils","./utils"],(function(e,t,s,r,n){"use strict";async function o(e,o,i){const l=o[0].spatialReference,a=r.parseUrl(e),u={...a.query,f:"json",sr:JSON.stringify(l.toJSON()),geometries:JSON.stringify(n.encodeGeometries(o))},c=r.asValidOptions(u,i);return t(a.path+"/convexHull",c).then((({data:e})=>s.fromJSON(e.geometry).set({spatialReference:l})))}e.convexHull=o,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
