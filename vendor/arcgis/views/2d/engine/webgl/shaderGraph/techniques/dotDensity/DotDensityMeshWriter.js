/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../fill/AFillMeshWriter","../../../../../../webgl/enums"],(function(e,t,r){"use strict";const a={createComputedParams:e=>e,optionalAttributes:{},attributes:{id:{type:r.DataType.UNSIGNED_BYTE,count:3,pack:"id"},bitset:{type:r.DataType.UNSIGNED_BYTE,count:1},pos:{type:r.DataType.SHORT,count:2,pack:"position",packPrecisionFactor:10},inverseArea:{type:r.DataType.FLOAT,count:1,packTessellation:({inverseArea:e})=>e}}};class s extends t.AFillMeshWriter{constructor(){super(...arguments),this.vertexSpec=a}createTesselationParams(e){return{inverseArea:1/e.readGeometryArea()}}}e.DotDensityMeshWriter=s,e.dotDensityVertexSpec=a,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
