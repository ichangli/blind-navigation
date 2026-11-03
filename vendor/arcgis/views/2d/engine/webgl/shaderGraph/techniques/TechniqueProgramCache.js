/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(e){"use strict";class r{constructor(){this._programCache=new Map}destroy(){for(const e of this._programCache.values())e.destroy();this._programCache.clear()}getProgram(e,r,t,o,a){const s=e.getShaderKey(r,t,o,a);let c=this._programCache.get(s);return c||(c=e.getProgram(r,t,o,a),this._programCache.set(s,c)),c}}e.TechniqueProgramCache=r,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
