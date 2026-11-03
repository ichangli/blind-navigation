/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../output/ReadDepth.glsl","../../shaderModules/interfaces","../../shaderModules/Texture2DPassUniform"],(function(e,t,r,a){"use strict";function n(e,n){if(!n.multipassEnabled)return;e.fragment.include(t.ReadDepth),e.fragment.uniforms.add(new a.Texture2DPassUniform("terrainDepthTexture",((e,t)=>t.multipassTerrain.depth?.attachment)));const s=n.occlusionPass;e.fragment.code.add(r.glsl`
   ${s?"bool":"void"} terrainDepthTest(float fragmentDepth) {
      float depth = texelFetch(terrainDepthTexture, ivec2(gl_FragCoord.xy), 0).r;
      float linearDepth = linearizeDepth(depth);
      ${s?r.glsl`return fragmentDepth < linearDepth && depth < 1.0;`:r.glsl`
          if(fragmentDepth ${n.cullAboveGround?">":"<="} linearDepth){
            discard;
          }`}
    }`)}class s{constructor(){this.cullAboveGround=!1}}e.MultipassTerrainUniforms=s,e.multipassTerrainTest=n,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
