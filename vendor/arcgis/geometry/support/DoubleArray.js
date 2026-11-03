/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../core/typedArrayUtil"],(function(r,e){"use strict";function t(r,t=!1){return r<=e.nativeArrayMaxSize?t?new Array(r).fill(0):new Array(r):new Float64Array(r)}function n(r){return(e.isArray(r)?r.length:r.byteLength/8)<=e.nativeArrayMaxSize?Array.from(r):new Float64Array(r)}function a(r,e,t){return Array.isArray(r)?r.slice(e,e+t):r.subarray(e,e+t)}function o(r,e){for(let t=0;t<e.length;++t)r[t]=e[t];return r}function y(r){return Array.isArray(r)?new Float64Array(r):r}r.copyInto=o,r.doubleArrayFrom=n,r.doubleSubArray=a,r.newDoubleArray=t,r.toFloat64Array=y,Object.defineProperty(r,Symbol.toStringTag,{value:"Module"})}));
