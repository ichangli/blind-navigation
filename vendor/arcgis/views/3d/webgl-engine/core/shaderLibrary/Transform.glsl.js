/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./ForwardLinearDepth.glsl","../shaderModules/interfaces"],(function(e,t,r){"use strict";function o(e){t.addCalculateLinearDepth(e),e.vertex.code.add(r.glsl`vec4 transformPositionWithDepth(mat4 proj, mat4 view, vec3 pos, vec2 nearFar, out float depth) {
vec4 eye = view * vec4(pos, 1.0);
depth = calculateLinearDepth(nearFar,eye.z);
return proj * eye;
}`),e.vertex.code.add(r.glsl`vec4 transformPosition(mat4 proj, mat4 view, vec3 pos) {
return proj * (view * vec4(pos, 1.0));
}`)}e.Transform=o,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
