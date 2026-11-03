/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./Uniform","../shaderTechnique/BindType"],(function(e,n,o){"use strict";class s extends n.Uniform{constructor(e,n){super(e,"float",o.BindType.Pass,((o,s,t)=>o.setUniform1f(e,n(s,t))))}}e.FloatPassUniform=s,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
