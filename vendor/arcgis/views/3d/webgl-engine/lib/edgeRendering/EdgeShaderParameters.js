/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../../core/libs/gl-matrix-2/factories/mat3f64","../../../../../core/libs/gl-matrix-2/factories/vec3f64","../../core/shaderLibrary/attributes/VertexPosition.glsl"],(function(e,r,t,a){"use strict";class s extends a.VertexPositionPassParameters{constructor(e,t){super(),this.distanceFalloffFactor=e,this.transparency=t,this.transformNormalViewFromGlobal=r.create()}}class o extends a.VertexPositionDrawParameters{constructor(){super(...arguments),this.transformNormalViewFromGlobal=r.create(),this.slicePlaneLocalOrigin=t.create(),this.transformNormalGlobalFromModel=r.create()}}e.EdgeDrawParameters=o,e.EdgePassParameters=s,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
