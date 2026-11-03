/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../core/workers/utils"],(function(e,t){"use strict";class n{constructor(e){this._client=e,this.layerView=this._client.createInvokeProxy(""),this.container=this._client.createInvokeProxy("container"),this._eventLog=this._client.createInvokeProxy("eventLog")}onEvent(e){t.ignoreConnectionErrors(this._eventLog.onEvent(e))}}e.PipelineConnectionHandlers=n,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
