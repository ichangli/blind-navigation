/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../webgl-engine/lib/lodRendering/LodResources"],(function(e,o){"use strict";function t(e,t){const n=e.stageResources.geometries.map((t=>new o.LodComponentResources(t,e.stageResources.textures))),r=null==e.lodThreshold||0===e.lodThreshold&&t>0?s(n):e.lodThreshold;return new o.LodLevelResources(n,r,e.pivotOffset)}function n(e){return new o.LodResources(e.map(((e,o)=>t(e,o))))}function s(e){const o=e.reduce(((e,{geometry:o})=>e+o.indexCount/3),0);return Math.sqrt(o*r/Math.PI)}const r=20;e.makeLodResources=n,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
