/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../core/maybe"],(function(t,e){"use strict";class s{constructor(){this._result=!1}dispose(){this._program=e.disposeMaybe(this._program)}get result(){return null!=this._program&&(this._result=this._test(this._program),this.dispose()),this._result}}t.WebGLDriverTestModule=s,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
