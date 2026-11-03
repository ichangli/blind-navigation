/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../core/libs/gl-matrix-2/factories/vec3f64","../projection","./projectVectorToVector"],(function(e,t,o,r){"use strict";function c(e,t,o){return!!r.projectVectorToVector(e,t,i,o.spatialReference)&&(o.x=i[0],o.y=i[1],o.z=i[2],!0)}async function n(e,t,r,n){return await o.initializeProjection(t,r.spatialReference,null,n),c(e,t,r)}const i=t.create();e.projectVectorToPoint=c,e.projectVectorToPointAsync=n,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
