/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../../../core/libs/gl-matrix-2/math/vec2","../../../../../../core/libs/gl-matrix-2/factories/vec2f64","../../../../../../chunks/vec42","../../../../../../core/libs/gl-matrix-2/factories/vec4f64","../../shaderModules/Float2PassUniform","../../shaderModules/Float4PassUniform","../../shaderModules/interfaces"],(function(e,t,o,r,a,n,c,s){"use strict";function i(e){e.fragment.uniforms.add(new c.Float4PassUniform("projInfo",((e,t)=>f(t.camera)))),e.fragment.uniforms.add(new n.Float2PassUniform("zScale",((e,t)=>d(t.camera)))),e.fragment.code.add(s.glsl`vec3 reconstructPosition(vec2 fragCoord, float depth) {
return vec3((fragCoord * projInfo.xy + projInfo.zw) * (zScale.x * depth + zScale.y), depth);
}`)}function f(e){const t=e.projectionMatrix;return 0===t[11]?r.set(l,2/(e.fullWidth*t[0]),2/(e.fullHeight*t[5]),(1+t[12])/t[0],(1+t[13])/t[5]):r.set(l,-2/(e.fullWidth*t[0]),-2/(e.fullHeight*t[5]),(1-t[8])/t[0],(1-t[9])/t[5])}const l=a.create();function d(e){return 0===e.projectionMatrix[11]?t.set(u,0,1):t.set(u,1,0)}const u=o.create();e.CameraSpace=i,e.getProjectionInfo=f,e.getZScale=d,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
