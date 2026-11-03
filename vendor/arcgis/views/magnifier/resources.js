/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["require","exports","../../core/promiseUtils","../../support/requestImageUtils"],(function(e,t,r,a){"use strict";const o=e=>Object.freeze(Object.defineProperty({__proto__:null,default:e},Symbol.toStringTag,{value:"Module"}));async function s(t){const s=new Promise(((t,r)=>e(["./mask-svg"],(e=>t(o(e))),r))),i=new Promise(((t,r)=>e(["./overlay-svg"],(e=>t(o(e))),r))),n=a.requestImage((await s).default,{signal:t}),l=a.requestImage((await i).default,{signal:t}),u={mask:await n,overlay:await l};return r.throwIfAborted(t),u}t.loadMagnifierResources=s,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
