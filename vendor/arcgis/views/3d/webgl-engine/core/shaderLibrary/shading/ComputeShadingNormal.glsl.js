/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../../../core/compilerUtils","../attributes/NormalAttribute.glsl","../attributes/VertexNormal.glsl","../attributes/VertexPosition.glsl","./Normals.glsl","../../shaderModules/interfaces"],(function(e,o,r,l,a,d,i){"use strict";function n(e,n){const s=e.fragment;switch(n.doubleSidedMode){case d.NormalsDoubleSidedMode.None:s.code.add(i.glsl`vec3 _adjustDoublesided(vec3 normal) {
return normal;
}`);break;case d.NormalsDoubleSidedMode.View:e.include(a.VertexPosition,n),s.code.add(i.glsl`vec3 _adjustDoublesided(vec3 normal) {
return dot(normal, vPositionWorldCameraRelative) > 0.0 ? -normal : normal;
}`);break;case d.NormalsDoubleSidedMode.WindingOrder:s.code.add(i.glsl`vec3 _adjustDoublesided(vec3 normal) {
return gl_FrontFacing ? normal : -normal;
}`);break;default:o.neverReached(n.doubleSidedMode);case d.NormalsDoubleSidedMode.COUNT:}switch(n.normalType){case r.NormalType.Attribute:case r.NormalType.Compressed:e.include(l.VertexNormal,n),s.code.add(i.glsl`vec3 shadingNormalWorld() {
return _adjustDoublesided(normalize(vNormalWorld));
}
vec3 shadingNormal_view() {
vec3 normal = normalize(vNormalView);
return gl_FrontFacing ? normal : -normal;
}`);break;case r.NormalType.ScreenDerivative:e.include(a.VertexPosition,n),s.code.add(i.glsl`vec3 shadingNormalWorld() {
return normalize(cross(
dFdx(vPositionWorldCameraRelative),
dFdy(vPositionWorldCameraRelative)
));
}
vec3 shadingNormal_view() {
return normalize(cross(dFdx(vPosition_view),dFdy(vPosition_view)));
}`);break;case r.NormalType.Ground:n.spherical?(e.include(a.VertexPosition,n),s.code.add(i.glsl`vec3 shadingNormalWorld() {
return normalize(positionWorld());
}`)):s.code.add(i.glsl`vec3 shadingNormalWorld() {
return vec3(0.0, 0.0, 1.0);
}`),s.code.add(i.glsl`vec3 shadingNormal_view() {
return normalize(cross(dFdx(vPosition_view),dFdy(vPosition_view))).xyz;
}`);break;default:o.neverReached(n.normalType);case r.NormalType.COUNT:}}e.ComputeShadingNormal=n,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
