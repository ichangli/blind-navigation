/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(t){"use strict";class e{constructor(t,e){this._moduleSingletons=t,this._syntaxModules=e}loadLibrary(t){if(null==this._syntaxModules)return null;const e=this._syntaxModules[t.toLowerCase()];return e?{syntax:e.script,uri:e.uri}:null}}t.ArcadeModuleLoader=e,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
