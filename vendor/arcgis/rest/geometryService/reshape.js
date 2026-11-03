/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../request","../../geometry/support/jsonUtils","../../geometry/support/spatialReferenceUtils","../utils"],(function(e,t,r,s,o){"use strict";async function a(e,a,n,i){const p=a.spatialReference,y=o.parseUrl(e),l={...y.query,f:"json",sr:s.srToRESTValue(p),target:JSON.stringify({geometryType:r.getJsonType(a),geometry:a.toJSON()}),reshaper:JSON.stringify(n.toJSON())},u=o.asValidOptions(l,i);return t(y.path+"/reshape",u).then((({data:e})=>r.fromJSON(e.geometry).set({spatialReference:p})))}e.reshape=a,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
