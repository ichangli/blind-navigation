/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./ManagedTextureBackedBuffer"],(function(e,t){"use strict";class r{constructor(e,t=1){this._rctx=e,this._fieldCount=t,this._buffers=[]}garbageCollect(){this._buffers=this._buffers.filter((e=>0!==e.activeCount||(e.dispose(),!1)))}destroy(){this._buffers.forEach((e=>e.dispose())),this._buffers=[]}getBuffer(e){for(const t of this._buffers)if(t.availableCount>=e)return t;if(e>t.maxIndexCount)return null;const r=new t.ManagedTextureBackedBuffer(this._rctx,this._fieldCount);return this._buffers.push(r),r}updateTextures(){for(const e of this._buffers)e.textureBuffer.updateTexture()}}e.BufferManager=r,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
