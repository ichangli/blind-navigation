/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../../../core/libs/gl-matrix-2/math/mat4","../../../../../../core/libs/gl-matrix-2/factories/mat4f64","../../../../../../core/libs/gl-matrix-2/factories/vec3f64","./CameraSpace.glsl","../../shaderModules/interfaces","../../shaderModules/Matrix4PassUniform"],(function(e,r,a,t,c,i,o){"use strict";class s extends i.NoParameters{constructor(){super(...arguments),this.localOrigin=t.zeros()}}function n(e){e.include(c.CameraSpace),e.fragment.uniforms.add(new o.Matrix4PassUniform("inverseViewMatrix",((e,t)=>{const c=a.create();return r.translate(c,t.camera.viewMatrix,e.localOrigin),r.invertOrIdentity(c,c)}))),e.fragment.code.add(i.glsl`vec4 reconstructLocalPosition(vec2 coord, float linearDepth) {
vec4 cameraSpace = vec4(reconstructPosition(coord, linearDepth), 1.0);
return inverseViewMatrix * cameraSpace;
}`)}e.LocalFromScreenSpace=n,e.LocalFromScreenSpacePassParameters=s,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
