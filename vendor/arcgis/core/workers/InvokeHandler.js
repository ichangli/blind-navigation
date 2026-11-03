/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(t){"use strict";function e(t,e){return new Proxy({},{get:(r,i,o)=>(...r)=>{let o,s;const a=r[r.length-1];n(a)&&(o=a.signal,s=a.transferList,r.pop());return t.apply(e?`${e}.${i.toString()}`:i.toString(),r,{transferList:s,signal:o})}})}function n(t){return"object"==typeof t&&!Array.isArray(t)&&null!=t&&("signal"in t||"transferList"in t||0===Object.keys(t).length)}t.createInvokeProxy=e,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
