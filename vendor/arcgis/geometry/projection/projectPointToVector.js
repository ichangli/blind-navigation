/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../core/libs/gl-matrix-2/factories/vec3f64","../projection","./projectBuffer"],(function(e,t,o,r){"use strict";function n(e,t,n,c){if(o.canProjectWithoutEngine(e.spatialReference,n)){i[0]=e.x,i[1]=e.y;const o=e.z;return i[2]=o??c??0,r.projectBuffer(i,e.spatialReference,0,t,n,0,1)}const a=o.tryProjectWithZConversion(e,n);return!!a&&(t[0]=a?.x,t[1]=a?.y,t[2]=a?.z??c??0,!0)}async function c(e,t,r,c,i){return await o.initializeProjection(e.spatialReference,r,null,i),n(e,t,r,c)}const i=t.create();e.projectPointToVector=n,e.projectPointToVectorAsync=c,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
