/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(t){"use strict";class e{static from(t){let r=0,n=0,o=0;return t.forEach((t=>{const e=t._readGeometry();e&&(n+=e.isPoint?1:e.lengths.reduce(((t,e)=>t+e),0),o+=e.isPoint?1:e.lengths.length,r+=1)})),new e(r,n,o)}constructor(t,e,r){this.featureCount=t,this.vertexCount=e,this.ringCount=r}toJSON(){return{featureCount:this.featureCount,ringCount:this.featureCount,vertexCount:this.featureCount}}}t.FeatureStoreStatistics=e,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
