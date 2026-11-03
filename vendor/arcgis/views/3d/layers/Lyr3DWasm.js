/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["require","exports"],(function(e,t){"use strict";const n=e=>Object.freeze(Object.defineProperty({__proto__:null,default:e},Symbol.toStringTag,{value:"Module"}));let i,r=null;const l=new Map;async function a(t){null==r&&(null==i&&(i=new Promise(((t,i)=>e(["../../../layers/Lyr3DWasmPerSceneView"],(e=>t(n(e))),i)))),r=await i);const a=t.view;let o=l.get(a);return o||(o=new r.default({view:a}),l.set(a,o)),await o.initializeWasm(),o.add3DTilesLayerView(t)}function o(e){return l.get(e)}function u(e){const t=e.view,n=l.get(t);if(n){n.remove3DTilesLayerView(e)<1&&(l.delete(t),0===l.size&&(i=null,r=null))}}t.addLayerViewToWasm=a,t.getLyr3DWasm=o,t.removeLayerViewFromWasm=u,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
