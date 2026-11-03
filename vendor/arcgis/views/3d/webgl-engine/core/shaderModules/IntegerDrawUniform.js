/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./Uniform","../shaderTechnique/BindType"],(function(e,n,r){"use strict";class i extends n.Uniform{constructor(e,n){super(e,"int",r.BindType.Draw,((r,i,t)=>r.setUniform1i(e,n(i,t))))}}e.IntegerDrawUniform=i,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
