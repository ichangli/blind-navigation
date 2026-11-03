/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../../../core/libs/gl-matrix-2/factories/mat3f64","../attributes/TextureCoordinateAttribute.glsl","../../shaderModules/interfaces","../../shaderModules/Matrix3PassUniform"],(function(e,r,o,t,a){"use strict";function s(e,o){o.hasColorTextureTransform?(e.vertex.uniforms.add(new a.Matrix3PassUniform("colorTextureTransformMatrix",(e=>e.colorTextureTransformMatrix??r.IDENTITY))),e.varyings.add("colorUV","vec2"),e.vertex.code.add(t.glsl`void forwardColorUV(){
colorUV = (colorTextureTransformMatrix * vec3(vuv0, 1.0)).xy;
}`)):e.vertex.code.add(t.glsl`void forwardColorUV(){}`)}function i(e,s){s.hasNormalTextureTransform&&s.textureCoordinateType!==o.TextureCoordinateAttributeType.None?(e.vertex.uniforms.add(new a.Matrix3PassUniform("normalTextureTransformMatrix",(e=>e.normalTextureTransformMatrix??r.IDENTITY))),e.varyings.add("normalUV","vec2"),e.vertex.code.add(t.glsl`void forwardNormalUV(){
normalUV = (normalTextureTransformMatrix * vec3(vuv0, 1.0)).xy;
}`)):e.vertex.code.add(t.glsl`void forwardNormalUV(){}`)}function n(e,s){s.hasEmissionTextureTransform&&s.textureCoordinateType!==o.TextureCoordinateAttributeType.None?(e.vertex.uniforms.add(new a.Matrix3PassUniform("emissiveTextureTransformMatrix",(e=>e.emissiveTextureTransformMatrix??r.IDENTITY))),e.varyings.add("emissiveUV","vec2"),e.vertex.code.add(t.glsl`void forwardEmissiveUV(){
emissiveUV = (emissiveTextureTransformMatrix * vec3(vuv0, 1.0)).xy;
}`)):e.vertex.code.add(t.glsl`void forwardEmissiveUV(){}`)}function d(e,s){s.hasOcclusionTextureTransform&&s.textureCoordinateType!==o.TextureCoordinateAttributeType.None?(e.vertex.uniforms.add(new a.Matrix3PassUniform("occlusionTextureTransformMatrix",(e=>e.occlusionTextureTransformMatrix??r.IDENTITY))),e.varyings.add("occlusionUV","vec2"),e.vertex.code.add(t.glsl`void forwardOcclusionUV(){
occlusionUV = (occlusionTextureTransformMatrix * vec3(vuv0, 1.0)).xy;
}`)):e.vertex.code.add(t.glsl`void forwardOcclusionUV(){}`)}function u(e,s){s.hasMetallicRoughnessTextureTransform&&s.textureCoordinateType!==o.TextureCoordinateAttributeType.None?(e.vertex.uniforms.add(new a.Matrix3PassUniform("metallicRoughnessTextureTransformMatrix",(e=>e.metallicRoughnessTextureTransformMatrix??r.IDENTITY))),e.varyings.add("metallicRoughnessUV","vec2"),e.vertex.code.add(t.glsl`void forwardMetallicRoughnessUV(){
metallicRoughnessUV = (metallicRoughnessTextureTransformMatrix * vec3(vuv0, 1.0)).xy;
}`)):e.vertex.code.add(t.glsl`void forwardMetallicRoughnessUV(){}`)}e.colorTextureUV=s,e.emissiveTextureUV=n,e.metallicRoughnessTextureUV=u,e.normalTextureUV=i,e.occlusionTextureUV=d,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
