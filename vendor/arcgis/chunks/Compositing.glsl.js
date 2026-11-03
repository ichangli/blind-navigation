/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../views/3d/webgl-engine/core/shaderLibrary/ScreenSpacePass.glsl","../views/3d/webgl-engine/core/shaderLibrary/output/ReadDepth.glsl","../views/3d/webgl-engine/core/shaderLibrary/util/RgbaFloatEncoding.glsl","../views/3d/webgl-engine/core/shaderModules/Float2PassUniform","../views/3d/webgl-engine/core/shaderModules/FloatPassUniform","../views/3d/webgl-engine/core/shaderModules/interfaces","../views/3d/webgl-engine/core/shaderModules/ShaderBuilder","../views/3d/webgl-engine/core/shaderModules/Texture2DPassUniform"],(function(e,r,a,n,s,i,t,o,l){"use strict";class d extends t.NoParameters{constructor(){super(...arguments),this.opacity=1}}function g(e){const d=new o.ShaderBuilder;return d.include(r.ScreenSpacePass),d.fragment.uniforms.add(new l.Texture2DPassUniform("tex",(e=>e.texture))),e.hasOpacityFactor&&d.fragment.uniforms.add(new i.FloatPassUniform("opacity",(e=>e.opacity))),e.isDepthBlit&&(d.fragment.uniforms.add(new s.Float2PassUniform("nearFar",((e,r)=>r.camera.nearFar))),d.fragment.include(a.ReadDepth),d.fragment.include(n.RgbaFloatEncoding)),d.fragment.code.add(t.glsl`
    void main() {
      ${e.isDepthBlit?t.glsl`
              float normalizedLinearDepth = (-linearDepthFromTexture(tex, uv) - nearFar[0]) / (nearFar[1] - nearFar[0]);
              fragColor = float2rgba(normalizedLinearDepth);`:t.glsl`
              fragColor = texture(tex, uv) ${e.hasOpacityFactor?"* opacity":""};`}
    }`),d}const c=Object.freeze(Object.defineProperty({__proto__:null,CompositingPassParameters:d,build:g},Symbol.toStringTag,{value:"Module"}));e.Compositing=c,e.CompositingPassParameters=d,e.build=g}));
