/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../../core/libs/gl-matrix-2/factories/vec2f64","../../../../../core/libs/gl-matrix-2/factories/vec4f64","../../core/shaderModules/interfaces"],(function(e,t,s,i){"use strict";class o extends i.NoParameters{constructor(){super(...arguments),this.color=s.fromValues(1,0,1,1),this.haloColor=s.fromValues(1,0,1,1),this.haloOpacity=1,this.haloOpacityOccluded=.25,this.fillOpacity=.2,this.fillOpacityOccluded=.05,this.coverageRounding=t.fromValues(1,1)}}e.HighlightPassParameters=o,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
