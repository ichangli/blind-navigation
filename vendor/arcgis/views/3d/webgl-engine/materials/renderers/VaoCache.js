/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../../core/MemCachePool","../../lib/VertexArrayObject","../../../../webgl/BufferObject","../../../../webgl/enums"],(function(e,t,r,c,o){"use strict";class s{constructor(e,r,c){this._rctx=e,this._locations=r,this._layout=c,this._cache=new t.MemCachePool(e.newCache,"VAOCache")}dispose(){this._cache.destroy()}newVao(e){const t=e.toString();let s=this._cache.pop(t);return s||(s=new r.VertexArrayObject(this._rctx,this._locations,{geometry:this._layout},{geometry:c.BufferObject.createVertex(this._rctx,o.Usage.STATIC_DRAW)}),s.vertexBuffers.geometry.setSize(e),s)}deleteVao(e){if(null==e)return;const t=e.byteSize.toString();this._cache.put(t,e)}}e.VaoCache=s,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
