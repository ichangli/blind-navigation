/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../views/3d/webgl-engine/core/shaderLibrary/ForwardLinearDepth.glsl","../views/3d/webgl-engine/core/shaderLibrary/Offset.glsl","../views/3d/webgl-engine/core/shaderLibrary/ShaderOutput","../views/3d/webgl-engine/core/shaderLibrary/Slice.glsl","../views/3d/webgl-engine/core/shaderLibrary/Transform.glsl","../views/3d/webgl-engine/core/shaderLibrary/attributes/InstancedDoublePrecision.glsl","../views/3d/webgl-engine/core/shaderLibrary/attributes/NormalAttribute.glsl","../views/3d/webgl-engine/core/shaderLibrary/attributes/PositionAttribute.glsl","../views/3d/webgl-engine/core/shaderLibrary/attributes/SymbolColor.glsl","../views/3d/webgl-engine/core/shaderLibrary/attributes/TextureCoordinateAttribute.glsl","../views/3d/webgl-engine/core/shaderLibrary/attributes/VertexColor.glsl","../views/3d/webgl-engine/core/shaderLibrary/attributes/VerticalOffset.glsl","../views/3d/webgl-engine/core/shaderLibrary/default/DefaultMaterialAuxiliaryPasses.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/EvaluateAmbientOcclusion.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/EvaluateSceneLighting.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/MainLighting.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/MultipassTerrainTest.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/PhysicallyBasedRendering.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/PhysicallyBasedRenderingParameters.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/ReadShadowMap.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/VisualVariables.glsl","../views/3d/webgl-engine/core/shaderLibrary/util/AlphaCutoff","../views/3d/webgl-engine/core/shaderLibrary/util/AlphaDiscard.glsl","../views/3d/webgl-engine/core/shaderLibrary/util/MixExternalColor.glsl","../views/3d/webgl-engine/core/shaderLibrary/util/View.glsl","../views/3d/webgl-engine/core/shaderModules/Float3PassUniform","../views/3d/webgl-engine/core/shaderModules/Float4PassUniform","../views/3d/webgl-engine/core/shaderModules/FloatPassUniform","../views/3d/webgl-engine/core/shaderModules/interfaces","../views/3d/webgl-engine/core/shaderModules/ShaderBuilder","../views/3d/webgl-engine/core/shaderModules/Texture2DPassUniform","../views/3d/webgl-engine/lib/TransparencyPassType","../views/3d/webgl-engine/lib/VertexAttribute"],(function(e,a,i,r,o,l,t,s,n,d,c,g,b,v,u,h,w,m,p,f,y,x,C,L,P,M,A,O,S,T,E,F,D,B){"use strict";function V(e){const V=new E.ShaderBuilder,{vertex:N,fragment:R,varyings:$}=V;return M.addProjViewLocalOrigin(N,e),V.include(n.PositionAttribute),$.add("vpos","vec3"),V.include(x.VisualVariables,e),V.include(t.InstancedDoublePrecision,e),V.include(b.VerticalOffset,e),e.output===r.ShaderOutput.Color&&(M.addCameraPosition(V.vertex,e),V.include(s.NormalAttribute,e),V.include(l.Transform,e),e.offsetBackfaces&&V.include(i.Offset),e.instancedColor&&V.attributes.add(B.VertexAttribute.INSTANCECOLOR,"vec4"),$.add("vNormalWorld","vec3"),$.add("localvpos","vec3"),e.multipassEnabled&&$.add("depth","float"),V.include(c.TextureCoordinateAttribute,e),V.include(a.ForwardLinearDepth,e),V.include(d.SymbolColor,e),V.include(g.VertexColor,e),N.uniforms.add(new O.Float4PassUniform("externalColor",(e=>e.externalColor))),$.add("vcolorExt","vec4"),N.code.add(T.glsl`
        void main(void) {
          forwardNormalizedVertexColor();
          vcolorExt = externalColor;
          ${e.instancedColor?"vcolorExt *= instanceColor * 0.003921568627451;":""}
          vcolorExt *= vvColor();
          vcolorExt *= getSymbolColor();
          forwardColorMixMode();

          if (vcolorExt.a < ${T.glsl.float(C.symbolAlphaCutoff)}) {
            gl_Position = vec4(1e38, 1e38, 1e38, 1.0);
          } else {
            vpos = getVertexInLocalOriginSpace();
            localvpos = vpos - view[3].xyz;
            vpos = subtractOrigin(vpos);
            vNormalWorld = dpNormal(vvLocalNormal(normalModel()));
            vpos = addVerticalOffset(vpos, localOrigin);
            gl_Position = transformPosition(proj, view, vpos);
            ${e.offsetBackfaces?"gl_Position = offsetBackfacingClipPosition(gl_Position, vpos, vNormalWorld, cameraPosition);":""}
          }
          ${e.multipassEnabled?T.glsl`depth = (view * vec4(vpos, 1.0)).z;`:""}
          forwardLinearDepth();
          forwardTextureCoordinates();
        }
      `)),e.output===r.ShaderOutput.Color&&(V.include(o.SliceDraw,e),V.include(h.EvaluateSceneLighting,e),V.include(u.EvaluateAmbientOcclusion,e),V.include(L.DiscardOrAdjustAlphaPass,e),V.include(e.instancedDoublePrecision?y.ReadShadowMapPass:y.ReadShadowMapDraw,e),V.include(m.multipassTerrainTest,e),M.addCameraPosition(V.fragment,e),w.addMainLightDirection(R),h.addAmbientBoostFactor(R),h.addLightingGlobalFactor(R),R.uniforms.add(N.uniforms.get("localOrigin"),N.uniforms.get("view"),new A.Float3PassUniform("ambient",(e=>e.ambient)),new A.Float3PassUniform("diffuse",(e=>e.diffuse)),new S.FloatPassUniform("opacity",(e=>e.opacity)),new S.FloatPassUniform("layerOpacity",(e=>e.layerOpacity))),e.hasColorTexture&&R.uniforms.add(new F.Texture2DPassUniform("tex",(e=>e.texture))),V.include(f.PhysicallyBasedRenderingParameters,e),V.include(p.PhysicallyBasedRendering,e),R.include(P.MixExternalColor),e.transparencyPassType===D.TransparencyPassType.ColorAlpha&&(V.outputs.add("fragColor","vec4",0),V.outputs.add("fragAlpha","float",1)),w.addMainLightIntensity(R),R.code.add(T.glsl`
      void main() {
        discardBySlice(vpos);
        ${e.multipassEnabled?T.glsl`terrainDepthTest(depth);`:""}
        ${e.hasColorTexture?T.glsl`
                vec4 texColor = texture(tex, ${e.hasColorTextureTransform?T.glsl`colorUV`:T.glsl`vuv0`});
                ${e.textureAlphaPremultiplied?"texColor.rgb /= texColor.a;":""}
                discardOrAdjustAlpha(texColor);`:T.glsl`vec4 texColor = vec4(1.0);`}
        vec3 viewDirection = normalize(vpos - cameraPosition);
        ${e.pbrMode===f.PBRMode.Normal?"applyPBRFactors();":""}
        float ssao = evaluateAmbientOcclusionInverse();
        ssao *= getBakedOcclusion();

        float additionalAmbientScale = additionalDirectedAmbientLight(vpos + localOrigin);
        vec3 additionalLight = ssao * mainLightIntensity * additionalAmbientScale * ambientBoostFactor * lightingGlobalFactor;
        ${e.receiveShadows?"float shadow = readShadowMap(vpos, linearDepth);":e.spherical?"float shadow = lightingGlobalFactor * (1.0 - additionalAmbientScale);":"float shadow = 0.0;"}
        vec3 matColor = max(ambient, diffuse);
        ${e.hasVertexColors?T.glsl`
                vec3 albedo = mixExternalColor(vColor.rgb * matColor, texColor.rgb, vcolorExt.rgb, int(colorMixMode));
                float opacity_ = layerOpacity * mixExternalOpacity(vColor.a * opacity, texColor.a, vcolorExt.a, int(colorMixMode));`:T.glsl`
                vec3 albedo = mixExternalColor(matColor, texColor.rgb, vcolorExt.rgb, int(colorMixMode));
                float opacity_ = layerOpacity * mixExternalOpacity(opacity, texColor.a, vcolorExt.a, int(colorMixMode));`}
        ${e.snowCover?T.glsl`albedo = mix(albedo, vec3(1), 0.9);`:T.glsl``}
        ${T.glsl`
            vec3 shadingNormal = normalize(vNormalWorld);
            albedo *= 1.2;
            vec3 viewForward = vec3(view[0][2], view[1][2], view[2][2]);
            float alignmentLightView = clamp(dot(viewForward, -mainLightDirection), 0.0, 1.0);
            float transmittance = 1.0 - clamp(dot(viewForward, shadingNormal), 0.0, 1.0);
            float treeRadialFalloff = vColor.r;
            float backLightFactor = 0.5 * treeRadialFalloff * alignmentLightView * transmittance * (1.0 - shadow);
            additionalLight += backLightFactor * mainLightIntensity;`}
        ${e.pbrMode===f.PBRMode.Normal||e.pbrMode===f.PBRMode.Schematic?e.spherical?T.glsl`vec3 normalGround = normalize(vpos + localOrigin);`:T.glsl`vec3 normalGround = vec3(0.0, 0.0, 1.0);`:T.glsl``}
        ${e.pbrMode===f.PBRMode.Normal||e.pbrMode===f.PBRMode.Schematic?T.glsl`
                float additionalAmbientIrradiance = additionalAmbientIrradianceFactor * mainLightIntensity[2];
                ${e.snowCover?T.glsl`
                        mrr = vec3(0.0, 1.0, 0.04);
                        emission = vec3(0.0);`:""}

                vec3 shadedColor = evaluateSceneLightingPBR(shadingNormal, albedo, shadow, 1.0 - ssao, additionalLight, viewDirection, normalGround, mrr, emission, additionalAmbientIrradiance);`:T.glsl`vec3 shadedColor = evaluateSceneLighting(shadingNormal, albedo, shadow, 1.0 - ssao, additionalLight);`}
        fragColor = highlightSlice(vec4(shadedColor, opacity_), vpos);
        ${e.transparencyPassType===D.TransparencyPassType.ColorAlpha?T.glsl`
                fragColor = premultiplyAlpha(fragColor);
                fragAlpha = fragColor.a;`:""}
      }
    `)),V.include(v.DefaultMaterialAuxiliaryPasses,e),V}const N=Object.freeze(Object.defineProperty({__proto__:null,build:V},Symbol.toStringTag,{value:"Module"}));e.RealisticTree=N,e.build=V}));
