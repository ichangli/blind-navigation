/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../projection","../SpatialReference","./projectPointToVector","../../layers/graphics/dehydratedPoint"],(function(e,t,o,n,r){"use strict";function c(e,t,o,r,c){return!(null==t||null==r||e.length<2)&&(a.x=e[0],a.y=e[1],a.z=e[2],a.spatialReference=t,n.projectPointToVector(a,o,r,c))}async function i(e,o,n,r,i,a){return await t.initializeProjection(o,r,null,a),c(e,o,n,r,i)}const a=r.makeDehydratedPoint(0,0,0,o.WGS84);e.projectVectorToVector=c,e.projectVectorToVectorAsync=i,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
