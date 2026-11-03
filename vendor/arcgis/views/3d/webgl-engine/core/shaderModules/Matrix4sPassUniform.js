/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./Uniform","../shaderTechnique/BindType"],(function(e,r,s){"use strict";class t extends r.Uniform{constructor(e,r,t){super(e,"mat4",s.BindType.Pass,((s,t,i)=>s.setUniformMatrix4fv(e,r(t,i))),t)}}e.Matrix4sPassUniform=t,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
