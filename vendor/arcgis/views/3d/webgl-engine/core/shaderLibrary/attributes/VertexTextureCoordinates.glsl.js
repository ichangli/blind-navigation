/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../../../core/compilerUtils","./TextureCoordinateAttribute.glsl","../util/TextureAtlasLookup.glsl","../../shaderModules/interfaces"],(function(e,t,r,u,o){"use strict";function i(e,i){switch(e.include(r.TextureCoordinateAttribute,i),i.textureCoordinateType){case r.TextureCoordinateAttributeType.Default:case r.TextureCoordinateAttributeType.Compressed:return void e.fragment.code.add(o.glsl`vec4 textureLookup(sampler2D tex, vec2 uv) {
return texture(tex, uv);
}`);case r.TextureCoordinateAttributeType.Atlas:return e.include(u.TextureAtlasLookup),void e.fragment.code.add(o.glsl`vec4 textureLookup(sampler2D tex, vec2 uv) {
return textureAtlasLookup(tex, uv, vuvRegion);
}`);default:t.neverReached(i.textureCoordinateType);case r.TextureCoordinateAttributeType.None:case r.TextureCoordinateAttributeType.COUNT:return}}e.VertexTextureCoordinates=i,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
