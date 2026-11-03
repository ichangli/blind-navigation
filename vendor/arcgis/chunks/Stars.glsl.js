/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../core/libs/gl-matrix-2/math/mat4","../core/libs/gl-matrix-2/factories/mat4f64","../views/3d/webgl-engine/core/shaderModules/Float4PassUniform","../views/3d/webgl-engine/core/shaderModules/FloatPassUniform","../views/3d/webgl-engine/core/shaderModules/interfaces","../views/3d/webgl-engine/core/shaderModules/Matrix4PassUniform","../views/3d/webgl-engine/core/shaderModules/ShaderBuilder","../views/3d/webgl-engine/lib/VertexAttribute"],(function(e,t,a,i,r,o,l,s,n){"use strict";function d(){const e=new s.ShaderBuilder;return e.attributes.add(n.VertexAttribute.POSITION,"vec3"),e.attributes.add(n.VertexAttribute.COLOR,"vec4"),e.attributes.add(n.VertexAttribute.SIZE,"float"),e.varyings.add("vcolor","vec4"),e.varyings.add("vsize","float"),e.vertex.uniforms.add(new l.Matrix4PassUniform("transform",((e,t)=>c(e,t))),new i.Float4PassUniform("viewport",((e,t)=>t.camera.fullViewport)),new r.FloatPassUniform("pixelRatio",((e,t)=>t.camera.pixelRatio))),e.vertex.code.add(o.glsl`void main(void) {
gl_Position = transform * vec4(position, 0);
vcolor = color / 1.2;
vsize = size * 5.0 * pixelRatio;
gl_PointSize = vsize;
}`),e.fragment.code.add(o.glsl`void main() {
float cap = 0.7;
float scale = 1.0 / cap;
float helper = clamp(length(abs(gl_PointCoord - vec2(0.5))), 0.0, cap);
float alpha = clamp((cap - helper) * scale, 0.0, 1.0);
float intensity = alpha * alpha * alpha;
if (vsize < 3.0) {
intensity *= 0.5;
}
fragColor = vec4(vcolor.xyz, intensity);
}`),e}function c(e,a){const i=24e-8;return t.copy(f,a.camera.projectionMatrix),f[10]=i-1,f[11]=-1,f[14]=(i-2)*a.camera.near,t.multiply(f,f,a.camera.viewMatrix),t.multiply(f,f,e.modelMatrix)}const f=a.create(),u=Object.freeze(Object.defineProperty({__proto__:null,build:d},Symbol.toStringTag,{value:"Module"}));e.Stars=u,e.build=d}));
