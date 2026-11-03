/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["require","exports","../assets","../core/has"],(function(e,t,s,n){"use strict";const i=128e3;let a=null,l=null;async function r(){return a||(a=o()),a}async function o(){const t=n("esri-csp-restrictions")?await new Promise(((t,s)=>e(["../chunks/libtess-asm"],t,s))).then((e=>e.libtessAsm)):await new Promise(((t,s)=>e(["../chunks/libtess"],t,s))).then((e=>e.libtess));l=await t.default({locateFile:e=>s.getAssetUrl(`esri/core/libs/libtess/${e}`)})}function c(e,t){const s=Math.max(e.length,i);return l.triangulate(e,t,s)}t.loadLibtess=r,t.triangulate=c,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
