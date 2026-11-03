/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../core/workers/workers"],(function(e,t){"use strict";async function r(e){const r=await t.open("FeaturePipelineWorker",{client:e,strategy:"dedicated"});return new n(r)}class n{constructor(e){this._connection=e,this.pipeline=this._connection.createInvokeProxy(),this.features=this._connection.createInvokeProxy("features"),this.aggregates=this._connection.createInvokeProxy("aggregates"),this.streamMessenger=this._connection.createInvokeProxy("streamMessenger")}destroy(){this._connection.destroy()}get closed(){return this._connection.closed}}e.FeaturePipelineWorkerProxy=n,e.createFeaturePipelineWorkerProxy=r,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
