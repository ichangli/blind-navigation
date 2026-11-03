/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./Uniform","../shaderTechnique/BindType"],(function(e,o,n){"use strict";class s extends o.Uniform{constructor(e,o){super(e,"bool",n.BindType.Pass,((n,s,r)=>n.setUniform1b(e,o(s,r))))}}e.BooleanPassUniform=s,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
