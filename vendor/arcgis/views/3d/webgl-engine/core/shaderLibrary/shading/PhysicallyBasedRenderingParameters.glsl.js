/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../attributes/VertexTextureCoordinates.glsl","../../shaderModules/Float3DrawUniform","../../shaderModules/Float3PassUniform","../../shaderModules/interfaces","../../shaderModules/Texture2DDrawUniform","../../shaderModules/Texture2DPassUniform","../../shaderTechnique/BindType","../../../lib/GLTextureMaterial"],(function(e,s,r,o,i,a,t,l,n){"use strict";var u;e.PBRMode=void 0,(u=e.PBRMode||(e.PBRMode={}))[u.Disabled=0]="Disabled",u[u.Normal=1]="Normal",u[u.Schematic=2]="Schematic",u[u.Water=3]="Water",u[u.WaterOnIntegratedMesh=4]="WaterOnIntegratedMesh",u[u.Simplified=5]="Simplified",u[u.TerrainWithWater=6]="TerrainWithWater",u[u.COUNT=7]="COUNT";class c extends n.GLTextureMaterialBindParameters{}function d(n,u){const c=n.fragment,d=u.hasMetallicRoughnessTexture||u.hasEmissionTexture||u.hasOcclusionTexture;if(u.pbrMode===e.PBRMode.Normal&&d&&n.include(s.VertexTextureCoordinates,u),u.pbrMode!==e.PBRMode.Schematic)if(u.pbrMode!==e.PBRMode.Disabled){if(u.pbrMode===e.PBRMode.Normal){c.code.add(i.glsl`vec3 mrr;
vec3 emission;
float occlusion;`);const e=u.pbrTextureBindType;u.hasMetallicRoughnessTexture&&(c.uniforms.add(e===l.BindType.Pass?new t.Texture2DPassUniform("texMetallicRoughness",(e=>e.textureMetallicRoughness)):new a.Texture2DDrawUniform("texMetallicRoughness",(e=>e.textureMetallicRoughness))),c.code.add(i.glsl`void applyMetallnessAndRoughness(vec2 uv) {
vec3 metallicRoughness = textureLookup(texMetallicRoughness, uv).rgb;
mrr[0] *= metallicRoughness.b;
mrr[1] *= metallicRoughness.g;
}`)),u.hasEmissionTexture&&(c.uniforms.add(e===l.BindType.Pass?new t.Texture2DPassUniform("texEmission",(e=>e.textureEmissive)):new a.Texture2DDrawUniform("texEmission",(e=>e.textureEmissive))),c.code.add(i.glsl`void applyEmission(vec2 uv) {
emission *= textureLookup(texEmission, uv).rgb;
}`)),u.hasOcclusionTexture?(c.uniforms.add(e===l.BindType.Pass?new t.Texture2DPassUniform("texOcclusion",(e=>e.textureOcclusion)):new a.Texture2DDrawUniform("texOcclusion",(e=>e.textureOcclusion))),c.code.add(i.glsl`void applyOcclusion(vec2 uv) {
occlusion *= textureLookup(texOcclusion, uv).r;
}
float getBakedOcclusion() {
return occlusion;
}`)):c.code.add(i.glsl`float getBakedOcclusion() { return 1.0; }`),e===l.BindType.Pass?c.uniforms.add(new o.Float3PassUniform("emissionFactor",(e=>e.emissiveFactor)),new o.Float3PassUniform("mrrFactors",(e=>e.mrrFactors))):c.uniforms.add(new r.Float3DrawUniform("emissionFactor",(e=>e.emissiveFactor)),new r.Float3DrawUniform("mrrFactors",(e=>e.mrrFactors))),c.code.add(i.glsl`
    void applyPBRFactors() {
      mrr = mrrFactors;
      emission = emissionFactor;
      occlusion = 1.0;

      ${u.hasMetallicRoughnessTexture?i.glsl`applyMetallnessAndRoughness(${u.hasMetallicRoughnessTextureTransform?i.glsl`metallicRoughnessUV`:"vuv0"});`:""}

      ${u.hasEmissionTexture?i.glsl`applyEmission(${u.hasEmissiveTextureTransform?i.glsl`emissiveUV`:"vuv0"});`:""}

      ${u.hasOcclusionTexture?i.glsl`applyOcclusion(${u.hasOcclusionTextureTransform?i.glsl`occlusionUV`:"vuv0"});`:""}
    }
  `)}}else c.code.add(i.glsl`float getBakedOcclusion() { return 1.0; }`);else c.code.add(i.glsl`vec3 mrr = vec3(0.0, 0.6, 0.2);
vec3 emission = vec3(0.0);
float occlusion = 1.0;
void applyPBRFactors() {}
float getBakedOcclusion() { return 1.0; }`)}e.PBRBindParameters=c,e.PhysicallyBasedRenderingParameters=d,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
