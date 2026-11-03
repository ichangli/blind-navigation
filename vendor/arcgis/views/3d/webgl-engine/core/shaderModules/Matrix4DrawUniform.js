/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./Uniform","../shaderTechnique/BindType"],(function(e,r,t){"use strict";class i extends r.Uniform{constructor(e,r){super(e,"mat4",t.BindType.Draw,((t,i,n)=>t.setUniformMatrix4fv(e,r(i,n))))}}e.Matrix4DrawUniform=i,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
