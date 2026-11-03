/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../geometry/support/DoubleArray","../../layers/graphics/elevationAlignmentUtils"],(function(e,n,t){"use strict";function o(e,o,r,l,i){const s=n.newDoubleArray(3*e.length),a=n.newDoubleArray(s.length);e.forEach(((e,n)=>{s[3*n]=e[0],s[3*n+1]=e[1],s[3*n+2]=e.length>2?e[2]:0}));const u=t.applyPerVertexElevationAlignment(s,o,0,a,0,s,0,s.length/3,r,l,i),c=null!=u;return{numVertices:e.length,position:s,mapPositions:a,projectionSuccess:c,sampledElevation:u}}e.geometryToRenderInfo=o,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
