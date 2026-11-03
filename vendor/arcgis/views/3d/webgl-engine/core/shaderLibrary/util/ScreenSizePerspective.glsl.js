/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../../../chunks/vec32","../../../../../../core/libs/gl-matrix-2/factories/vec3f64","../../shaderModules/Float3PassUniform","../../shaderModules/interfaces"],(function(e,a,r,c,s){"use strict";function t(e){e.vertex.code.add(s.glsl`float screenSizePerspectiveViewAngleDependentFactor(float absCosAngle) {
return absCosAngle * absCosAngle * absCosAngle;
}`),e.vertex.code.add(s.glsl`vec3 screenSizePerspectiveScaleFactor(float absCosAngle, float distanceToCamera, vec3 params) {
return vec3(
min(params.x / (distanceToCamera - params.y), 1.0),
screenSizePerspectiveViewAngleDependentFactor(absCosAngle),
params.z
);
}`),e.vertex.code.add(s.glsl`float applyScreenSizePerspectiveScaleFactorFloat(float size, vec3 factor) {
return mix(size * clamp(factor.x, factor.z, 1.0), size, factor.y);
}`),e.vertex.code.add(s.glsl`float screenSizePerspectiveScaleFloat(float size, float absCosAngle, float distanceToCamera, vec3 params) {
return applyScreenSizePerspectiveScaleFactorFloat(
size,
screenSizePerspectiveScaleFactor(absCosAngle, distanceToCamera, params)
);
}`),e.vertex.code.add(s.glsl`vec2 applyScreenSizePerspectiveScaleFactorVec2(vec2 size, vec3 factor) {
return mix(size * clamp(factor.x, factor.z, 1.0), size, factor.y);
}`),e.vertex.code.add(s.glsl`vec2 screenSizePerspectiveScaleVec2(vec2 size, float absCosAngle, float distanceToCamera, vec3 params) {
return applyScreenSizePerspectiveScaleFactorVec2(size, screenSizePerspectiveScaleFactor(absCosAngle, distanceToCamera, params));
}`)}function i(e){e.uniforms.add(new c.Float3PassUniform("screenSizePerspective",(e=>n(e.screenSizePerspective))))}function o(e){e.uniforms.add(new c.Float3PassUniform("screenSizePerspectiveAlignment",(e=>n(e.screenSizePerspectiveAlignment||e.screenSizePerspective))))}function n(e){return a.set(l,e.parameters.divisor,e.parameters.offset,e.minScaleFactor)}const l=r.create();e.ScreenSizePerspective=t,e.addScreenSizePerspective=i,e.addScreenSizePerspectiveAlignment=o,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
