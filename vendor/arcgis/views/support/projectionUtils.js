/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["require","exports","../../core/promiseUtils","../../geometry/projection"],(function(e,t,r,o){"use strict";let i,n=null;async function c(t){n||(n=new Promise(((t,r)=>e(["../../portal/support/geometryServiceUtils"],t,r))).then((e=>i=e))),await n,r.throwIfAborted(t)}async function a(e,t,r,n){if(!e)return null;const s=e.spatialReference;return o.isLoaded()||o.canProjectWithoutEngine(s,t)?o.project(e,t):i?i.projectGeometry(e,t,r,n):(await Promise.race([c(n),o.load(n)]),a(e,t,r,n))}t.projectWithEngineOrService=a,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
