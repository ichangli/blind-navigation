/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../core/workers/WorkerHandle"],(function(e,r){"use strict";class s extends r.WorkerHandle{constructor(e){super("Lyr3DWorker","process",{process:e=>e.inputs},e,{hasInitialize:!0})}destroyWasm(){return this.broadcast({},"destroyWasm")}}e.Lyr3DWorkerHandle=s,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
