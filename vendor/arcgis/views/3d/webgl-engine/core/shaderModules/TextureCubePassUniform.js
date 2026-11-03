/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./Uniform","../shaderTechnique/BindType"],(function(e,r,n){"use strict";class s extends r.Uniform{constructor(e,r){super(e,"samplerCube",n.BindType.Pass,((n,s,t)=>n.bindTexture(e,r(s,t))))}}e.TextureCubePassUniform=s,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
