/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../lib/VertexAttribute","./internal/bufferWriterUtils"],(function(t,e,r){"use strict";class i{constructor(t){this.vertexBufferLayout=t}elementCount(t){return t.attributes.get(e.VertexAttribute.POSITION).indices.length}write(t,e,i,u,f){r.writeDefaultAttributes(i,this.vertexBufferLayout,t,e,u,f)}}t.DefaultBufferWriter=i,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
