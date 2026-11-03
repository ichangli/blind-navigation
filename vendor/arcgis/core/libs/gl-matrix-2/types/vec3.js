/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../typedArrayUtil"],(function(r,t){"use strict";function e(r){return t.isFloat32Array(r)&&r.length>=3}function n(r){return(t.isFloat64Array(r)||Array.isArray(r))&&r.length>=3}function i(r){return e(r)||n(r)}r.isVec3=i,Object.defineProperty(r,Symbol.toStringTag,{value:"Module"})}));
