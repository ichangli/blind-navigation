/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["require","exports","../../assets"],(function(e,n,t){"use strict";function r(){return new Promise((n=>new Promise(((n,t)=>e(["../../chunks/lyr3DMain"],n,t))).then((e=>e.lyr3DMain)).then((({default:e})=>{const t=e({locateFile:o,onRuntimeInitialized:()=>n(t)})})))).catch((e=>{throw e}))}function i(){return new Promise((n=>new Promise(((n,t)=>e(["../../chunks/lyr3DWorker"],n,t))).then((e=>e.lyr3DWorker)).then((({default:e})=>{const t=e({locateFile:o,onRuntimeInitialized:()=>n(t)})})))).catch((e=>{throw e}))}function o(e){return t.getAssetUrl(`esri/libs/lyr3d/${e}`)}n.loadLyr3DMainWASM=r,n.loadLyr3DWorkerWASM=i,Object.defineProperty(n,Symbol.toStringTag,{value:"Module"})}));
