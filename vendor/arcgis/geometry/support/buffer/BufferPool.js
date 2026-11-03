/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../core/has","../../../core/PooledArray"],(function(t,e,o){"use strict";class l{constructor(t,e){this._factoryCallback=t,this._lengthCallback=e,this._pool=new Map}acquire(t){if(!l.test.disabled){const e=this._pool.get(t);if(e&&0!==e.length)return e.pop()}try{return this._factoryCallback(t)}catch(e){throw e}}release(t){if(l.test.disabled)return;const e=this._lengthCallback(t);let s=this._pool.get(e);s||(s=new o({shrink:!0}),this._pool.set(e,s)),s.push(t)}clear(){this._pool.clear()}get test(){}}l.test={disabled:!1},t.BufferPool=l,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
