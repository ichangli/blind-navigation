/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["require","exports"],(function(e,t){"use strict";const n=e=>Object.freeze(Object.defineProperty({__proto__:null,default:e},Symbol.toStringTag,{value:"Module"}));let l,o=null;const r=new Map;async function a(t){null==o&&(null==l&&(l=new Promise(((t,l)=>e(["../../../layers/VoxelWasmPerSceneView"],(e=>t(n(e))),l)))),o=await l);const a=t.view;let i=r.get(a);return i||(i=new o.default({view:a}),r.set(a,i)),i.addVoxelLayer(t)}function i(e){return r.get(e)}function u(e){const t=e.view,n=r.get(t);if(n){n.removeVoxelLayer(e)<1&&(r.delete(t),0===r.size&&(l=null,o=null))}}t.addLayerViewToWasm=a,t.getVoxelWasm=i,t.removeLayerViewFromWasm=u,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
