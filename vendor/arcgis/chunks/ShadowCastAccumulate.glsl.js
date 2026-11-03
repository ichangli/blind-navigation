/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../core/libs/gl-matrix-2/math/mat4","../core/libs/gl-matrix-2/factories/mat4f64","../views/3d/webgl-engine/core/shaderLibrary/ScreenSpacePass.glsl","../views/3d/webgl-engine/core/shaderLibrary/output/ReadDepth.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/ReadShadowMap.glsl","../views/3d/webgl-engine/core/shaderLibrary/util/CameraSpace.glsl","../views/3d/webgl-engine/core/shaderLibrary/util/RgbaFloatEncoding.glsl","../views/3d/webgl-engine/core/shaderModules/interfaces","../views/3d/webgl-engine/core/shaderModules/Matrix4PassUniform","../views/3d/webgl-engine/core/shaderModules/ShaderBuilder","../views/3d/webgl-engine/core/shaderModules/Texture2DPassUniform"],(function(e,a,i,r,s,t,d,o,l,n,c,h){"use strict";const p=255,u=1/p;function w(e){const i=new c.ShaderBuilder,p=i.fragment;return p.include(o.RgbaFloatEncoding),p.include(s.ReadDepth),i.include(d.CameraSpace),i.include(r.ScreenSpacePass),i.include(t.ReadShadowMapPass,e),p.uniforms.add(new h.Texture2DPassUniform("shadowMap",((e,a)=>a.shadowMap.depthTexture)),new h.Texture2DPassUniform("depthMap",((e,a)=>a.depth?.attachment)),new n.Matrix4PassUniform("inverseViewMatrix",((e,i)=>a.invert(g,a.translate(g,i.camera.viewMatrix,i.camera.center))))),p.constants.add("sampleValue","float",u),i.outputs.add("sampleCount","float"),p.code.add(l.glsl`void main(void) {
float depth = depthFromTexture(depthMap, uv);
if (depth >= 1.0 || depth <= 0.0) {
discard;
}
float currentPixelDepth = linearizeDepth(depth);
vec4 currentPixelPos = vec4(reconstructPosition(gl_FragCoord.xy, currentPixelDepth), 1.0);
vec4 worldSpacePos = inverseViewMatrix * currentPixelPos;
mat4 shadowMatrix;
float linearDepth = -currentPixelDepth;
int i = chooseCascade(linearDepth, shadowMatrix);
if (i >= numCascades) {
discard;
}
vec3 lvpos = lightSpacePosition(worldSpacePos.xyz, shadowMatrix);
if (lvpos.z >= 1.0 || lvpos.x < 0.0 || lvpos.x > 1.0 || lvpos.y < 0.0 || lvpos.y > 1.0) {
discard;
}
ivec2 texSize = textureSize(shadowMap, 0);
ivec2 uvShadow = ivec2(cascadeCoordinates(i, texSize, lvpos) * vec2(texSize));
float depthShadow = readShadowMapDepth(uvShadow, shadowMap);
bool shadow = depthShadow < lvpos.z;
if (!shadow) {
discard;
}
sampleCount = sampleValue;
}`),i}const g=i.create(),v=Object.freeze(Object.defineProperty({__proto__:null,ShadowCastMaxSamples:p,build:w},Symbol.toStringTag,{value:"Module"}));e.ShadowCastAccumulate=v,e.ShadowCastMaxSamples=p,e.build=w}));
