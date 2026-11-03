/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../../../core/libs/gl-matrix-2/factories/mat3f64","../../../../../../core/libs/gl-matrix-2/factories/vec2f64","../attributes/TextureCoordinateAttribute.glsl","../attributes/VertexTextureCoordinates.glsl","./Normals.glsl","../../shaderModules/Float2PassUniform","../../shaderModules/interfaces","../../shaderModules/Matrix3PassUniform","../../shaderModules/Texture2DDrawUniform","../../shaderModules/Texture2DPassUniform","../../shaderTechnique/BindType","../../../lib/VertexAttribute"],(function(e,t,a,r,n,o,s,l,d,m,i,u,T){"use strict";function c(e,c){const x=e.fragment;c.hasVertexTangents?(e.attributes.add(T.VertexAttribute.TANGENT,"vec4"),e.varyings.add("vTangent","vec4"),c.doubleSidedMode===o.NormalsDoubleSidedMode.WindingOrder?x.code.add(l.glsl`mat3 computeTangentSpace(vec3 normal) {
float tangentHeadedness = gl_FrontFacing ? vTangent.w : -vTangent.w;
vec3 tangent = normalize(gl_FrontFacing ? vTangent.xyz : -vTangent.xyz);
vec3 bitangent = cross(normal, tangent) * tangentHeadedness;
return mat3(tangent, bitangent, normal);
}`):x.code.add(l.glsl`mat3 computeTangentSpace(vec3 normal) {
float tangentHeadedness = vTangent.w;
vec3 tangent = normalize(vTangent.xyz);
vec3 bitangent = cross(normal, tangent) * tangentHeadedness;
return mat3(tangent, bitangent, normal);
}`)):x.code.add(l.glsl`mat3 computeTangentSpace(vec3 normal, vec3 pos, vec2 st) {
vec3 Q1 = dFdx(pos);
vec3 Q2 = dFdy(pos);
vec2 stx = dFdx(st);
vec2 sty = dFdy(st);
float det = stx.t * sty.s - sty.t * stx.s;
vec3 T = stx.t * Q2 - sty.t * Q1;
T = T - normal * dot(normal, T);
T *= inversesqrt(max(dot(T,T), 1.e-10));
vec3 B = sign(det) * cross(normal, T);
return mat3(T, B, normal);
}`),c.textureCoordinateType!==r.TextureCoordinateAttributeType.None&&(e.include(n.VertexTextureCoordinates,c),x.uniforms.add(c.pbrTextureBindType===u.BindType.Pass?new i.Texture2DPassUniform("normalTexture",(e=>e.textureNormal)):new m.Texture2DDrawUniform("normalTexture",(e=>e.textureNormal))),c.hasNormalTextureTransform&&(x.uniforms.add(new s.Float2PassUniform("scale",(e=>e.scale??a.ONES))),x.uniforms.add(new d.Matrix3PassUniform("normalTextureTransformMatrix",(e=>e.normalTextureTransformMatrix??t.IDENTITY)))),x.code.add(l.glsl`vec3 computeTextureNormal(mat3 tangentSpace, vec2 uv) {
vec3 rawNormal = textureLookup(normalTexture, uv).rgb * 2.0 - 1.0;`),c.hasNormalTextureTransform&&x.code.add(l.glsl`mat3 normalTextureRotation = mat3(normalTextureTransformMatrix[0][0]/scale[0], normalTextureTransformMatrix[0][1]/scale[1], 0.0,
normalTextureTransformMatrix[1][0]/scale[0], normalTextureTransformMatrix[1][1]/scale[1], 0.0,
0.0, 0.0, 0.0 );
rawNormal.xy = (normalTextureRotation * vec3(rawNormal.x, rawNormal.y, 1.0)).xy;`),x.code.add(l.glsl`return tangentSpace * rawNormal;
}`))}e.ComputeNormalTexture=c,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
