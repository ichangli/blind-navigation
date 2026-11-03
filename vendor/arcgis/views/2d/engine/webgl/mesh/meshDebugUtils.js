/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../DisplayEntity","../shaderGraph/techniques/mesh/dataViewUtils","../util/Reader","../util/serializationUtils"],(function(e,t,i,a,r){"use strict";function n(e){if(!e)return null;return{entities:r.deserializeList(new a(e.entities),t),vertexData:e.data.map(o)}}function o(e){const t=e.layout.stride,a=new DataView(e.vertices),r=[],n=e.vertices.byteLength/t;let o=0;for(let s=0;s<n;s++){const n={};for(const t of e.layout.attributes){let e=`${t.offset} ${t.name}`,r=i.unpackDataView(a,t,o);if(t.packPrecisionFactor)if(e+=` (precision: ${t.packPrecisionFactor})`,"number"==typeof r)r/=t.packPrecisionFactor;else for(let i=0;i<r.length;i++)r[i]/=t.packPrecisionFactor;n[e]=r}o+=t,r.push(n)}return{vertices:r,layout:e.layout}}e.debugMeshDataInfo=n,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
