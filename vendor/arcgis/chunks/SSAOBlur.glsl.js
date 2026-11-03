/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./vec32","../views/3d/webgl-engine/core/shaderLibrary/ScreenSpacePass.glsl","../views/3d/webgl-engine/core/shaderLibrary/output/ReadDepth.glsl","../views/3d/webgl-engine/core/shaderModules/Float2DrawUniform","../views/3d/webgl-engine/core/shaderModules/FloatPassUniform","../views/3d/webgl-engine/core/shaderModules/interfaces","../views/3d/webgl-engine/core/shaderModules/ShaderBuilder","../views/3d/webgl-engine/core/shaderModules/Texture2DDrawUniform","../views/3d/webgl-engine/core/shaderModules/Texture2DPassUniform"],(function(e,r,t,a,o,l,n,s,d,i){"use strict";const u=4;function f(){const e=new s.ShaderBuilder,f=e.fragment;e.include(t.ScreenSpacePass);const c=(u+1)/2,w=1/(2*c*c);return f.include(a.ReadDepth),f.uniforms.add(new i.Texture2DPassUniform("depthMap",(e=>e.depthTexture)),new d.Texture2DDrawUniform("tex",(e=>e.colorTexture)),new o.Float2DrawUniform("blurSize",(e=>e.blurSize)),new l.FloatPassUniform("projScale",((e,t)=>{const a=r.distance(t.camera.eye,t.camera.center);return a>5e4?Math.max(0,e.projScale-(a-5e4)):e.projScale}))),f.code.add(n.glsl`
    void blurFunction(vec2 uv, float r, float center_d, float sharpness, inout float wTotal, inout float bTotal) {
      float c = texture(tex, uv).r;
      float d = linearDepthFromTexture(depthMap, uv);

      float ddiff = d - center_d;

      float w = exp(-r * r * ${n.glsl.float(w)} - ddiff * ddiff * sharpness);
      wTotal += w;
      bTotal += w * c;
    }
  `),e.outputs.add("fragBlur","float"),f.code.add(n.glsl`
    void main(void) {
      float b = 0.0;
      float w_total = 0.0;

      float center_d = linearDepthFromTexture(depthMap, uv);

      float sharpness = -0.05 * projScale / center_d;
      for (int r = -${n.glsl.int(u)}; r <= ${n.glsl.int(u)}; ++r) {
        float rf = float(r);
        vec2 uvOffset = uv + rf * blurSize;
        blurFunction(uvOffset, rf, center_d, sharpness, w_total, b);
      }

      fragBlur = b / w_total;
    }
  `),e}const c=Object.freeze(Object.defineProperty({__proto__:null,build:f},Symbol.toStringTag,{value:"Module"}));e.SSAOBlur=c,e.build=f}));
