/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../util/RgbaFloatEncoding.glsl","../util/View.glsl","../../shaderModules/Float4PassUniform","../../shaderModules/FloatPassUniform","../../shaderModules/interfaces","../../shaderModules/Texture2DPassUniform","../../../materials/stippleTextureRepository","../../../shaders/ensureColor4"],(function(e,t,l,o,i,a,r,s,n){"use strict";function p(e,t){e.constants.add("stippleAlphaColorDiscard","float",.001),e.constants.add("stippleAlphaHighlightDiscard","float",.5),t.stippleEnabled?d(e,t):c(e)}function d(e,s){const p=!(s.draped&&s.stipplePreferContinuous),{vertex:d,fragment:c}=e;c.include(t.RgbaFloatEncoding),s.draped||(l.addCameraPosition(d,s),d.uniforms.add(new i.FloatPassUniform("worldToScreenPerDistanceRatio",((e,t)=>1/t.camera.perScreenPixelRatio))),d.code.add(a.glsl`float computeWorldToScreenRatio(vec3 segmentCenter) {
float segmentDistanceToCamera = length(segmentCenter - cameraPosition);
return worldToScreenPerDistanceRatio / segmentDistanceToCamera;
}`)),e.varyings.add("vStippleDistance","float"),e.varyings.add("vStippleDistanceLimits","vec2"),e.varyings.add("vStipplePatternStretch","float"),d.code.add(a.glsl`
    float discretizeWorldToScreenRatio(float worldToScreenRatio) {
      float step = ${g};

      float discreteWorldToScreenRatio = log(worldToScreenRatio);
      discreteWorldToScreenRatio = ceil(discreteWorldToScreenRatio / step) * step;
      discreteWorldToScreenRatio = exp(discreteWorldToScreenRatio);
      return discreteWorldToScreenRatio;
    }
  `),d.code.add(a.glsl`vec2 computeStippleDistanceLimits(float startPseudoScreen, float segmentLengthPseudoScreen, float segmentLengthScreen, float patternLength) {`),d.code.add(a.glsl`
    if (segmentLengthPseudoScreen >= ${p?"patternLength":"1e4"}) {
  `),l.addPixelRatio(d),d.code.add(a.glsl`float repetitions = segmentLengthScreen / (patternLength * pixelRatio);
float flooredRepetitions = max(1.0, floor(repetitions + 0.5));
float segmentLengthScreenRounded = flooredRepetitions * patternLength;
float stretch = repetitions / flooredRepetitions;
vStipplePatternStretch = max(0.75, stretch);
return vec2(0.0, segmentLengthScreenRounded);
}
return vec2(startPseudoScreen, startPseudoScreen + segmentLengthPseudoScreen);
}`),c.uniforms.add(new r.Texture2DPassUniform("stipplePatternTexture",(e=>e.stippleTexture)),new i.FloatPassUniform("stipplePatternSDFNormalizer",(e=>f(e.stipplePattern))),new i.FloatPassUniform("stipplePatternPixelSizeInv",(e=>1/S(e)))),c.code.add(a.glsl`float getStippleSDF(out bool isClamped) {
float stippleDistanceClamped = clamp(vStippleDistance, vStippleDistanceLimits.x, vStippleDistanceLimits.y);
vec2 aaCorrectedLimits = vStippleDistanceLimits + vec2(1.0, -1.0) / gl_FragCoord.w;
isClamped = vStippleDistance < aaCorrectedLimits.x || vStippleDistance > aaCorrectedLimits.y;
float u = stippleDistanceClamped * gl_FragCoord.w * stipplePatternPixelSizeInv * vLineSizeInv;
u = fract(u);
float encodedSDF = rgba2float(texture(stipplePatternTexture, vec2(u, 0.5)));
float sdf = (encodedSDF * 2.0 - 1.0) * stipplePatternSDFNormalizer;
return (sdf - 0.5) * vStipplePatternStretch + 0.5;
}
float getStippleSDF() {
bool ignored;
return getStippleSDF(ignored);
}
float getStippleAlpha() {
bool isClamped;
float stippleSDF = getStippleSDF(isClamped);
float antiAliasedResult = clamp(stippleSDF * vLineWidth + 0.5, 0.0, 1.0);
return isClamped ? floor(antiAliasedResult + 0.5) : antiAliasedResult;
}`),s.stippleOffColorEnabled?(c.uniforms.add(new o.Float4PassUniform("stippleOffColor",(e=>n.ensureColor4(e.stippleOffColor)))),c.code.add(a.glsl`#define discardByStippleAlpha(stippleAlpha, threshold) {}
#define blendStipple(color, stippleAlpha) mix(color, stippleOffColor, stippleAlpha)`)):c.code.add(a.glsl`#define discardByStippleAlpha(stippleAlpha, threshold) if (stippleAlpha < threshold) { discard; }
#define blendStipple(color, stippleAlpha) vec4(color.rgb, color.a * stippleAlpha)`)}function c(e){e.fragment.code.add(a.glsl`float getStippleAlpha() { return 1.0; }
#define discardByStippleAlpha(_stippleAlpha_, _threshold_) {}
#define blendStipple(color, _stippleAlpha_) color`)}function f(e){return e?(Math.floor(.5*(s.computeLongestPattern(e)-1))+.5)/e.pixelRatio:1}function S(e){const t=e.stipplePattern;return t?s.computeTextureSize(e.stipplePattern)/t.pixelRatio:1}const g=a.glsl.float(.4);e.LineStipple=p,e.computePixelSize=S,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
