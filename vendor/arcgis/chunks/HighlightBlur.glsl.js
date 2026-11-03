/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../core/libs/gl-matrix-2/factories/vec2f64","../views/3d/webgl-engine/core/shaderModules/Float2DrawUniform","../views/3d/webgl-engine/core/shaderModules/Float2PassUniform","../views/3d/webgl-engine/core/shaderModules/interfaces","../views/3d/webgl-engine/core/shaderModules/ShaderBuilder","../views/3d/webgl-engine/core/shaderModules/Texture2DDrawUniform","../views/3d/webgl-engine/core/shaderModules/Texture2DPassUniform","../views/3d/webgl-engine/lib/VertexAttribute"],(function(e,r,t,i,o,u,n,s,a){"use strict";class l extends o.NoParameters{constructor(){super(...arguments),this.blurSize=r.create()}}function d(){const e=new u.ShaderBuilder,{attributes:r,varyings:l,vertex:d,fragment:c}=e;return r.add(a.VertexAttribute.POSITION,"vec2"),r.add(a.VertexAttribute.UV0,"vec2"),l.add("blurCoordinate","vec3"),d.uniforms.add(new s.Texture2DPassUniform("coverageTex",(e=>e.coverageTexture)),new i.Float2PassUniform("coverageRounding",(e=>e.coverageRounding))),d.code.add(o.glsl`void main() {
gl_Position = vec4(position, 0.0, 1.0);
vec4 cov = texture(coverageTex, uv0 * coverageRounding);
if (cov.r == 0.0) {
gl_Position = vec4(0.0);
}
blurCoordinate = vec3(gl_Position.xy * 0.5 + vec2(0.5), cov.g);
}`),c.uniforms.add(new t.Float2DrawUniform("blurSize",(e=>e.blurSize)),new n.Texture2DDrawUniform("tex",(e=>e.blurInputTexture))),c.code.add(o.glsl`void main() {
vec2 uv = blurCoordinate.xy;
vec4 center = texture(tex, uv);
if (blurCoordinate.z == 1.0) {
fragColor = center;
} else {
vec4 sum = center * 0.204164;
sum += texture(tex, uv + blurSize * 1.407333) * 0.304005;
sum += texture(tex, uv - blurSize * 1.407333) * 0.304005;
sum += texture(tex, uv + blurSize * 3.294215) * 0.093913;
sum += texture(tex, uv - blurSize * 3.294215) * 0.093913;
fragColor = sum;
}
}`),e}const c=Object.freeze(Object.defineProperty({__proto__:null,HighlightBlurDrawParameters:l,build:d},Symbol.toStringTag,{value:"Module"}));e.HighlightBlur=c,e.HighlightBlurDrawParameters=l,e.build=d}));
