/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./handleUtils"],(function(e,t){"use strict";function o(e){return{setTimeout:(o,n)=>{const i=e.setTimeout(o,n);return t.makeHandle((()=>e.clearTimeout(i)))}}}const n=o(globalThis);e.clock=n,e.wrap=o,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
