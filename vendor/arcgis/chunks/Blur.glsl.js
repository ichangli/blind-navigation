/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../views/3d/webgl-engine/core/shaderLibrary/ScreenSpacePass.glsl","../views/3d/webgl-engine/core/shaderModules/interfaces","../views/3d/webgl-engine/core/shaderModules/ShaderBuilder","../views/3d/webgl-engine/core/shaderModules/Texture2DPassUniform"],(function(e,r,t,o,s){"use strict";function u(){const e=new o.ShaderBuilder;return e.include(r.ScreenSpacePass),e.fragment.uniforms.add(new s.Texture2DPassUniform("blendWeightsTexture",(e=>e.inputTexture)),new s.Texture2DPassUniform("colorTexture",(e=>e.color))),e.fragment.code.add(t.glsl`void main() {
vec2 resolution = 1.0 / vec2(textureSize(colorTexture, 0));
vec4 offsets = vec4(uv.x + resolution.x, uv.y, uv.x, uv.y - resolution.y);
vec4 a;
a.rb = texture(blendWeightsTexture, uv).rb;
a.g = texture(blendWeightsTexture, offsets.zw).g;
a.a = texture(blendWeightsTexture, offsets.xy).a;
if ( dot(a, vec4(1.0)) < 1e-5 ) {
fragColor = texture( colorTexture, uv, 0.0 );
} else {
vec2 offset;
offset.x = a.a > a.b ? a.a : -a.b;
offset.y = a.g > a.r ? -a.g : a.r;
if ( abs( offset.x ) > abs( offset.y )) {
offset.y = 0.0;
} else {
offset.x = 0.0;
}
vec4 C = texture( colorTexture, uv, 0.0 );
vec4 Cop = texture( colorTexture, uv + sign( offset ) * resolution.xy, 0.0 );
float s = abs( offset.x ) > abs( offset.y ) ? abs( offset.x ) : abs( offset.y );
fragColor = mix(C, Cop, s);
}
}`),e}const a=Object.freeze(Object.defineProperty({__proto__:null,build:u},Symbol.toStringTag,{value:"Module"}));e.Blur=a,e.build=u}));
