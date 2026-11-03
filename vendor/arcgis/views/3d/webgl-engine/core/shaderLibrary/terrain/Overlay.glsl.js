/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../../../core/libs/gl-matrix-2/factories/vec4f64","../../../../../../geometry/support/aaBoundingRect","../../../../terrain/interfaces","../../../../terrain/OverlayContent","../../renderPasses/AllRenderPasses","../ShaderOutput","../shading/MainLighting.glsl","../shading/PhysicallyBasedRenderingParameters.glsl","../shading/Water.glsl","../../shaderModules/Float4DrawUniform","../../shaderModules/FloatPassUniform","../../shaderModules/interfaces","../../shaderModules/Texture2DPassUniform","../../shaderModules/Uniform"],(function(e,o,r,t,a,l,i,d,n,s,v,c,x,y,u){"use strict";var h;function g(e,o){const{vertex:r,fragment:t}=e;r.uniforms.add(new v.Float4DrawUniform("overlayTexOffset",((e,o)=>M(e,o))),new v.Float4DrawUniform("overlayTexScale",((e,o)=>m(e,o)))),t.constants.add("overlayOpacity","float",1),t.uniforms.add(new y.Texture2DPassUniform("ovColorTex",((e,o)=>O(e,o)))),C(e,o)}function f(e,o){const{vertex:r,fragment:t}=e;r.uniforms.add(new p("overlayTexOffset"),new p("overlayTexScale")),t.uniforms.add(new c.FloatPassUniform("overlayOpacity",(e=>e.overlayOpacity)),new y.Texture2DPassUniform("ovColorTex",((e,o)=>o.overlay?.getTexture(e.overlayContent)))),C(e,o)}e.OverlayMode=void 0,(h=e.OverlayMode||(e.OverlayMode={}))[h.Disabled=0]="Disabled",h[h.Enabled=1]="Enabled",h[h.EnabledWithWater=2]="EnabledWithWater",h[h.COUNT=3]="COUNT";class p extends u.Uniform{constructor(e){super(e,"vec4")}}function C(e,o){o.pbrMode!==n.PBRMode.Water&&o.pbrMode!==n.PBRMode.WaterOnIntegratedMesh&&o.pbrMode!==n.PBRMode.TerrainWithWater||e.include(s.Water,o);const{vertex:r,fragment:t}=e;e.varyings.add("vtcOverlay","vec4"),r.code.add(x.glsl`void setOverlayVTC(in vec2 uv) {
vtcOverlay = vec4(uv, uv) * overlayTexScale + overlayTexOffset;
}`),t.code.add(x.glsl`bool isValid(vec2 uv, vec2 dxdy) {
return (uv.x >= 0.0 + dxdy.x) && (uv.x <= 1.0 - dxdy.x) && (uv.y >= 0.0 + dxdy.y) && (uv.y <= 1.0 - dxdy.y);
}
vec4 getOverlayColor(sampler2D ov0Tex, vec4 texCoords) {
vec4 color0 = texture(ov0Tex, vec2(texCoords.x * 0.5, texCoords.y));
vec4 color1 = texture(ov0Tex, vec2(texCoords.z * 0.5 + 0.5, texCoords.w));
bool isValid0 = isValid(texCoords.xy, fwidth(texCoords.xy));
bool isValid1 = isValid(texCoords.zw, vec2(0.0, 0.0));
return mix(color1 * float(isValid1), color0, float(isValid0));
}`),t.code.add(x.glsl`vec4 getCombinedOverlayColor() {
return overlayOpacity * getOverlayColor(ovColorTex, vtcOverlay);
}`),t.code.add(x.glsl`vec4 getOverlayColorTexel(vec4 texCoords) {
vec2 texDim =  vec2(textureSize(ovColorTex, 0));
vec4 color0 = texelFetch(ovColorTex, ivec2(vec2(texCoords.x * 0.5, texCoords.y) * texDim), 0);
vec4 color1 = texelFetch(ovColorTex, ivec2(vec2(texCoords.z * 0.5 + 0.5, texCoords.w) * texDim), 0);
bool isValid0 = isValid(texCoords.xy, fwidth(texCoords.xy));
bool isValid1 = isValid(texCoords.zw, vec2(0.0, 0.0));
return mix(color1 * float(isValid1), color0, float(isValid0));
}`),o.pbrMode!==n.PBRMode.Water&&o.pbrMode!==n.PBRMode.WaterOnIntegratedMesh&&o.pbrMode!==n.PBRMode.TerrainWithWater||(d.addMainLightDirection(t),d.addMainLightIntensity(t),t.code.add(x.glsl`vec4 getOverlayWaterColor(vec4 maskInput, vec4 colorInput, vec3 vposEyeDir,
float shadow, vec3 localUp, mat3 tbn, vec3 position, vec3 positionWorld) {
vec3 n = normalize(tbn *  (2.0 * maskInput.rgb - vec3(1.0)));
vec3 v = vposEyeDir;
vec3 final = getSeaColor(n, v, mainLightDirection, colorInput.rgb, mainLightIntensity, localUp, 1.0 - shadow, maskInput.w, position, positionWorld);
return vec4(final, colorInput.w);
}`))}function O(e,o){return e.identifier===l.RenderPassIdentifier.Material&&e.output===i.ShaderOutput.Color?o.overlay?.getTexture(a.OverlayContent.ColorNoRasterImage):e.identifier===l.RenderPassIdentifier.Material&&e.output===i.ShaderOutput.ObjectAndLayerIdColor?o.overlay?.getTexture(a.OverlayContent.ObjectAndLayerIdColor):e.identifier===l.RenderPassIdentifier.Highlight?o.overlay?.getTexture(a.OverlayContent.Highlight):null}function M(e,o){const a=o.overlay?.overlays[t.OverlayIndex.INNER]?.extent;r.hasArea(a)&&(T[0]=e.toMapSpace[0]/r.width(a)-a[0]/r.width(a),T[1]=e.toMapSpace[1]/r.height(a)-a[1]/r.height(a));const l=o.overlay?.overlays[t.OverlayIndex.OUTER]?.extent;return r.hasArea(l)&&(T[2]=e.toMapSpace[0]/r.width(l)-l[0]/r.width(l),T[3]=e.toMapSpace[1]/r.height(l)-l[1]/r.height(l)),T}function m(e,o){const a=o.overlay?.overlays[t.OverlayIndex.INNER]?.extent;r.hasArea(a)&&(T[0]=e.toMapSpace[2]/r.width(a),T[1]=e.toMapSpace[3]/r.height(a));const l=o.overlay?.overlays[t.OverlayIndex.OUTER]?.extent;return r.hasArea(l)&&(T[2]=e.toMapSpace[2]/r.width(l),T[3]=e.toMapSpace[3]/r.height(l)),T}const T=o.create();e.OverlayIM=g,e.OverlayTerrain=f,e.getIMColorTexture=O,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
