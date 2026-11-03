/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../core/workers/WorkerHandle"],(function(e,r){"use strict";class t extends r.WorkerHandle{constructor(e=null){super("LercWorker","_decode",{_decode:e=>[e.buffer]},e,{strategy:"dedicated"}),this.schedule=e,this.ref=0}decode(e,r,t){return e&&0!==e.byteLength?this.invoke({buffer:e,options:r},t):Promise.resolve(null)}release(){--this.ref<=0&&(o.forEach(((e,r)=>{e===this&&o.delete(r)})),this.destroy())}}const o=new Map;function s(e=null){let r=o.get(e);return r||(null!=e?(r=new t((r=>e.immediate.schedule(r))),o.set(e,r)):(r=new t,o.set(null,r))),++r.ref,r}e.acquireDecoder=s,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
