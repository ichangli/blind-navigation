/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../request","../../core/urlUtils","../../geometry/support/jsonUtils","../../geometry/support/spatialReferenceUtils","./utils"],(function(e,t,r,s,o,i){"use strict";async function n(e,n,u){const l="string"==typeof e?r.urlToObject(e):e,a=n[0].spatialReference,p=s.getJsonType(n[0]),c={...u,query:{...l.query,f:"json",sr:o.srToRESTValue(a),geometries:JSON.stringify(i.encodeGeometries(n))}},{data:y}=await t(l.path+"/simplify",c);return i.decodeGeometries(y.geometries,p,a)}e.simplify=n,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
