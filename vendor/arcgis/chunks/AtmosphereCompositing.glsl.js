/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../views/3d/webgl-engine/core/shaderLibrary/ScreenSpacePass.glsl","../views/3d/webgl-engine/core/shaderModules/interfaces","../views/3d/webgl-engine/core/shaderModules/ShaderBuilder","../views/3d/webgl-engine/core/shaderModules/Texture2DPassUniform"],(function(e,r,s,o,t){"use strict";class n extends s.NoParameters{}function a(e){const n=new o.ShaderBuilder;n.include(r.ScreenSpacePass),n.fragment.uniforms.add(new t.Texture2DPassUniform("colorTexture",(e=>e.color)),new t.Texture2DPassUniform("depthTexture",(e=>e.depth)));const a=e.haze;return n.fragment.code.add(s.glsl`
    void main() {
      float depthSample = texture(depthTexture, uv).r;
      if (depthSample ${a?s.glsl`== 1.0`:s.glsl`!= 1.0`} ) {
          fragColor = vec4(0);
          return;
      }
      fragColor = texture(colorTexture, uv);
    }
    `),n}const i=Object.freeze(Object.defineProperty({__proto__:null,AtmosphereCompositingPassParameters:n,build:a},Symbol.toStringTag,{value:"Module"}));e.AtmosphereCompositing=i,e.AtmosphereCompositingPassParameters=n,e.build=a}));
