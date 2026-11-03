/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./Uniform","../shaderTechnique/BindType"],(function(e,n,i){"use strict";class r extends n.Uniform{constructor(e,n){super(e,"int",i.BindType.Pass,((i,r,s)=>i.setUniform1i(e,n(r,s))))}}e.IntegerPassUniform=r,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
