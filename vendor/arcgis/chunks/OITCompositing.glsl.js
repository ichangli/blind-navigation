/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../views/3d/webgl-engine/core/shaderLibrary/ScreenSpacePass.glsl","../views/3d/webgl-engine/core/shaderModules/interfaces","../views/3d/webgl-engine/core/shaderModules/ShaderBuilder","../views/3d/webgl-engine/core/shaderModules/Texture2DPassUniform"],(function(e,r,o,a,s){"use strict";class t extends o.NoParameters{}function n(){const e=new a.ShaderBuilder;return e.include(r.ScreenSpacePass),e.fragment.uniforms.add(new s.Texture2DPassUniform("colorTexture",(e=>e.colorTexture)),new s.Texture2DPassUniform("alphaTexture",(e=>e.alphaTexture)),new s.Texture2DPassUniform("frontFaceTexture",(e=>e.frontFaceTexture))),e.fragment.code.add(o.glsl`void main() {
float srcAlpha = texture(alphaTexture, uv).r;
if(srcAlpha <= 1e-5){
discard;
}
vec4 srcColor = texture(colorTexture, uv);
vec4 frontFace = texture(frontFaceTexture, uv);
fragColor = vec4(mix(srcColor.rgb / srcAlpha, frontFace.rgb, frontFace.a), 1.0 - srcColor.a);
}`),e}const c=Object.freeze(Object.defineProperty({__proto__:null,OITCompositingPassParameters:t,build:n},Symbol.toStringTag,{value:"Module"}));e.OITCompositing=c,e.OITCompositingPassParameters=t,e.build=n}));
