/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../views/3d/webgl-engine/core/shaderLibrary/ScreenSpacePass.glsl","../views/3d/webgl-engine/core/shaderModules/interfaces","../views/3d/webgl-engine/core/shaderModules/ShaderBuilder","../views/3d/webgl-engine/core/shaderModules/Texture2DPassUniform"],(function(e,r,s,n,a){"use strict";class i extends s.NoParameters{}function o(){const e=new n.ShaderBuilder;return e.include(r.ScreenSpacePass),e.fragment.uniforms.add(new a.Texture2DPassUniform("tex",(e=>e.texture))),e.fragment.code.add(s.glsl`void main() {
fragColor = vec4(1.0 - texture(tex, uv).a);
}`),e}const t=Object.freeze(Object.defineProperty({__proto__:null,HUDCompositingPassParameters:i,build:o},Symbol.toStringTag,{value:"Module"}));e.HUDCompositing=t,e.HUDCompositingPassParameters=i,e.build=o}));
