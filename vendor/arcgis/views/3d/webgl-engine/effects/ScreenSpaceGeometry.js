/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../core/has","../../../../core/maybe","../lib/DefaultVertexAttributeLocations","../lib/DefaultVertexBufferLayouts","../lib/VertexArrayObject","../../../webgl/BufferObject","../../../webgl/enums"],(function(e,t,r,o,a,s,i,c){"use strict";class n{constructor(e){this._rctx=e,this._vao=u(e)}destroy(){this._vao=r.disposeMaybe(this._vao)}draw(){null!=this._vao&&(this._rctx.bindVAO(this._vao),this._rctx.drawArrays(c.PrimitiveType.TRIANGLES,0,3))}get test(){}}function u(e,t=a.Pos2,r=o.Default3D){const n=new Float32Array([-1,-1,3,-1,-1,3]);return new s.VertexArrayObject(e,r,{geometry:t},{geometry:i.BufferObject.createVertex(e,c.Usage.STATIC_DRAW,n)})}e.ScreenSpaceGeometry=n,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
