/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../core/typedArrayUtil"],(function(r,t){"use strict";function e(r){if(r.length<t.nativeArrayMaxSize)return Array.from(r);if(t.isArray(r))return Float64Array.from(r);if(!("BYTES_PER_ELEMENT"in r))return Array.from(r);switch(r.BYTES_PER_ELEMENT){case 1:return Uint8Array.from(r);case 2:return t.isUint16Array(r)?Uint16Array.from(r):Int16Array.from(r);case 4:return Float32Array.from(r);default:return Float64Array.from(r)}}r.cloneAttributeData=e,Object.defineProperty(r,Symbol.toStringTag,{value:"Module"})}));
