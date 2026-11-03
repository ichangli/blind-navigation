/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./vec42","../core/libs/gl-matrix-2/factories/vec4f64","../views/3d/webgl-engine/core/shaderModules/Float2PassUniform","../views/3d/webgl-engine/core/shaderModules/Float4PassUniform","../views/3d/webgl-engine/core/shaderModules/interfaces","../views/3d/webgl-engine/core/shaderModules/ShaderBuilder","../views/3d/webgl-engine/core/shaderModules/Texture2DPassUniform","../views/3d/webgl-engine/lib/VertexAttribute","./HighlightDownsample.glsl"],(function(e,i,t,o,l,r,n,a,s,u){"use strict";function c(){const e=new n.ShaderBuilder,{vertex:t,fragment:c}=e,d=t.code,h=c.code;return e.attributes.add(s.VertexAttribute.POSITION,"vec2"),e.varyings.add("uv","vec2"),e.attributes.add(s.VertexAttribute.UV0,"vec2"),t.uniforms.add(new a.Texture2DPassUniform("coverageTex",(e=>e.coverageTexture)),new o.Float2PassUniform("coverageRounding",(e=>e.coverageRounding))),d.add(r.glsl`void main() {
vec4 cov = texture(coverageTex, uv0 * coverageRounding);
if (cov.r == 0.0) {
gl_Position = vec4(0.0);
return;
}
gl_Position = vec4(position, 0.0, 1.0);
uv = position.xy * 0.5 + vec2(0.5);
}`),c.uniforms.add(new a.Texture2DPassUniform("tex",(e=>e.blurTexture)),new a.Texture2DPassUniform("highlightTexture",(e=>e.highlightTexture)),new l.Float4PassUniform("uColor",(e=>e.color)),new l.Float4PassUniform("haloColor",(e=>e.haloColor)),new l.Float4PassUniform("opacities",(e=>i.set(g,e.haloOpacity,e.haloOpacityOccluded,e.fillOpacity,e.fillOpacityOccluded)))),c.constants.add("inner","float",1-(u.outlineSize-u.blurSize)/u.outlineSize),h.add(r.glsl`void main() {
vec4 blurredHighlightValue = texture(tex, uv);
float highlightIntensity = blurredHighlightValue.a;
if (highlightIntensity == 0.0) {
discard;
}
vec4 origin_color = texture(highlightTexture, uv);
float outlineIntensity;
float fillIntensity;
if (blurredHighlightValue.g > blurredHighlightValue.b) {
outlineIntensity = haloColor.w * opacities[1];
fillIntensity = uColor.w * opacities[3];
}
else {
outlineIntensity = haloColor.w * opacities[0];
fillIntensity = uColor.w * opacities[2];
}
float outlineFactor = smoothstep(0.0, inner, highlightIntensity);
float fillFactor = any(notEqual(origin_color, vec4(0.0, 0.0, 0.0, 0.0))) ? 1.0 : 0.0;
float intensity = outlineIntensity * outlineFactor * (1.0 - fillFactor) + fillIntensity * fillFactor;
fragColor = vec4(mix(haloColor.rgb, uColor.rgb, fillFactor), intensity);
}`),e}const g=t.create(),d=Object.freeze(Object.defineProperty({__proto__:null,build:c},Symbol.toStringTag,{value:"Module"}));e.HighlightApply=d,e.build=c}));
