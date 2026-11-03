/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../support/buffer/InterleavedLayout","../../core/shaderLibrary/attributes/TextureCoordinateAttribute.glsl","../../lib/VertexAttribute"],(function(e,t,r,u){"use strict";function o(e){const o=t.newLayout().vec3f(u.VertexAttribute.POSITION);return e.hasNormals&&o.vec2i16(u.VertexAttribute.NORMALCOMPRESSED,{glNormalized:!0}),e.textureCoordinates===r.TextureCoordinateAttributeType.Default?o.vec2f(u.VertexAttribute.UV0):e.textureCoordinates===r.TextureCoordinateAttributeType.Atlas&&(o.vec2f(u.VertexAttribute.UV0),o.vec4u16(u.VertexAttribute.UVREGION,{glNormalized:!0})),e.colors&&o.vec4u8(u.VertexAttribute.COLOR,{glNormalized:!0}),o}e.createVertexBufferLayout=o,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
