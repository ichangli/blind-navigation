/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../core/typedArrayUtil"],(function(r,e){"use strict";function n(r,n=!1){return r<=e.nativeArrayMaxSize?n?new Array(r).fill(0):new Array(r):new Uint32Array(r)}function t(r,e,n){return Array.isArray(r)?r.slice(e,e+n):r.subarray(e,e+n)}r.newUintArray=n,r.uintSubArray=t,Object.defineProperty(r,Symbol.toStringTag,{value:"Module"})}));
