/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../views/3d/terrain/interfaces","../views/3d/webgl-engine/core/shaderLibrary/ScreenSpacePass.glsl","../views/3d/webgl-engine/core/shaderModules/FloatPassUniform","../views/3d/webgl-engine/core/shaderModules/IntegerPassUniform","../views/3d/webgl-engine/core/shaderModules/interfaces","../views/3d/webgl-engine/core/shaderModules/ShaderBuilder","../views/3d/webgl-engine/core/shaderModules/Texture2DPassUniform"],(function(e,r,s,a,n,o,i,t){"use strict";class d extends o.NoParameters{constructor(){super(...arguments),this.overlayIndex=r.OverlayIndex.INNER,this.opacity=1}}function l(){const e=new i.ShaderBuilder;return e.include(s.ScreenSpacePass),e.fragment.uniforms.add(new t.Texture2DPassUniform("tex",(e=>e.texture))),e.fragment.uniforms.add(new n.IntegerPassUniform("overlayIdx",(e=>e.overlayIndex))),e.fragment.uniforms.add(new a.FloatPassUniform("opacity",(e=>e.opacity))),e.fragment.code.add(o.glsl`void main() {
vec2 overlayUV = overlayIdx == 0 ? vec2(uv.x * 0.5, uv.y) : vec2(uv.x * 0.5 + 0.5, uv.y);
fragColor = texture(tex, overlayUV) * opacity;
}`),e}const c=Object.freeze(Object.defineProperty({__proto__:null,OverlayCompositingPassParameters:d,build:l},Symbol.toStringTag,{value:"Module"}));e.OverlayCompositing=c,e.OverlayCompositingPassParameters=d,e.build=l}));
