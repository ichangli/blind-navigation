/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../ShaderOutput","../attributes/TextureCoordinateAttribute.glsl","../attributes/VertexTextureCoordinates.glsl","../util/TextureAtlasLookup.glsl","../../shaderModules/interfaces","../../shaderModules/Texture2DDrawUniform","../../../lib/basicInterfaces"],(function(e,t,r,o,u,a,s,l){"use strict";function d(e,d){const i=e.fragment;if(d.hasColorTexture&&(d.output===t.ShaderOutput.Color||d.alphaDiscardMode!==l.AlphaDiscardMode.Opaque)){e.include(o.VertexTextureCoordinates,d);const t=d.textureCoordinateType===r.TextureCoordinateAttributeType.Atlas;i.uniforms.add(new s.Texture2DDrawUniform("baseColorTexture",(e=>e.texture))),t?(e.include(u.TextureAtlasLookup),i.code.add(a.glsl`vec4 readBaseColorTexture() {
return textureAtlasLookup(baseColorTexture, vuv0, vuvRegion);
}`)):i.code.add(a.glsl`vec4 readBaseColorTexture() {
return texture(baseColorTexture, vuv0);
}`)}else i.code.add(a.glsl`vec4 readBaseColorTexture() { return vec4(1.0); }`)}e.ReadBaseColorTexture=d,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
