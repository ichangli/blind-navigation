/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../shading/ReadShadowMap.glsl","./BackgroundGrid.glsl","./TileBlendInput","../../shaderModules/interfaces","../../shaderModules/Uniform"],(function(e,t,r,o,n,c){"use strict";class s extends t.ReadShadowMapPassParameters{constructor(){super(...arguments),this.overlayOpacity=1}}function a(e,t){const{vertex:c,fragment:s,varyings:a}=e;a.add("vtc","vec2"),c.uniforms.add(new i("texOffsetAndScale")),s.uniforms.add(new u("tex")),s.uniforms.add(new d("textureOpacities"));const x=t.textureFadingEnabled&&!t.renderOccluded;x&&(c.uniforms.add(new i("nextTexOffsetAndScale")),a.add("nvtc","vec2"),s.uniforms.add(new u("texNext")),s.uniforms.add(new d("nextTexOpacities")),s.uniforms.add(new l("fadeFactor")));const f=t.tileBlendInput===o.TileBlendInput.ColorComposite,v=t.tileBlendInput===o.TileBlendInput.GridComposite;v&&s.include(r.BackgroundGrid),f&&s.uniforms.add(new d("backgroundColor")),c.code.add(n.glsl`
  void forwardTextureCoordinatesWithTransform(in vec2 uv) {
    vtc = uv * texOffsetAndScale.zw + texOffsetAndScale.xy;
    ${x?n.glsl`nvtc = uv * nextTexOffsetAndScale.zw + nextTexOffsetAndScale.xy;`:n.glsl``}
  }`),s.code.add(n.glsl`
    vec4 getColor(vec4 color, vec2 uv, vec3 opacities) {
      ${v||f?n.glsl`
              if (opacities.y <= 0.0) {
                return color * opacities.z * opacities.x;
              }
              vec4 bg = vec4(${f?n.glsl`backgroundColor`:n.glsl`gridColor(uv)`} * opacities.y, opacities.y);
              vec4 layer = color * opacities.z;
              return (bg * (1.0 - layer.a) + layer) * opacities.x;`:n.glsl`return color;`}
    }`),x?s.code.add(n.glsl`vec4 getTileColor() {
vec4 color = getColor(texture(tex, vtc), vtc, textureOpacities);
if (fadeFactor >= 1.0) {
return color;
}
vec4 nextColor = getColor(texture(texNext, nvtc), nvtc, nextTexOpacities);
return mix(nextColor, color, fadeFactor);
}`):s.code.add(n.glsl`vec4 getTileColor() {
return getColor(texture(tex, vtc), vtc, textureOpacities);
}`)}class l extends c.Uniform{constructor(e){super(e,"float")}}class d extends c.Uniform{constructor(e){super(e,"vec3")}}class i extends c.Uniform{constructor(e){super(e,"vec4")}}class u extends c.Uniform{constructor(e){super(e,"sampler2D")}}e.Float3Uniform=d,e.OverlayTerrainPassParameters=s,e.TerrainTexture=a,e.Texture2DUniform=u,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
