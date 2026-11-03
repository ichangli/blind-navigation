/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../shading/VisualVariables.glsl","../../shaderModules/Float3PassUniform","../../shaderModules/FloatPassUniform","../../shaderModules/FloatsPassUniform","../../shaderModules/interfaces","../../../lib/VertexAttribute"],(function(t,e,i,a,r,o,s){"use strict";const v=8;function l(t,l){const c=t.vertex;c.uniforms.add(new a.FloatPassUniform("intrinsicWidth",(t=>t.width))),l.vvSize?(t.attributes.add(s.VertexAttribute.SIZEFEATUREATTRIBUTE,"float"),c.uniforms.add(new i.Float3PassUniform("vvSizeMinSize",(t=>t.vvSize.minSize)),new i.Float3PassUniform("vvSizeMaxSize",(t=>t.vvSize.maxSize)),new i.Float3PassUniform("vvSizeOffset",(t=>t.vvSize.offset)),new i.Float3PassUniform("vvSizeFactor",(t=>t.vvSize.factor))),c.code.add(o.glsl`float getSize() {
return intrinsicWidth * clamp(vvSizeOffset + sizeFeatureAttribute * vvSizeFactor, vvSizeMinSize, vvSizeMaxSize).x;
}`)):(t.attributes.add(s.VertexAttribute.SIZE,"float"),c.code.add(o.glsl`float getSize(){
return intrinsicWidth * size;
}`)),l.vvOpacity?(t.attributes.add(s.VertexAttribute.OPACITYFEATUREATTRIBUTE,"float"),c.constants.add("vvOpacityNumber","int",8),c.uniforms.add(new r.FloatsPassUniform("vvOpacityValues",(t=>t.vvOpacity.values),v),new r.FloatsPassUniform("vvOpacityOpacities",(t=>t.vvOpacity.opacityValues),v)),c.code.add(o.glsl`float interpolateOpacity( float value ){
if (value <= vvOpacityValues[0]) {
return vvOpacityOpacities[0];
}
for (int i = 1; i < vvOpacityNumber; ++i) {
if (vvOpacityValues[i] >= value) {
float f = (value - vvOpacityValues[i-1]) / (vvOpacityValues[i] - vvOpacityValues[i-1]);
return mix(vvOpacityOpacities[i-1], vvOpacityOpacities[i], f);
}
}
return vvOpacityOpacities[vvOpacityNumber - 1];
}
vec4 applyOpacity( vec4 color ){
return vec4(color.xyz, interpolateOpacity(opacityFeatureAttribute));
}`)):c.code.add(o.glsl`vec4 applyOpacity( vec4 color ){
return color;
}`),l.vvColor?(t.include(e.VisualVariables,l),t.attributes.add(s.VertexAttribute.COLORFEATUREATTRIBUTE,"float"),c.code.add(o.glsl`vec4 getColor(){
return applyOpacity(interpolateVVColor(colorFeatureAttribute));
}`)):(t.attributes.add(s.VertexAttribute.COLOR,"vec4"),c.code.add(o.glsl`vec4 getColor(){
return applyOpacity(color);
}`))}t.RibbonVertexPosition=l,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
