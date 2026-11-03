/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./mesh/MeshWriterInputEvaluator"],(function(e,t){"use strict";async function r(e,r,n,a,i,o){const s=new o(a,await t.MeshWriterInputEvaluator.create(e,r,i),{},n);return await s.loadDependencies(),s}e.createMeshWriter=r,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
