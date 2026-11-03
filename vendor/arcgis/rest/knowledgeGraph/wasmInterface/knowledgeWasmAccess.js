/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["require","exports","../../../assets","../../../core/has"],(function(e,t,n,s){"use strict";const r="esri/rest/knowledgeGraph/wasmInterface/";let c,o=null;async function i(){const e=o??c;if(e)return e;const t=s("wasm-simd");return c=a(t),c}async function a(t){if(t){const{default:t}=await new Promise(((t,n)=>e(["../../../chunks/arcgis-knowledge-client-core-simd"],t,n))).then((e=>e.arcgisKnowledgeClientCoreSimd));return t({locateFile:e=>n.getAssetUrl(r+e)})}const{default:s}=await new Promise(((t,n)=>e(["../../../chunks/arcgis-knowledge-client-core"],t,n))).then((e=>e.arcgisKnowledgeClientCore));return s({locateFile:e=>n.getAssetUrl(r+e)})}const l={setWasmInterfacePromise:e=>o=e,restoreWasmInterfacePromise:()=>o=null};t.getNewInterface=a,t.getWasmInterface=i,t.test=l,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
