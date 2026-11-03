/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../../../core/compilerUtils","../../../core/shaderLibrary/util/RgbaFloatEncoding.glsl","../../../core/shaderModules/FloatDrawUniform","../../../core/shaderModules/interfaces","../../../core/shaderModules/Texture2DDrawUniform","./EdgeUtil.glsl","./UnpackAttributes.glsl"],(function(e,t,r,a,s,l,o,u){"use strict";class c extends s.NoParameters{}function n(e,c){e.include(u.UnpackAttributes,c);const{vertex:n,fragment:i}=e;switch(o.usesSketchLogic(c.type)&&(n.uniforms.add(new l.Texture2DDrawUniform("strokesTexture",(e=>e.strokesTexture.texture))),n.uniforms.add(new a.FloatDrawUniform("strokesLog2Resolution",(e=>Math.log2(e.strokesTexture.resolution))),new a.FloatDrawUniform("strokeVariants",(e=>e.strokesTexture.variants))),e.varyings.add("vStrokeUV","vec2"),i.uniforms.add(new l.Texture2DDrawUniform("strokesTexture",(e=>e.strokesTexture.texture)),new a.FloatDrawUniform("strokesNormalizationScale",(e=>e.strokesTexture.normalizationScale))),n.code.add(s.glsl`void calculateStyleOutputsSketch(float lineLength, UnpackedAttributes unpackedAttributes) {
vec2 sidenessNorm = unpackedAttributes.sidenessNorm;
float lineIndex = clamp(ceil(log2(lineLength)), 0.0, strokesLog2Resolution);
vStrokeUV = vec2(exp2(lineIndex) * sidenessNorm.y, lineIndex * strokeVariants + variantStroke + 0.5) / vec2(textureSize(strokesTexture, 0));
vStrokeUV.x += variantOffset;
}`),e.fragment.include(r.RgbaFloatEncoding),i.code.add(s.glsl`float calculateLineOffsetSketch() {
float offsetNorm = rgba2float(texture(strokesTexture, vStrokeUV));
return (offsetNorm - 0.5) * strokesNormalizationScale;
}
float calculateLinePressureSketch() {
return rgba2float(texture(strokesTexture, vStrokeUV + vec2(0.0, 0.5)));
}`)),c.type){case o.EdgeType.Solid:n.code.add(s.glsl`void calculateStyleOutputs(UnpackedAttributes unpackedAttributes) {}`),i.code.add(s.glsl`float calculateLineOffset() {
return 0.0;
}
float calculateLinePressure() {
return 1.0;
}`);break;case o.EdgeType.Sketch:n.code.add(s.glsl`void calculateStyleOutputs(UnpackedAttributes unpackedAttributes)
{
calculateStyleOutputsSketch(vLineLengthPixels, unpackedAttributes);
}`),i.code.add(s.glsl`float calculateLineOffset() {
return calculateLineOffsetSketch();
}
float calculateLinePressure() {
return calculateLinePressureSketch();
}`);break;case o.EdgeType.Mixed:e.varyings.add("vType","float"),n.code.add(s.glsl`void calculateStyleOutputs(UnpackedAttributes unpackedAttributes)
{
vType = unpackedAttributes.type;
if (unpackedAttributes.type <= 0.0) {
calculateStyleOutputsSketch(vLineLengthPixels, unpackedAttributes);
}
}`),i.code.add(s.glsl`float calculateLineOffset() {
if (vType <= 0.0) {
return calculateLineOffsetSketch();
}
else {
return 0.0;
}
}
float calculateLinePressure() {
if (vType <= 0.0) {
return calculateLinePressureSketch();
}
else {
return 1.0;
}
}`);break;case o.EdgeType.COUNT:break;default:t.neverReached(c.type)}}e.LineOffset=n,e.LineOffsetDrawParameters=c,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
