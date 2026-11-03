/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./Uniform","../shaderTechnique/BindType"],(function(e,r,t){"use strict";class i extends r.Uniform{constructor(e,r){super(e,"mat3",t.BindType.Pass,((t,i,n)=>t.setUniformMatrix3fv(e,r(i,n))))}}e.Matrix3PassUniform=i,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
