/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../shaderModules/interfaces","../../shaderModules/Texture2DPassUniform","../../../effects/ssao/SSAO"],(function(e,s,t,n){"use strict";function r(e,r){const a=e.fragment;r.receiveAmbientOcclusion?(a.uniforms.add(new t.Texture2DPassUniform("ssaoTex",((e,s)=>s.ssao?.getTexture()))),a.constants.add("blurSizePixelsInverse","float",1/n.blurSizePixels),a.code.add(s.glsl`float evaluateAmbientOcclusionInverse() {
vec2 ssaoTextureSizeInverse = 1.0 / vec2(textureSize(ssaoTex, 0));
return texture(ssaoTex, gl_FragCoord.xy * blurSizePixelsInverse * ssaoTextureSizeInverse).r;
}
float evaluateAmbientOcclusion() {
return 1.0 - evaluateAmbientOcclusionInverse();
}`)):a.code.add(s.glsl`float evaluateAmbientOcclusionInverse() { return 1.0; }
float evaluateAmbientOcclusion() { return 0.0; }`)}e.EvaluateAmbientOcclusion=r,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
