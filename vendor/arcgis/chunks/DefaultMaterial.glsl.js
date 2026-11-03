/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../views/3d/webgl-engine/core/shaderLibrary/ForwardLinearDepth.glsl","../views/3d/webgl-engine/core/shaderLibrary/Offset.glsl","../views/3d/webgl-engine/core/shaderLibrary/ShaderOutput","../views/3d/webgl-engine/core/shaderLibrary/Slice.glsl","../views/3d/webgl-engine/core/shaderLibrary/Transform.glsl","../views/3d/webgl-engine/core/shaderLibrary/attributes/InstancedDoublePrecision.glsl","../views/3d/webgl-engine/core/shaderLibrary/attributes/NormalAttribute.glsl","../views/3d/webgl-engine/core/shaderLibrary/attributes/PositionAttribute.glsl","../views/3d/webgl-engine/core/shaderLibrary/attributes/SymbolColor.glsl","../views/3d/webgl-engine/core/shaderLibrary/attributes/TextureCoordinateAttribute.glsl","../views/3d/webgl-engine/core/shaderLibrary/attributes/VertexColor.glsl","../views/3d/webgl-engine/core/shaderLibrary/attributes/VertexNormal.glsl","../views/3d/webgl-engine/core/shaderLibrary/attributes/VerticalOffset.glsl","../views/3d/webgl-engine/core/shaderLibrary/default/DefaultMaterialAuxiliaryPasses.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/ComputeNormalTexture.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/EvaluateAmbientOcclusion.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/EvaluateSceneLighting.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/MainLighting.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/MultipassTerrainTest.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/Normals.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/PhysicallyBasedRendering.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/PhysicallyBasedRenderingParameters.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/ReadShadowMap.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/TextureTransformUV.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/VisualVariables.glsl","../views/3d/webgl-engine/core/shaderLibrary/util/AlphaCutoff","../views/3d/webgl-engine/core/shaderLibrary/util/AlphaDiscard.glsl","../views/3d/webgl-engine/core/shaderLibrary/util/MixExternalColor.glsl","../views/3d/webgl-engine/core/shaderLibrary/util/View.glsl","../views/3d/webgl-engine/core/shaderModules/Float3PassUniform","../views/3d/webgl-engine/core/shaderModules/Float4PassUniform","../views/3d/webgl-engine/core/shaderModules/FloatPassUniform","../views/3d/webgl-engine/core/shaderModules/interfaces","../views/3d/webgl-engine/core/shaderModules/ShaderBuilder","../views/3d/webgl-engine/core/shaderModules/Texture2DPassUniform","../views/3d/webgl-engine/lib/TransparencyPassType","../views/3d/webgl-engine/lib/VertexAttribute"],(function(e,a,r,o,l,i,s,n,t,d,c,g,u,m,b,v,h,w,p,f,x,y,C,P,L,T,M,A,V,N,S,O,E,U,D,$,B,F){"use strict";function R(e){const R=new D.ShaderBuilder,{vertex:I,fragment:_,varyings:j}=R;if(N.addProjViewLocalOrigin(I,e),R.include(t.PositionAttribute),j.add("vpos","vec3"),R.include(T.VisualVariables,e),R.include(s.InstancedDoublePrecision,e),R.include(m.VerticalOffset,e),R.include(L.colorTextureUV,e),e.output===o.ShaderOutput.Color){R.include(L.normalTextureUV,e),R.include(L.emissiveTextureUV,e),R.include(L.occlusionTextureUV,e),R.include(L.metallicRoughnessTextureUV,e),N.addCameraPosition(I,e),R.include(n.NormalAttribute,e),R.include(i.Transform,e);const o=e.normalType===n.NormalType.Attribute||e.normalType===n.NormalType.Compressed;o&&e.offsetBackfaces&&R.include(r.Offset),R.include(v.ComputeNormalTexture,e),R.include(u.VertexNormal,e),e.instancedColor&&R.attributes.add(F.VertexAttribute.INSTANCECOLOR,"vec4"),j.add("vPositionLocal","vec3"),R.include(c.TextureCoordinateAttribute,e),R.include(a.ForwardLinearDepth,e),R.include(d.SymbolColor,e),R.include(g.VertexColor,e),I.uniforms.add(new O.Float4PassUniform("externalColor",(e=>e.externalColor))),j.add("vcolorExt","vec4"),e.multipassEnabled&&j.add("depth","float"),I.code.add(U.glsl`
      void main(void) {
        forwardNormalizedVertexColor();
        vcolorExt = externalColor;
        ${e.instancedColor?"vcolorExt *= instanceColor * 0.003921568627451;":""}
        vcolorExt *= vvColor();
        vcolorExt *= getSymbolColor();
        forwardColorMixMode();

        if (vcolorExt.a < ${U.glsl.float(M.symbolAlphaCutoff)}) {
          gl_Position = vec4(1e38, 1e38, 1e38, 1.0);
        } else {
          vpos = getVertexInLocalOriginSpace();
          vPositionLocal = vpos - view[3].xyz;
          vpos = subtractOrigin(vpos);
          ${o?U.glsl`vNormalWorld = dpNormal(vvLocalNormal(normalModel()));`:""}
          vpos = addVerticalOffset(vpos, localOrigin);
          ${e.hasVertexTangents?"vTangent = dpTransformVertexTangent(tangent);":""}
          gl_Position = transformPosition(proj, view, vpos);
          ${o&&e.offsetBackfaces?"gl_Position = offsetBackfacingClipPosition(gl_Position, vpos, vNormalWorld, cameraPosition);":""}
        }

        ${e.multipassEnabled?"depth = (view * vec4(vpos, 1.0)).z;":""}
        forwardLinearDepth();
        forwardTextureCoordinates();
        forwardColorUV();
        forwardNormalUV();
        forwardEmissiveUV();
        forwardOcclusionUV();
        forwardMetallicRoughnessUV();
      }
    `),R.include(l.SliceDraw,e),R.include(w.EvaluateSceneLighting,e),R.include(h.EvaluateAmbientOcclusion,e),R.include(A.DiscardOrAdjustAlphaPass,e),R.include(e.instancedDoublePrecision?P.ReadShadowMapPass:P.ReadShadowMapDraw,e),R.include(f.multipassTerrainTest,e),N.addCameraPosition(_,e),_.uniforms.add(I.uniforms.get("localOrigin"),new S.Float3PassUniform("ambient",(e=>e.ambient)),new S.Float3PassUniform("diffuse",(e=>e.diffuse)),new E.FloatPassUniform("opacity",(e=>e.opacity)),new E.FloatPassUniform("layerOpacity",(e=>e.layerOpacity))),e.hasColorTexture&&_.uniforms.add(new $.Texture2DPassUniform("tex",(e=>e.texture))),R.include(C.PhysicallyBasedRenderingParameters,e),R.include(y.PhysicallyBasedRendering,e),_.include(V.MixExternalColor),R.include(x.Normals,e),w.addAmbientBoostFactor(_),w.addLightingGlobalFactor(_),p.addMainLightIntensity(_),e.transparencyPassType===B.TransparencyPassType.ColorAlpha&&(R.outputs.add("fragColor","vec4",0),R.outputs.add("fragAlpha","float",1)),_.code.add(U.glsl`
      void main() {
        discardBySlice(vpos);
        ${e.multipassEnabled?"terrainDepthTest(depth);":""}
        ${e.hasColorTexture?U.glsl`
                vec4 texColor = texture(tex, ${e.hasColorTextureTransform?U.glsl`colorUV`:U.glsl`vuv0`});
                ${e.textureAlphaPremultiplied?"texColor.rgb /= texColor.a;":""}
                discardOrAdjustAlpha(texColor);`:U.glsl`vec4 texColor = vec4(1.0);`}
        shadingParams.viewDirection = normalize(vpos - cameraPosition);
        ${e.normalType===n.NormalType.ScreenDerivative?U.glsl`
                vec3 normal = screenDerivativeNormal(vPositionLocal);`:U.glsl`
                shadingParams.normalView = vNormalWorld;
                vec3 normal = shadingNormal(shadingParams);`}
        ${e.pbrMode===C.PBRMode.Normal?"applyPBRFactors();":""}
        float ssao = evaluateAmbientOcclusionInverse() * getBakedOcclusion();

        vec3 posWorld = vpos + localOrigin;

        float additionalAmbientScale = additionalDirectedAmbientLight(posWorld);
        float shadow = ${e.receiveShadows?"readShadowMap(vpos, linearDepth)":e.spherical?"lightingGlobalFactor * (1.0 - additionalAmbientScale)":"0.0"};

        vec3 matColor = max(ambient, diffuse);
        ${e.hasVertexColors?U.glsl`
                vec3 albedo = mixExternalColor(vColor.rgb * matColor, texColor.rgb, vcolorExt.rgb, int(colorMixMode));
                float opacity_ = layerOpacity * mixExternalOpacity(vColor.a * opacity, texColor.a, vcolorExt.a, int(colorMixMode));`:U.glsl`
                vec3 albedo = mixExternalColor(matColor, texColor.rgb, vcolorExt.rgb, int(colorMixMode));
                float opacity_ = layerOpacity * mixExternalOpacity(opacity, texColor.a, vcolorExt.a, int(colorMixMode));`}
        ${e.hasNormalTexture?U.glsl`
                mat3 tangentSpace = ${e.hasVertexTangents?"computeTangentSpace(normal);":"computeTangentSpace(normal, vpos, vuv0);"}
                vec3 shadingNormal = computeTextureNormal(tangentSpace, ${e.hasNormalTextureTransform?U.glsl`normalUV`:"vuv0"});`:U.glsl`vec3 shadingNormal = normal;`}
        vec3 normalGround = ${e.spherical?U.glsl`normalize(posWorld);`:U.glsl`vec3(0.0, 0.0, 1.0);`}

        ${e.snowCover?U.glsl`
                float snow = smoothstep(0.5, 0.55, dot(normal, normalGround));
                albedo = mix(albedo, vec3(1), snow);
                shadingNormal = mix(shadingNormal, normal, snow);
                ssao = mix(ssao, 1.0, snow);`:""}

        vec3 additionalLight = ssao * mainLightIntensity * additionalAmbientScale * ambientBoostFactor * lightingGlobalFactor;

        ${e.pbrMode===C.PBRMode.Normal||e.pbrMode===C.PBRMode.Schematic?U.glsl`
                float additionalAmbientIrradiance = additionalAmbientIrradianceFactor * mainLightIntensity[2];
                ${e.snowCover?U.glsl`
                        mrr = mix(mrr, vec3(0.0, 1.0, 0.04), snow);
                        emission = mix(emission, vec3(0.0), snow);`:""}

                vec3 shadedColor = evaluateSceneLightingPBR(shadingNormal, albedo, shadow, 1.0 - ssao, additionalLight, shadingParams.viewDirection, normalGround, mrr, emission, additionalAmbientIrradiance);`:U.glsl`vec3 shadedColor = evaluateSceneLighting(shadingNormal, albedo, shadow, 1.0 - ssao, additionalLight);`}
        fragColor = highlightSlice(vec4(shadedColor, opacity_), vpos);
        ${e.transparencyPassType===B.TransparencyPassType.ColorAlpha?U.glsl`
                  fragColor = premultiplyAlpha(fragColor);
                  fragAlpha = fragColor.a;`:""}
      }
    `)}return R.include(b.DefaultMaterialAuxiliaryPasses,e),R}const I=Object.freeze(Object.defineProperty({__proto__:null,build:R},Symbol.toStringTag,{value:"Module"}));e.DefaultMaterial=I,e.build=R}));
