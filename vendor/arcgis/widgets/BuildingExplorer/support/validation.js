/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(e){"use strict";function t(e){const t={fieldValueMap:new Map,allowedValues:[]};for(const n of e){const e=n.fieldValueMap,l=t.fieldValueMap;e.forEach(((e,n)=>{l.has(n)||(l.set(n,e),t.allowedValues.push(n))}))}return t.allowedValues.sort(((e,t)=>e-t)),t}function n(e){let t=null;for(const n of e)t=null!=t?Math.min(t,n):n;return t}function l(e){let t=null;for(const n of e)t=null!=t?Math.max(t,n):n;return t}function o(e,t){return t.allowedValues.length>0?u(e,t.allowedValues):null}function u(e,t){if(0===t.length)return e;if(e===1/0)return t[t.length-1];if(e===-1/0)return t[0];let n=t[0],l=Math.abs(n-e);for(const o of t){const t=Math.abs(o-e);t<l&&(n=o,l=t)}return n}e.findClosest=u,e.getDomainInfo=t,e.getMax=l,e.getMin=n,e.getValidNumber=o,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
