/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../../../core/has","./AFetchLoadStrategy"],(function(e,t,s){"use strict";class d extends s.AFetchLoadStrategy{constructor(){super(...arguments),this._chunksById=new Map}unload(e){this._removeChunks(e.tile)}_addChunk(e){const s=e.tile.id;this._chunksById.has(s)||this._chunksById.set(s,[]);const d=e.size();(d||e.first||e.end)&&(t("esri-2d-update-debug")&&console.debug(`Chunk[${e.chunkId}] ATileLoadStrategy.addChunk [count=${d}]`),this._chunksById.get(s).push(e),this._store.insert(e))}_removeChunks(e){const s=this._chunksById.get(e.key.id)??[];for(const d of s)t("esri-2d-update-debug")&&console.debug(`Tile[${e.key.id}] Chunk[${d.chunkId}] ATileLoadStrategy.removeChunk`),this._store.remove(d);this._chunksById.delete(e.key.id)}}e.ATileLoadStrategy=d,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
