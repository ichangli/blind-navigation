/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../core/Error","../../../core/lang","../../../core/promiseUtils","../MeshVertexAttributes","./vertexSpaceConversion"],(function(e,t,r,o,n,c){"use strict";async function s(e,s,i){await Promise.resolve(),o.throwIfAborted(i);const l=c.convertVertexSpace(e,s);if(!l)throw new t("meshUtils:convertVertexSpace()","Failed to convert to provided vertex space due to projection errors");const u=e.cloneAndModifyVertexAttributes(new n.MeshVertexAttributes({...l,uv:r.clone(e.vertexAttributes.uv),color:r.clone(e.vertexAttributes.color)}),s);return u.transform=null,u}e.convertMeshVertexSpace=s,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
