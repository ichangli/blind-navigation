/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../core/libs/gl-matrix-2/factories/vec3f64","../views/3d/webgl-engine/core/shaderLibrary/ScreenSpacePass.glsl","../views/3d/webgl-engine/core/shaderModules/Float3PassUniform","../views/3d/webgl-engine/core/shaderModules/interfaces","../views/3d/webgl-engine/core/shaderModules/ShaderBuilder","../views/3d/webgl-engine/core/shaderModules/Texture2DPassUniform"],(function(e,r,s,o,n,t,a){"use strict";class l extends n.NoParameters{constructor(){super(...arguments),this.color=r.fromValues(1,1,1)}}function i(){const e=new t.ShaderBuilder;return e.include(s.ScreenSpacePass),e.fragment.uniforms.add(new a.Texture2DPassUniform("tex",(e=>e.texture)),new o.Float3PassUniform("uColor",(e=>e.color))),e.fragment.code.add(n.glsl`void main() {
vec4 texColor = texture(tex, uv);
fragColor = texColor * vec4(uColor, 1.0);
}`),e}const d=Object.freeze(Object.defineProperty({__proto__:null,TextureOnlyPassParameters:l,build:i},Symbol.toStringTag,{value:"Module"}));e.TextureOnly=d,e.TextureOnlyPassParameters=l,e.build=i}));
