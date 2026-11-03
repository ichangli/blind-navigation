/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../request","../../geometry/support/jsonUtils","../utils","./utils"],(function(e,t,n,s,r){"use strict";async function i(e,i,o){const a=i[0].spatialReference,u=s.parseUrl(e),f={...u.query,f:"json",sr:JSON.stringify(a.toJSON()),geometries:JSON.stringify(r.encodeGeometries(i))},l=s.asValidOptions(f,o);return t(u.path+"/union",l).then((({data:e})=>n.fromJSON(e.geometry).set({spatialReference:a})))}e.union=i,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
