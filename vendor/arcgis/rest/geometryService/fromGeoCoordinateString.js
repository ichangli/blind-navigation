/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../request","../../geometry/support/spatialReferenceUtils","../utils","./units"],(function(e,o,r,n,s){"use strict";async function t(e,t,i){const c={};null!=t.sr&&"object"==typeof t.sr?c.sr=r.srToRESTValue(t.sr):c.sr=t.sr,c.strings=JSON.stringify(t.strings);const a=t.conversionType||"mgrs";c.conversionType=s.conversionTypeKebabDict.toJSON(a),c.conversionMode=t.conversionMode;const u=n.parseUrl(e),p={...u.query,f:"json",...c},l=n.asValidOptions(p,i);return o(u.path+"/fromGeoCoordinateString",l).then((({data:e})=>e.coordinates))}e.fromGeoCoordinateString=t,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
