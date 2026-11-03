/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../../core/libs/gl-matrix-2/math/mat4","../../../../../core/libs/gl-matrix-2/factories/mat4f64","../../../../../chunks/vec32","../../../../../core/libs/gl-matrix-2/factories/vec3f64","../shaderModules/Float3DrawUniform","../shaderModules/Float3PassUniform","../shaderModules/interfaces"],(function(e,s,a,i,l,c,r,o){"use strict";class t extends o.NoParameters{constructor(e){super(),this.slicePlaneLocalOrigin=e}}function n(e,s){d(e,s,new r.Float3PassUniform("slicePlaneOrigin",((e,a)=>g(s,e,a))),new r.Float3PassUniform("slicePlaneBasis1",((e,a)=>h(s,e,a,a.slicePlane?.basis1))),new r.Float3PassUniform("slicePlaneBasis2",((e,a)=>h(s,e,a,a.slicePlane?.basis2))))}function f(e,s){d(e,s,new c.Float3DrawUniform("slicePlaneOrigin",((e,a)=>g(s,e,a))),new c.Float3DrawUniform("slicePlaneBasis1",((e,a)=>h(s,e,a,a.slicePlane?.basis1))),new c.Float3DrawUniform("slicePlaneBasis2",((e,a)=>h(s,e,a,a.slicePlane?.basis2))))}function d(e,s,...a){if(!s.hasSlicePlane){const a=o.glsl`#define rejectBySlice(_pos_) false
#define discardBySlice(_pos_) {}
#define highlightSlice(_color_, _pos_) (_color_)`;return s.hasSliceInVertexProgram&&e.vertex.code.add(a),void e.fragment.code.add(a)}s.hasSliceInVertexProgram&&e.vertex.uniforms.add(...a),e.fragment.uniforms.add(...a);const i=o.glsl`struct SliceFactors {
float front;
float side0;
float side1;
float side2;
float side3;
};
SliceFactors calculateSliceFactors(vec3 pos) {
vec3 rel = pos - slicePlaneOrigin;
vec3 slicePlaneNormal = -cross(slicePlaneBasis1, slicePlaneBasis2);
float slicePlaneW = -dot(slicePlaneNormal, slicePlaneOrigin);
float basis1Len2 = dot(slicePlaneBasis1, slicePlaneBasis1);
float basis2Len2 = dot(slicePlaneBasis2, slicePlaneBasis2);
float basis1Dot = dot(slicePlaneBasis1, rel);
float basis2Dot = dot(slicePlaneBasis2, rel);
return SliceFactors(
dot(slicePlaneNormal, pos) + slicePlaneW,
-basis1Dot - basis1Len2,
basis1Dot - basis1Len2,
-basis2Dot - basis2Len2,
basis2Dot - basis2Len2
);
}
bool sliceByFactors(SliceFactors factors) {
return factors.front < 0.0
&& factors.side0 < 0.0
&& factors.side1 < 0.0
&& factors.side2 < 0.0
&& factors.side3 < 0.0;
}
bool sliceEnabled() {
return dot(slicePlaneBasis1, slicePlaneBasis1) != 0.0;
}
bool sliceByPlane(vec3 pos) {
return sliceEnabled() && sliceByFactors(calculateSliceFactors(pos));
}
#define rejectBySlice(_pos_) sliceByPlane(_pos_)
#define discardBySlice(_pos_) { if (sliceByPlane(_pos_)) discard; }`,l=o.glsl`vec4 applySliceHighlight(vec4 color, vec3 pos) {
SliceFactors factors = calculateSliceFactors(pos);
const float HIGHLIGHT_WIDTH = 1.0;
const vec4 HIGHLIGHT_COLOR = vec4(0.0, 0.0, 0.0, 0.3);
factors.front /= (2.0 * HIGHLIGHT_WIDTH) * fwidth(factors.front);
factors.side0 /= (2.0 * HIGHLIGHT_WIDTH) * fwidth(factors.side0);
factors.side1 /= (2.0 * HIGHLIGHT_WIDTH) * fwidth(factors.side1);
factors.side2 /= (2.0 * HIGHLIGHT_WIDTH) * fwidth(factors.side2);
factors.side3 /= (2.0 * HIGHLIGHT_WIDTH) * fwidth(factors.side3);
if (sliceByFactors(factors)) {
return color;
}
float highlightFactor = (1.0 - step(0.5, factors.front))
* (1.0 - step(0.5, factors.side0))
* (1.0 - step(0.5, factors.side1))
* (1.0 - step(0.5, factors.side2))
* (1.0 - step(0.5, factors.side3));
return mix(color, vec4(HIGHLIGHT_COLOR.rgb, color.a), highlightFactor * HIGHLIGHT_COLOR.a);
}`,c=s.hasSliceHighlight?o.glsl`
        ${l}
        #define highlightSlice(_color_, _pos_) (sliceEnabled() ? applySliceHighlight(_color_, _pos_) : (_color_))
      `:o.glsl`#define highlightSlice(_color_, _pos_) (_color_)`;s.hasSliceInVertexProgram&&e.vertex.code.add(i),e.fragment.code.add(i),e.fragment.code.add(c)}function P(e,s,a){return e.instancedDoublePrecision?i.set(m,a.camera.viewInverseTransposeMatrix[3],a.camera.viewInverseTransposeMatrix[7],a.camera.viewInverseTransposeMatrix[11]):s.slicePlaneLocalOrigin}function u(e,s){return null!=e?i.subtract(H,s.origin,e):s.origin}function _(e,a,i){return e.hasSliceTranslatedView?null!=a?s.translate(b,i.camera.viewMatrix,a):i.camera.viewMatrix:null}function g(e,s,a){if(null==a.slicePlane)return l.ZEROS;const c=P(e,s,a),r=u(c,a.slicePlane),o=_(e,c,a);return null!=o?i.transformMat4(H,r,o):r}function h(e,s,a,c){if(null==c||null==a.slicePlane)return l.ZEROS;const r=P(e,s,a),o=u(r,a.slicePlane),t=_(e,r,a);return null!=t?(i.add(p,c,o),i.transformMat4(H,o,t),i.transformMat4(p,p,t),i.subtract(p,p,H)):c}const m=l.create(),H=l.create(),p=l.create(),b=a.create();e.SliceDraw=f,e.SlicePass=n,e.SlicePlaneParameters=t,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
