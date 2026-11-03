/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../core/MemCachePool","./TerrainAttributes"],(function(e,t,r){"use strict";class o{constructor(e){this._storage=new t.MemCachePool(((t,r)=>e.newCache(t,r)),"TileGeometry")}acquire(e){const t=4,o=Math.ceil(e/t)*t,a=this._storage,i=s(o),c=a.pop(i);if(c)return c;const n=r.terrainAttributesLayout.createBuffer(o);return n.release=()=>a.put(i,n),n}clear(){this._storage.clear()}destroy(){this._storage.destroy()}}function s(e){return e.toString()}e.TerrainAttributesCache=o,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
