/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../../../core/libs/gl-matrix-2/math/vec2","../../../../../../core/libs/gl-matrix-2/factories/vec2f64","../util/RgbaFloatEncoding.glsl","../../shaderModules/Float2PassUniform","../../shaderModules/interfaces"],(function(e,t,r,a,o,l){"use strict";function n(e){e.include(a.RgbaFloatEncoding),e.code.add(l.glsl`float linearDepthFromFloat(float depth, vec2 nearFar) {
return -(depth * (nearFar[1] - nearFar[0]) + nearFar[0]);
}
float linearDepthFromRGBA(vec4 depth, vec2 nearFar) {
return linearDepthFromFloat(rgba2float(depth), nearFar);
}
float linearDepthFromTexture(sampler2D depthTexture, vec2 uv, vec2 nearFar) {
ivec2 iuv = ivec2(uv * vec2(textureSize(depthTexture, 0)));
return linearDepthFromRGBA(texelFetch(depthTexture, iuv, 0), nearFar);
}`)}function c(e){e.uniforms.add(new o.Float2PassUniform("zProjectionMap",((e,t)=>d(t.camera)))),e.code.add(l.glsl`float linearizeDepth(float depth) {
float depthNdc = depth * 2.0 - 1.0;
float c1 = zProjectionMap[0];
float c2 = zProjectionMap[1];
return -(c1 / (depthNdc + c2 + 1e-7));
}`),e.code.add(l.glsl`float depthFromTexture(sampler2D depthTexture, vec2 uv) {
ivec2 iuv = ivec2(uv * vec2(textureSize(depthTexture, 0)));
float depth = texelFetch(depthTexture, iuv, 0).r;
return depth;
}`),e.code.add(l.glsl`float linearDepthFromTexture(sampler2D depthTexture, vec2 uv) {
return linearizeDepth(depthFromTexture(depthTexture, uv));
}`)}function d(e){const r=e.projectionMatrix;return t.set(i,r[14],r[10])}const i=r.create();e.ReadDepth=c,e.ReadLinearDepth=n,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
