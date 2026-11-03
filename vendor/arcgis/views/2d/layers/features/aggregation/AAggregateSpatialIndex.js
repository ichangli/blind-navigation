/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../engine/webgl/definitions"],(function(e,t){"use strict";class i{constructor(e){this._options=e}insert(e,t){const i=e.getCursor(),r={$view:{scale:this._options.scale,timeZone:this._options.timeZone}};for(;i.next();)this._insertFeature(i,r,t)}_insertFeature(e,i,r){const{featureFilter:o}=this._options;if(null!==o&&!o.check(e))return;let n=0,s=0;if("esriGeometryPoint"===e.geometryType)n=e.readXWorldSpace(),s=e.readYWorldSpace();else{if(r){const i=e.readCentroidForDisplay();if(null==i)return;const[r,o]=i.coords;if(r<0||r>t.tileSize||o<0||o>t.tileSize)return}const i=e.readCentroidWorldSpace();if(null==i)return;n=i.coords[0],s=i.coords[1]}this._insert(e,n,s,i)}}e.AAggregateSpatialIndex=i,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
