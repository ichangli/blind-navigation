/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../support/QueueProcessor"],(function(s,e){"use strict";class t{constructor(s){this._outstandingMessages=[],this._queue=new e.QueueProcessor({concurrency:s.concurrency,process:e=>s.process(e)})}async push(s){if(s.end)return await Promise.all(this._outstandingMessages),await this._queue.push(s),void(this._outstandingMessages=[]);const e=this._queue.push(s);return this._outstandingMessages.push(e),e}}s.ProcessorTileMessageQueue=t,Object.defineProperty(s,Symbol.toStringTag,{value:"Module"})}));
