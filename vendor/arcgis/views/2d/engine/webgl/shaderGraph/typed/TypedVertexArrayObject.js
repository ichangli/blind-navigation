/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../../webgl/VertexArrayObject"],(function(t,e){"use strict";class r{constructor(...t){this.layout=null,this._vao=new e.VertexArrayObject(...t),this._context=t[0]}destroy(){this._vao.dispose()}bind(){this._context.bindVAO(this._vao)}}t.TypedVertexArrayObject=r,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
