/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(t){"use strict";class e{constructor(){this._inputs=new Map}set(t,e){this._inputs.set(t,e)}get(t){return this._inputs.get(t)}has(t){return this._inputs.has(t)}release(t){this._inputs.get(t)?.release()&&this._inputs.delete(t)}}t.RenderPluginInput=e,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
