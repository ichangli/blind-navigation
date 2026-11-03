/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../../../core/promiseUtils","./UpdateTracking2D","../../../support/QueueProcessor"],(function(e,s,r){"use strict";class t{constructor(e){this.updateTracking=new s.UpdateTracking2D({debugName:"FeatureCommandQueue"}),this._queueProcessor=new r.QueueProcessor({concurrency:1,process:e.process})}destroy(){this.updateTracking.destroy(),this._queueProcessor.destroy(),this.clear()}clear(){this._queueProcessor.clear()}async push(s){return e.ignoreAbortErrors(this.updateTracking.addPromise(this._doPush(s)))}async _doPush(e){const s=this._queueProcessor,r=s.last();switch(e.type){case"update":case"highlight":if(r?.type===e.type)return;return s.push(e);case"edit-by-id":case"edit-by-feature":return s.push(e)}}}return t}));
