/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../core/typedArrayUtil"],(function(r,a){"use strict";function e(r,e=!1){return r<=a.nativeArrayMaxSize?e?new Array(r).fill(0):new Array(r):new Float32Array(r)}function t(r){return a.isArray(r)?r.length<a.nativeArrayMaxSize?r:new Float32Array(r):r.length<a.nativeArrayMaxSize?Array.from(r):r}function n(r){return(a.isArray(r)?r.length:r.byteLength/8)<=a.nativeArrayMaxSize?Array.from(r):new Float32Array(r)}function y(r,a,e){return Array.isArray(r)?r.slice(a,a+e):r.subarray(a,a+e)}r.compactFloatArray=t,r.floatArrayFrom=n,r.floatSubArray=y,r.newFloatArray=e,Object.defineProperty(r,Symbol.toStringTag,{value:"Module"})}));
