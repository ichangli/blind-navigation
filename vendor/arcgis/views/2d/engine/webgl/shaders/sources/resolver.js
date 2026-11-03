/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./shaderRepository","../../../../../webgl/ShaderCompiler"],(function(e,r,n){"use strict";function t(e){return function(r){let n=e;return r.split("/").forEach((e=>{n&&(n=n[e])})),n}}const o=new n.ShaderCompiler(t(r));function i(e){return o.resolveIncludes(e)}e.resolveIncludes=i,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
