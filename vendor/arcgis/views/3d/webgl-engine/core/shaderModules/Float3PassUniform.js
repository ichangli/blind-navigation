/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./Uniform","../shaderTechnique/BindType"],(function(e,n,s){"use strict";class o extends n.Uniform{constructor(e,n){super(e,"vec3",s.BindType.Pass,((s,o,r)=>s.setUniform3fv(e,n(o,r))))}}e.Float3PassUniform=o,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
