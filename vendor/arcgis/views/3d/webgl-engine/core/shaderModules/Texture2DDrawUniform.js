/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./Uniform","../shaderTechnique/BindType"],(function(e,r,n){"use strict";class t extends r.Uniform{constructor(e,r){super(e,"sampler2D",n.BindType.Draw,((n,t,i)=>n.bindTexture(e,r(t,i))))}}e.Texture2DDrawUniform=t,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
