/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./Uniform","../shaderTechnique/BindType"],(function(e,s,n){"use strict";class o extends s.Uniform{constructor(e,s,o){super(e,"vec4",n.BindType.Pass,((n,o,r)=>n.setUniform4fv(e,s(o,r))),o)}}e.Float4sPassUniform=o,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
