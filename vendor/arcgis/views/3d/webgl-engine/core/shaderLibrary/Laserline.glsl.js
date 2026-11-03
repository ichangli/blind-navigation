/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./output/ReadDepth.glsl","./util/CameraSpace.glsl","../shaderModules/Float3PassUniform","../shaderModules/FloatPassUniform","../shaderModules/interfaces","../shaderModules/Texture2DPassUniform"],(function(e,o,l,a,t,r,n){"use strict";function s(e,s){const i=e.fragment;i.include(o.ReadDepth),e.include(l.CameraSpace),i.uniforms.add(new t.FloatPassUniform("globalAlpha",(e=>e.globalAlpha)),new a.Float3PassUniform("glowColor",(e=>e.glowColor)),new t.FloatPassUniform("glowWidth",((e,o)=>e.glowWidth*o.camera.pixelRatio)),new t.FloatPassUniform("glowFalloff",(e=>e.glowFalloff)),new a.Float3PassUniform("innerColor",(e=>e.innerColor)),new t.FloatPassUniform("innerWidth",((e,o)=>e.innerWidth*o.camera.pixelRatio)),new n.Texture2DPassUniform("depthMap",((e,o)=>o.depth?.attachment)),new n.Texture2DPassUniform("normalMap",(e=>e.normals)),new n.Texture2DPassUniform("frameColor",((e,o)=>o.mainColor))),i.code.add(r.glsl`vec4 blendPremultiplied(vec4 source, vec4 dest) {
float oneMinusSourceAlpha = 1.0 - source.a;
return vec4(
source.rgb + dest.rgb * oneMinusSourceAlpha,
source.a + dest.a * oneMinusSourceAlpha
);
}`),i.code.add(r.glsl`vec4 premultipliedColor(vec3 rgb, float alpha) {
return vec4(rgb * alpha, alpha);
}`),i.code.add(r.glsl`vec4 laserlineProfile(float dist) {
if (dist > glowWidth) {
return vec4(0.0);
}
float innerAlpha = (1.0 - smoothstep(0.0, innerWidth, dist));
float glowAlpha = pow(max(0.0, 1.0 - dist / glowWidth), glowFalloff);
return blendPremultiplied(
premultipliedColor(innerColor, innerAlpha),
premultipliedColor(glowColor, glowAlpha)
);
}`),i.code.add(r.glsl`bool laserlineReconstructFromDepth(out vec3 pos, out vec3 normal, out float angleCutoffAdjust, out float depthDiscontinuityAlpha) {
float depth = depthFromTexture(depthMap, uv);
if (depth == 1.0) {
return false;
}
float linearDepth = linearizeDepth(depth);
pos = reconstructPosition(gl_FragCoord.xy, linearDepth);
float minStep = 6e-8;
float depthStep = clamp(depth + minStep, 0.0, 1.0);
float linearDepthStep = linearizeDepth(depthStep);
float depthError = abs(linearDepthStep - linearDepth);
if (depthError > 0.2) {
normal = texture(normalMap, uv).xyz * 2.0 - 1.0;
angleCutoffAdjust = 0.004;
} else {
normal = normalize(cross(dFdx(pos), dFdy(pos)));
angleCutoffAdjust = 0.0;
}
float ddepth = fwidth(linearDepth);
depthDiscontinuityAlpha = 1.0 - smoothstep(0.0, 0.01, -ddepth / linearDepth);
return true;
}`),s.contrastControlEnabled?(i.uniforms.add(new t.FloatPassUniform("globalAlphaContrastBoost",(e=>null!=e.globalAlphaContrastBoost?e.globalAlphaContrastBoost:1))),i.code.add(r.glsl`float rgbToLuminance(vec3 color) {
return dot(vec3(0.2126, 0.7152, 0.0722), color);
}
vec4 laserlineOutput(vec4 color) {
float backgroundLuminance = rgbToLuminance(texture(frameColor, uv).rgb);
float alpha = clamp(globalAlpha * max(backgroundLuminance * globalAlphaContrastBoost, 1.0), 0.0, 1.0);
return color * alpha;
}`)):i.code.add(r.glsl`vec4 laserlineOutput(vec4 color) {
return color * globalAlpha;
}`)}e.Laserline=s,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
