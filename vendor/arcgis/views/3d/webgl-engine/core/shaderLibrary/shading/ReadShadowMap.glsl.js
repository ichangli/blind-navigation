/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../../../core/libs/gl-matrix-2/factories/mat4f64","../../../../../../core/libs/gl-matrix-2/factories/vec3f64","../util/RgbaFloat16Encoding.glsl","../../shaderModules/Float4PassUniform","../../shaderModules/IntegerPassUniform","../../shaderModules/interfaces","../../shaderModules/Matrix4sDrawUniform","../../shaderModules/Matrix4sPassUniform","../../shaderModules/Texture2DPassUniform"],(function(e,a,s,t,o,r,i,d,c,n){"use strict";class p extends i.NoParameters{constructor(){super(...arguments),this.origin=s.create()}}class l extends p{}class v extends i.NoParameters{constructor(){super(...arguments),this.modelTransformation=a.IDENTITY}}class h extends v{constructor(){super(...arguments),this.origin=s.create()}}function x(e,a){a.receiveShadows&&(e.fragment.uniforms.add(new c.Matrix4sPassUniform("shadowMapMatrix",((e,a)=>a.shadowMap.getShadowMapMatrices(e.origin)),4)),f(e))}function u(e,a){a.receiveShadows&&(e.fragment.uniforms.add(new d.Matrix4sDrawUniform("shadowMapMatrix",((e,a)=>a.shadowMap.getShadowMapMatrices(e.origin)),4)),f(e))}function f(e){const a=e.fragment;a.include(t.Rgba4FloatEncoding),a.uniforms.add(new n.Texture2DPassUniform("shadowMap",((e,a)=>a.shadowMap.depthTexture)),new r.IntegerPassUniform("numCascades",((e,a)=>a.shadowMap.numCascades)),new o.Float4PassUniform("cascadeDistances",((e,a)=>a.shadowMap.cascadeDistances))),a.code.add(i.glsl`int chooseCascade(float depth, out mat4 mat) {
vec4 distance = cascadeDistances;
int i = depth < distance[1] ? 0 : depth < distance[2] ? 1 : depth < distance[3] ? 2 : 3;
mat = i == 0 ? shadowMapMatrix[0] : i == 1 ? shadowMapMatrix[1] : i == 2 ? shadowMapMatrix[2] : shadowMapMatrix[3];
return i;
}
vec3 lightSpacePosition(vec3 _vpos, mat4 mat) {
vec4 lv = mat * vec4(_vpos, 1.0);
lv.xy /= lv.w;
return 0.5 * lv.xyz + vec3(0.5);
}
vec2 cascadeCoordinates(int i, ivec2 textureSize, vec3 lvpos) {
float xScale = float(textureSize.y) / float(textureSize.x);
return vec2((float(i) + lvpos.x) * xScale, lvpos.y);
}
float readShadowMapDepth(ivec2 uv, sampler2D _depthTex) {
return rgba4ToFloat(texelFetch(_depthTex, uv, 0));
}
float posIsInShadow(ivec2 uv, vec3 lvpos, sampler2D _depthTex) {
return readShadowMapDepth(uv, _depthTex) < lvpos.z ? 1.0 : 0.0;
}
float filterShadow(vec2 uv, vec3 lvpos, ivec2 texSize, sampler2D _depthTex) {
vec2 st = fract(uv * vec2(texSize) + vec2(0.5));
ivec2 base = ivec2(uv * vec2(texSize) - vec2(0.5));
float s00 = posIsInShadow(ivec2(base.x, base.y), lvpos, _depthTex);
float s10 = posIsInShadow(ivec2(base.x + 1, base.y), lvpos, _depthTex);
float s11 = posIsInShadow(ivec2(base.x + 1, base.y + 1), lvpos, _depthTex);
float s01 = posIsInShadow(ivec2(base.x, base.y + 1), lvpos, _depthTex);
return mix(mix(s00, s10, st.x), mix(s01, s11, st.x), st.y);
}
float readShadowMap(const in vec3 _vpos, float _linearDepth) {
mat4 mat;
int i = chooseCascade(_linearDepth, mat);
if (i >= numCascades) { return 0.0; }
vec3 lvpos = lightSpacePosition(_vpos, mat);
if (lvpos.z >= 1.0 || lvpos.x < 0.0 || lvpos.x > 1.0 || lvpos.y < 0.0 || lvpos.y > 1.0) { return 0.0; }
ivec2 size = textureSize(shadowMap, 0);
vec2 uv = cascadeCoordinates(i, size, lvpos);
return filterShadow(uv, lvpos, size, shadowMap);
}`)}e.ReadShadowMapDraw=u,e.ReadShadowMapDrawParameters=l,e.ReadShadowMapParameters=v,e.ReadShadowMapPass=x,e.ReadShadowMapPassParameters=h,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
