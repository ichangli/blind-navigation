/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../../../layers/support/labelingInfo","../../layerAdapters/geometryUtils","./symbols/SymbolSchema"],(function(e,a,s,l){"use strict";async function n(e,l,n){const o=l.labelsVisible&&l.labelingInfo||[],i=s.getEffectiveGeometryType(l),r=a.validateLabelingInfo(o,i);return{type:"label",classes:await Promise.all(r.map(((a,s)=>t(e,a,s,n))))}}async function t(e,a,s,n){const t=await l.createSymbolMeshSchemas(a,{path:`${s}`,schemaOptions:e,uniforms:n});return{maxScale:a.maxScale,minScale:a.minScale,expression:a.labelExpressionInfo?.expression??a.labelExpression,where:a.where,meshes:t}}e.createLabelMatcherSchema=n,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
