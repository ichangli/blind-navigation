/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../support/buffer/InterleavedLayout","../lib/VertexAttribute"],(function(t,e,r){"use strict";const o=e.newLayout().vec3f(r.VertexAttribute.POSITION),u=e.newLayout().vec3f(r.VertexAttribute.POSITION).vec2f(r.VertexAttribute.UV0),i=e.newLayout().vec3f(r.VertexAttribute.POSITION).vec4u8(r.VertexAttribute.COLOR),n=e.newLayout().vec3f(r.VertexAttribute.POSITION).vec2f(r.VertexAttribute.UV0).vec4u8(r.VertexAttribute.OBJECTANDLAYERIDCOLOR);t.PositionColorLayout=i,t.PositionLayout=o,t.PositionUVLayout=u,t.PositionUVLayoutObjectAndLayerId=n,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
