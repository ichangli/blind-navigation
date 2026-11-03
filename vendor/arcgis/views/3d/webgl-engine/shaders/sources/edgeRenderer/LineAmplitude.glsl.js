/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../../../core/compilerUtils","../../../core/shaderModules/FloatDrawUniform","../../../core/shaderModules/interfaces","./EdgeUtil.glsl","./UnpackAttributes.glsl"],(function(e,t,r,a,d,l){"use strict";function i(e,i){const s=e.vertex;switch(e.include(l.UnpackAttributes,i),i.type){case d.EdgeType.Solid:s.code.add(a.glsl`float calculateLineAmplitude(UnpackedAttributes unpackedAttributes) {
return 0.0;
}`);break;case d.EdgeType.Sketch:s.uniforms.add(new r.FloatDrawUniform("strokesAmplitude",(e=>e.strokesTexture.amplitude))),s.code.add(a.glsl`float calculateLineAmplitude(UnpackedAttributes unpackedAttributes) {
return strokesAmplitude;
}`);break;case d.EdgeType.Mixed:s.uniforms.add(new r.FloatDrawUniform("strokesAmplitude",(e=>e.strokesTexture.amplitude))),s.code.add(a.glsl`float calculateLineAmplitude(UnpackedAttributes unpackedAttributes) {
float type = unpackedAttributes.type;
if (type <= 0.0) {
return strokesAmplitude;
}
return 0.0;
}`);break;case d.EdgeType.COUNT:break;default:t.neverReached(i.type)}}e.LineAmplitude=i,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
