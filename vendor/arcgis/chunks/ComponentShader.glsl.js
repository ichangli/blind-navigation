/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../geometry/support/Ellipsoid","../views/3d/terrain/OverlayContent","../views/3d/webgl-engine/collections/Component/Material/ComponentTechniqueConfiguration","../views/3d/webgl-engine/collections/Component/Material/shader/ComponentData.glsl","../views/3d/webgl-engine/collections/Component/Material/shader/VertexDiscardByOpacity.glsl","../views/3d/webgl-engine/core/shaderLibrary/ForwardLinearDepth.glsl","../views/3d/webgl-engine/core/shaderLibrary/ShaderOutput","../views/3d/webgl-engine/core/shaderLibrary/Slice.glsl","../views/3d/webgl-engine/core/shaderLibrary/attributes/NormalAttribute.glsl","../views/3d/webgl-engine/core/shaderLibrary/attributes/TextureCoordinateAttribute.glsl","../views/3d/webgl-engine/core/shaderLibrary/attributes/VertexColor.glsl","../views/3d/webgl-engine/core/shaderLibrary/attributes/VertexNormal.glsl","../views/3d/webgl-engine/core/shaderLibrary/attributes/VertexPosition.glsl","../views/3d/webgl-engine/core/shaderLibrary/output/OutputDepth.glsl","../views/3d/webgl-engine/core/shaderLibrary/output/OutputHighlight.glsl","../views/3d/webgl-engine/core/shaderLibrary/output/ReadDepth.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/ComputeMaterialColor.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/ComputeNormalTexture.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/ComputeShadingNormal.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/EvaluateSceneLighting.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/MainLighting.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/MultipassTerrainTest.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/PhysicallyBasedRenderingParameters.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/ReadBaseColorTexture.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/ReadShadowMap.glsl","../views/3d/webgl-engine/core/shaderLibrary/terrain/Overlay.glsl","../views/3d/webgl-engine/core/shaderLibrary/util/AlphaCutoff","../views/3d/webgl-engine/core/shaderLibrary/util/AlphaDiscard.glsl","../views/3d/webgl-engine/core/shaderLibrary/util/EllipsoidMode","../views/3d/webgl-engine/core/shaderModules/interfaces","../views/3d/webgl-engine/core/shaderModules/ShaderBuilder","../views/3d/webgl-engine/core/shaderModules/Texture2DPassUniform","../views/3d/webgl-engine/lib/TransparencyPassType"],(function(e,a,o,r,l,t,i,d,n,s,g,c,u,h,v,m,p,C,w,b,y,x,f,S,M,O,L,T,N,P,A,B,W,R){"use strict";function D(e){const D=new B.ShaderBuilder;D.include(h.VertexPosition,e),D.include(u.VertexNormal,e),D.include(c.VertexColor,e),D.include(g.TextureCoordinateAttribute,e),D.include(i.ForwardLinearDepth,e),D.include(l.ComponentData,e),D.include(N.DiscardOrAdjustAlphaDraw,e),D.include(n.SlicePass,e),D.include(M.ReadBaseColorTexture,e),D.include(t.VertexDiscardByOpacity,e);const{vertex:$,fragment:j}=D;e.pbrMode!==S.PBRMode.Normal&&e.pbrMode!==S.PBRMode.Schematic||(D.include(S.PhysicallyBasedRenderingParameters,e),e.hasNormalTexture&&D.include(w.ComputeNormalTexture,e));const z=e.output===d.ShaderOutput.Shadow||e.output===d.ShaderOutput.ShadowHighlight||e.output===d.ShaderOutput.ShadowExcludeHighlight;z&&e.componentData===l.ComponentDataType.Varying?$.code.add(A.glsl`#define discardShadows(castShadows) { if(!castShadows) { gl_Position = vec4(1e38, 1e38, 1e38, 1.0); return; } }`):$.code.add(A.glsl`#define discardShadows(castShadows) {}`);const E=e.integratedMeshMode===r.IntegratedMeshMode.ColorOverlay||e.integratedMeshMode===r.IntegratedMeshMode.ColorOverlayWithWater,I=E&&e.output===d.ShaderOutput.Color&&e.pbrMode===S.PBRMode.WaterOnIntegratedMesh;E&&(D.include(y.EvaluateSceneLighting,e),D.include(L.OverlayIM,e),e.spherical?$.code.add(A.glsl`
      const float invEllipsoidRadius = ${A.glsl.float(1/(e.ellipsoidMode===P.EllipsoidMode.Earth?a.earth.radius:e.ellipsoidMode===P.EllipsoidMode.Mars?a.mars.radius:a.moon.radius))};
      vec2 projectOverlay(vec3 pos) {
        return pos.xy / (1.0 + invEllipsoidRadius * pos.z);
      }
      `):$.code.add(A.glsl`vec2 projectOverlay(vec3 pos) { return pos.xy; }`)),I&&(D.varyings.add("tbnTangent","vec3"),D.varyings.add("tbnBiTangent","vec3"),D.varyings.add("groundNormal","vec3")),$.code.add(A.glsl`
    void main() {
      bool castShadows;
      vec4 externalColor = forwardExternalColor(castShadows);
      discardShadows(castShadows);

      vertexDiscardByOpacity(externalColor.a);

      ${e.output===d.ShaderOutput.ObjectAndLayerIdColor?A.glsl`externalColor.a = 1.0;`:""}

      if (externalColor.a < ${A.glsl.float(T.symbolAlphaCutoff)}) {
        // Discard this vertex
        gl_Position = vec4(1e38, 1e38, 1e38, 1.0);
        return;
      }

      forwardPosition(readElevationOffset());
      forwardNormal();
      forwardTextureCoordinates();
      forwardVertexColor();
      forwardLinearDepth();
      ${e.output===d.ShaderOutput.ObjectAndLayerIdColor?A.glsl`forwardObjectAndLayerIdColor();`:""}
      ${I?e.spherical?A.glsl`
                groundNormal = normalize(positionWorld());
                tbnTangent = normalize(cross(vec3(0.0, 0.0, 1.0), groundNormal));
                tbnBiTangent = normalize(cross(groundNormal, tbnTangent));`:A.glsl`
                groundNormal = vec3(0.0, 0.0, 1.0);
                tbnTangent = vec3(1.0, 0.0, 0.0);
                tbnBiTangent = vec3(0.0, 1.0, 0.0);`:""}
      ${E?A.glsl`setOverlayVTC(projectOverlay(position));`:""}
    }
  `),e.output===d.ShaderOutput.Color&&(j.include(p.ReadLinearDepth),D.include(f.multipassTerrainTest,e),D.include(C.ComputeMaterialColor,e),D.include(b.ComputeShadingNormal,e),D.include(y.EvaluateSceneLighting,e),e.transparencyPassType===R.TransparencyPassType.ColorAlpha&&(D.outputs.add("fragColor","vec4",0),D.outputs.add("fragAlpha","float",1)),e.receiveShadows?(D.include(O.ReadShadowMapPass,e),j.code.add(A.glsl`float evaluateShadow() {
return readShadowMap(vPositionWorldCameraRelative, linearDepth);
}`)):j.code.add(A.glsl`float evaluateShadow() { return 0.0; }`),E&&j.uniforms.add(new W.Texture2DPassUniform("ovColorTex",((e,a)=>L.getIMColorTexture(e,a)))),j.code.add(A.glsl`
      void main() {
        discardBySlice(vPositionWorldCameraRelative);
        ${e.multipassEnabled?A.glsl`terrainDepthTest(vPosition_view.z);`:""}

        vec4 textureColor = readBaseColorTexture();
        discardOrAdjustAlpha(textureColor);

        vec4 externalColor;
        int externalColorMixMode;
        readExternalColor(externalColor, externalColorMixMode);

        vec4 materialColor = computeMaterialColor(
          textureColor,
          externalColor,
          externalColorMixMode
        );
        ${E?A.glsl`vec4 overlayColor = getOverlayColor(ovColorTex, vtcOverlay);`:""}
    `),e.pbrMode===S.PBRMode.Normal||e.pbrMode===S.PBRMode.Schematic?(x.addMainLightIntensity(j),j.code.add(A.glsl`
        ${e.pbrMode===S.PBRMode.Normal?A.glsl`
                applyPBRFactors();
                if (int(externalColorMixMode) == 3) {
                  mrr = vec3(0.0, 0.6, 0.2);
                }`:""}
        vec3 normalVertex = shadingNormalWorld();
        float additionalIrradiance = 0.02 * mainLightIntensity[2];
      `),e.hasNormalTexture?j.code.add(A.glsl`mat3 tangentSpace = computeTangentSpace(normalVertex, vPositionWorldCameraRelative, vuv0);
vec3 shadingNormal = computeTextureNormal(tangentSpace, vuv0);`):j.code.add(A.glsl`vec3 shadingNormal = normalVertex;`),j.code.add(A.glsl`${e.spherical?A.glsl`vec3 normalGround = normalize(positionWorld());`:A.glsl`vec3 normalGround = vec3(0.0, 0.0, 1.0);`}
      `),j.code.add(A.glsl`
        vec3 viewDir = normalize(vPositionWorldCameraRelative);
        float ssao = 1.0 - occlusion * evaluateAmbientOcclusionInverse();
        ${e.snowCover?A.glsl`
                vec3 surfaceNormal = normalize(shadingNormalWorld());
                float snow = smoothstep(0.5, 0.55, dot(surfaceNormal, normalize(positionWorld())));
                materialColor.rgb = mix(materialColor.rgb, vec3(1.1), snow);
                ssao = mix(ssao, 0.5 * ssao, snow);
                shadingNormal = mix(shadingNormal, surfaceNormal, snow);`:""}

        ${E?A.glsl` materialColor = materialColor * (1.0 - overlayColor.a) + overlayColor;`:""}

        vec3 additionalLight = evaluateAdditionalLighting(ssao, positionWorld());
        vec4 shadedColor = vec4(evaluateSceneLightingPBR(shadingNormal, materialColor.rgb, evaluateShadow(), ssao, additionalLight, viewDir, normalGround, mrr, emission, additionalIrradiance), materialColor.a);
        `)):(e.receiveShadows?j.code.add(A.glsl`float shadow = evaluateShadow();`):e.spherical?(y.addLightingGlobalFactor(j),j.code.add(A.glsl`float additionalAmbientScale = additionalDirectedAmbientLight(positionWorld());
float shadow = lightingGlobalFactor * (1.0 - additionalAmbientScale);`)):j.code.add(A.glsl`float shadow = 0.0;`),I&&j.uniforms.add(new W.Texture2DPassUniform("ovNormalTex",((e,a)=>a.overlay?.getTexture(o.OverlayContent.WaterNormal)))),e.snowCover&&j.code.add(A.glsl`vec3 surfaceNormal = normalize(cross(dFdx(vPositionWorldCameraRelative), dFdy(vPositionWorldCameraRelative)));
float snow = smoothstep(0.5, 0.55, dot(surfaceNormal, normalize(positionWorld())));
materialColor.rgb = mix(materialColor.rgb, vec3(1), snow);`),j.code.add(A.glsl`
        float ambientOcclusion = evaluateAmbientOcclusion();
        vec3 additionalLight = evaluateAdditionalLighting(ambientOcclusion, positionWorld());

        ${E?A.glsl` materialColor = materialColor * (1.0 - overlayColor.a) + overlayColor;`:""}

        vec4 shadedColor = vec4(evaluateSceneLighting(shadingNormalWorld(), materialColor.rgb, shadow, ambientOcclusion, additionalLight), materialColor.a);
      ${I?A.glsl`
              vec4 overlayWaterMask = getOverlayColor(ovNormalTex, vtcOverlay);
              float waterNormalLength = length(overlayWaterMask);
              if (waterNormalLength > 0.95) {
                mat3 tbnMatrix = mat3(tbnTangent, tbnBiTangent, groundNormal);
                vec4 waterColorLinear = getOverlayWaterColor(overlayWaterMask, overlayColor, -normalize(vPositionWorldCameraRelative), shadow, groundNormal, tbnMatrix, vPosition_view, positionWorld());
                vec4 waterColorNonLinear = delinearizeGamma(vec4(waterColorLinear.xyz, 1.0));
                // un-gamma the ground color to mix in linear space
                shadedColor = mix(shadedColor, waterColorNonLinear, waterColorLinear.w);
              }`:""}
      `)),j.code.add(A.glsl`
        fragColor = highlightSlice(shadedColor, vPositionWorldCameraRelative);
        ${e.transparencyPassType===R.TransparencyPassType.ColorAlpha?A.glsl`
                fragColor = premultiplyAlpha(fragColor);
                fragAlpha = fragColor.a;`:""}
      }
    `));const V=e.output===d.ShaderOutput.Depth;return(V||z||e.output===d.ShaderOutput.ViewshedShadow)&&(V||D.include(v.OutputDepth,e),j.code.add(A.glsl`
      void main() {
        discardBySlice(vPositionWorldCameraRelative);

        vec4 textureColor = readBaseColorTexture();
        discardOrAdjustAlpha(textureColor);

        ${V?"":A.glsl`outputDepth(linearDepth);`}
      }
    `)),e.output===d.ShaderOutput.Normal&&(D.include(b.ComputeShadingNormal,e),j.code.add(A.glsl`
      void main() {
        discardBySlice(vPositionWorldCameraRelative);

        vec4 textureColor = readBaseColorTexture();
        discardOrAdjustAlpha(textureColor);

        // note: the alpha component needs to be 1.0 in order for this material to influence ambient occlusion,
        // see the ssao fragment shader
        float alpha = ${e.normalType===s.NormalType.Ground?"0.0":"1.0"};
        fragColor = vec4(vec3(.5) + .5 * shadingNormal_view(), alpha);
      }
    `)),e.output===d.ShaderOutput.ObjectAndLayerIdColor&&D.fragment.code.add(A.glsl`
      void main() {
        discardBySlice(vPositionWorldCameraRelative);

        vec4 textureColor = readBaseColorTexture();
        discardOrAdjustAlpha(textureColor);

        ${E?A.glsl`fragColor = getOverlayColorTexel(vtcOverlay);`:"outputObjectAndLayerIdColor();"}
      }
    `),e.output===d.ShaderOutput.Highlight&&(D.include(m.OutputHighlight),j.code.add(A.glsl`
      void main() {
        discardBySlice(vPositionWorldCameraRelative);

        vec4 textureColor = readBaseColorTexture();
        discardOrAdjustAlpha(textureColor);

        ${E?A.glsl`
                vec4 overlayColor = getCombinedOverlayColor();
                if (overlayColor.a == 0.0) {
                  fragColor = vec4(0.0);
                  return;
                }`:""}

        outputHighlight();
      }
    `)),D}const $=Object.freeze(Object.defineProperty({__proto__:null,build:D},Symbol.toStringTag,{value:"Module"}));e.ComponentShader=$,e.build=D}));
