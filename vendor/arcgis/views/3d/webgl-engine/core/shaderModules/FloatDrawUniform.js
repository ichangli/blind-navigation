/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./Uniform","../shaderTechnique/BindType"],(function(e,r,n){"use strict";class o extends r.Uniform{constructor(e,r){super(e,"float",n.BindType.Draw,((n,o,t)=>n.setUniform1f(e,r(o,t))))}}e.FloatDrawUniform=o,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
