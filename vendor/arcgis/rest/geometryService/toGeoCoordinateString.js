/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../request","../../geometry/support/spatialReferenceUtils","../utils","./units"],(function(e,o,n,t,s){"use strict";async function r(e,r,i){const a={};null!=r.sr&&"object"==typeof r.sr?a.sr=n.srToRESTValue(r.sr):a.sr=r.sr,a.coordinates=JSON.stringify(r.coordinates);const c=r.conversionType||"mgrs";a.conversionType=s.conversionTypeKebabDict.toJSON(c),a.conversionMode=r.conversionMode,a.numOfDigits=r.numOfDigits,a.rounding=r.rounding,a.addSpaces=r.addSpaces;const d=t.parseUrl(e),u={...d.query,f:"json",...a},p=t.asValidOptions(u,i);return o(d.path+"/toGeoCoordinateString",p).then((({data:e})=>e.strings))}e.toGeoCoordinateString=r,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
