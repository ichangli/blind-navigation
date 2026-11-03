/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../webgl/enums","../../../webgl/FramebufferObject","../../../webgl/RenderbufferDescriptor","../../../webgl/TextureDescriptor"],(function(e,r,t,s,o){"use strict";class f{constructor(e){this._rctx=e,this._fbos=new Map}get(e){return this._getPool(e)}dispose(){this._fbos.forEach((e=>e.dispose())),this._fbos.clear()}_getPool(e){const f=this._fbos.get(e);if(f)return f;const i=new t.FramebufferObject(this._rctx,new o.TextureDescriptor(e),new s.RenderbufferDescriptor(r.RenderbufferFormat.DEPTH24_STENCIL8,e));return this._fbos.set(e,i),i}}e.MultiSizeFramebuffer=f,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
