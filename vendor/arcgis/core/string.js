/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./object"],(function(e,t){"use strict";const n=/\{([^}]+)\}/g;function r(e){return e??""}function o(e,o){return o?e.replaceAll(n,"object"==typeof o?(e,n)=>r(t.getDeepValue(n,o)):(e,t)=>r(o(t))):e}function l(e,t){return e.replaceAll(/([.$?*|{}()[\]\\/+\-^])/g,(e=>t?.includes(e)?e:`\\${e}`))}function u(e){let t=0;for(let n=0;n<e.length;n++)t=(t<<5)-t+e.charCodeAt(n),t|=0;return t}let c;function i(e){c??=new DOMParser;return c.parseFromString(e||"","text/html").body.innerText||""}function a(e,t){return new RegExp(`{${t}}`,"ig").test(e)}function f(e,...t){let n=e[0];for(let r=0;r<t.length;++r)n+=t[r]+e[r+1];return n}e.escapeRegExpString=l,e.numericHash=u,e.replace=o,e.safeToString=f,e.stripHTML=i,e.templateHasKey=a,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
