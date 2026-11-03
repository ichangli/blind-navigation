/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../core/libs/gl-matrix-2/math/mat4","../core/libs/gl-matrix-2/factories/mat4f64","./vec32","../core/libs/gl-matrix-2/factories/vec3f64","../views/3d/terrain/OverlayContent","../views/3d/webgl-engine/core/shaderLibrary/ForwardLinearDepth.glsl","../views/3d/webgl-engine/core/shaderLibrary/ShaderOutput","../views/3d/webgl-engine/core/shaderLibrary/Slice.glsl","../views/3d/webgl-engine/core/shaderLibrary/Transform.glsl","../views/3d/webgl-engine/core/shaderLibrary/attributes/NormalAttribute.glsl","../views/3d/webgl-engine/core/shaderLibrary/attributes/PositionAttribute.glsl","../views/3d/webgl-engine/core/shaderLibrary/attributes/TextureCoordinateAttribute.glsl","../views/3d/webgl-engine/core/shaderLibrary/attributes/VertexTangent.glsl","../views/3d/webgl-engine/core/shaderLibrary/output/OutputDepth.glsl","../views/3d/webgl-engine/core/shaderLibrary/output/OutputHighlight.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/EvaluateAmbientOcclusion.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/EvaluateSceneLighting.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/MainLighting.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/NormalUtils.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/PhysicallyBasedRenderingParameters.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/ReadShadowMap.glsl","../views/3d/webgl-engine/core/shaderLibrary/terrain/Overlay.glsl","../views/3d/webgl-engine/core/shaderLibrary/terrain/TerrainTexture.glsl","../views/3d/webgl-engine/core/shaderLibrary/util/View.glsl","../views/3d/webgl-engine/core/shaderModules/Float3PassUniform","../views/3d/webgl-engine/core/shaderModules/interfaces","../views/3d/webgl-engine/core/shaderModules/Matrix4DrawUniform","../views/3d/webgl-engine/core/shaderModules/ShaderBuilder","../views/3d/webgl-engine/core/shaderModules/Texture2DPassUniform"],(function(e,r,a,i,o,l,t,n,s,d,c,v,g,m,u,p,h,w,b,f,y,C,O,S,x,P,L,T,M,z){"use strict";class D extends S.OverlayTerrainPassParameters{}function N(e){const a=new M.ShaderBuilder,{vertex:o,fragment:D,varyings:N}=a;a.include(v.PositionAttribute),a.include(c.NormalAttribute,e),a.include(g.TextureCoordinateAttribute,e);const $=()=>{a.include(f.NormalUtils,e),o.code.add(L.glsl`vec3 getNormal() {
float z = 1.0 - abs(normalCompressed.x) - abs(normalCompressed.y);
vec3 n = vec3(normalCompressed + vec2(normalCompressed.x >= 0.0 ? 1.0 : -1.0,
normalCompressed.y >= 0.0 ? 1.0 : -1.0) * min(z, 0.0), z);
return normalize(n);
}`)};x.addProjViewLocalOrigin(o,e),a.include(d.Transform,e);const F=e.overlayMode!==O.OverlayMode.Disabled,W=F&&e.invisible;switch(e.output){case n.ShaderOutput.Color:{a.include(S.TerrainTexture,e),a.include(w.EvaluateSceneLighting,e),F&&a.include(O.OverlayTerrain,{...e,pbrMode:e.pbrMode===y.PBRMode.Simplified?y.PBRMode.TerrainWithWater:y.PBRMode.Water});const n=e.overlayMode===O.OverlayMode.EnabledWithWater;n&&a.include(m.VertexTangent,e),N.add("vnormal","vec3"),N.add("vpos","vec3"),N.add("vup","vec3"),$(),e.screenSizePerspective&&x.addViewNormal(o);const d=e.receiveShadows&&!e.renderOccluded;d&&a.include(t.ForwardLinearDepth,e),e.screenSizePerspective&&(N.add("screenSizeDistanceToCamera","float"),N.add("screenSizeCosAngle","float")),o.code.add(L.glsl`
        void main(void) {
          //Position
          vpos = position;
          vec3 positionWorld = position + localOrigin;
          gl_Position = transformPosition(proj, view, vpos);

          //Normal
          vnormal = getNormal();

          //Up
          vup = getLocalUp(position, localOrigin);

          ${n?L.glsl`forwardVertexTangent(vnormal);`:L.glsl``}

          //Texture UV
          vec2 uv = getUV0();
          forwardTextureCoordinatesWithTransform(uv);
          ${F?L.glsl`setOverlayVTC(uv);`:""}
          ${e.tileBorders?L.glsl`forwardTextureCoordinates();`:""}

          ${e.screenSizePerspective?L.glsl`
          vec3 viewPos = (view * vec4(vpos, 1.0)).xyz;
          screenSizeDistanceToCamera = length(viewPos);
          vec3 viewSpaceNormal = (viewNormal * vec4(normalize(positionWorld), 1.0)).xyz;
          screenSizeCosAngle = abs(viewSpaceNormal.z);`:""}

          ${d?L.glsl`forwardLinearDepth();`:""}

        }
      `),a.include(s.SliceDraw,e),a.include(w.EvaluateSceneLighting,e),a.include(h.EvaluateAmbientOcclusion,e),a.include(C.ReadShadowMapDraw,e),x.addCameraPosition(D,e),w.addAmbientBoostFactor(D),w.addLightingGlobalFactor(D),D.uniforms.add(o.uniforms.get("localOrigin"),new P.Float3PassUniform("viewDirection",((e,r)=>i.normalize(U,i.set(U,r.camera.viewMatrix[12],r.camera.viewMatrix[13],r.camera.viewMatrix[14]))))),n&&D.uniforms.add(new z.Texture2DPassUniform("ovWaterTex",((e,r)=>r.overlay?.getTexture(l.OverlayContent.WaterNormal))),new T.Matrix4DrawUniform("view",((e,a)=>r.translate(V,a.camera.viewMatrix,e.origin)))),D.code.add(L.glsl`const float sliceOpacity = 0.2;
float lum(vec3 c) {
return (min(min(c.r, c.g), c.b) + max(max(c.r, c.g), c.b)) * 0.5;
}`),b.addMainLightDirection(D),b.addMainLightIntensity(D),D.code.add(L.glsl`
        void main() {
          vec3 normal = normalize(vnormal);
          float vndl = dot(normal, mainLightDirection);

          float additionalAmbientScale = smoothstep(0.0, 1.0, clamp(vndl*2.5, 0.0, 1.0));
          float shadow = ${e.receiveShadows&&!e.renderOccluded?"readShadowMap(vpos, linearDepth)":e.spherical?"lightingGlobalFactor * (1.0 - additionalAmbientScale)":"0.0"};

          float ssao = evaluateAmbientOcclusionInverse();
          vec4 tileColor = getTileColor();

          ${F?L.glsl`
              vec4 overlayColorOpaque = getOverlayColor(ovColorTex, vtcOverlay);
              vec4 overlayColor = overlayOpacity * overlayColorOpaque;
              ${e.invisible?L.glsl`if (overlayColor.a == 0.0) { discard; }`:""}
              vec4 groundColor = tileColor;
              tileColor = tileColor * (1.0 - overlayColor.a) + overlayColor;`:""}

          // If combined alpha is 0 we can discard pixel. The performance impact by having a discard here
          // is neglectable because terrain typically renders first into the framebuffer.
          if(tileColor.a <= 0.0) {
            discard;
          }

          bool sliced = rejectBySlice(vpos);
          if (sliced) {
            tileColor *= sliceOpacity;
          }

          vec3 albedo = tileColor.rgb;

          // heuristic shading function used in the old terrain, now used to add ambient lighting

          vec3 additionalLight = ssao * mainLightIntensity * additionalAmbientScale * ambientBoostFactor * lightingGlobalFactor;

          ${e.pbrMode===y.PBRMode.Simplified||e.pbrMode===y.PBRMode.TerrainWithWater?L.glsl`fragColor = vec4(evaluatePBRSimplifiedLighting(normal, albedo, shadow, 1.0 - ssao, additionalLight, normalize(vpos - cameraPosition), vup), tileColor.a);`:L.glsl`fragColor = vec4(evaluateSceneLighting(normal, albedo, shadow, 1.0 - ssao, additionalLight), tileColor.a);`}
          ${n?L.glsl`
              vec4 overlayWaterMask = getOverlayColor(ovWaterTex, vtcOverlay);
              float waterNormalLength = length(overlayWaterMask);
              if (waterNormalLength > 0.95) {
                mat3 tbnMatrix = mat3(tbnTangent, tbnBiTangent, vnormal);
                vec4 waterOverlayColor = vec4(overlayColor.w > 0.0 ? overlayColorOpaque.xyz/overlayColor.w : vec3(1.0), overlayColor.w);
                vec4 viewPosition = view*vec4(vpos, 1.0);
                vec4 waterColorLinear = getOverlayWaterColor(overlayWaterMask, waterOverlayColor, -normalize(vpos - cameraPosition), shadow, vnormal, tbnMatrix, viewPosition.xyz,  vpos + localOrigin);
                vec4 waterColorNonLinear = delinearizeGamma(vec4(waterColorLinear.xyz, 1.0));
                float opacity = sliced ? sliceOpacity : 1.0;
                // un-gamma the ground color to mix in linear space
                fragColor = mix(groundColor, waterColorNonLinear, waterColorLinear.w) * opacity;
              }`:""}
          ${e.screenSizePerspective?L.glsl`
            float perspectiveScale = screenSizePerspectiveScaleFloat(1.0, screenSizeCosAngle, screenSizeDistanceToCamera, vec4(0.0, 0.0, 0.0, 0.0));
            if (perspectiveScale <= 0.25) {
              fragColor = mix(fragColor, vec4(1.0, 0.0, 0.0, 1.0), perspectiveScale * 4.0);
            }
            else if (perspectiveScale <= 0.5) {
              fragColor = mix(fragColor, vec4(0.0, 0.0, 1.0, 1.0), (perspectiveScale - 0.25) * 4.0);
            }
            else if (perspectiveScale >= 0.99) {
              fragColor = mix(fragColor, vec4(0.0, 1.0, 0.0, 1.0), 0.2);
            }
            else {
              fragColor = mix(fragColor, vec4(1.0, 0.0, 1.0, 1.0), (perspectiveScale - 0.5) * 2.0);
            }`:""}
          ${e.visualizeNormals?e.spherical?L.glsl`
                  vec3 localUp = normalize(vpos + localOrigin);
                  vec3 right = normalize(cross(vec3(0.0, 0.0, 1.0), localUp));
                  vec3 forward = normalize(cross(localUp, right));
                  mat3 tbn = mat3(right, forward, localUp);
                  vec3 tNormal = normalize(normal * tbn);
                  fragColor = vec4(vec3(0.5) + 0.5 * tNormal, 0.0);
              `:L.glsl`
                  vec3 tNormal = normalize(normal);
                  fragColor = vec4(vec3(0.5) + 0.5 * tNormal, 0.0);
              `:""}
          ${e.tileBorders?L.glsl`
              vec2 dVuv = fwidth(vuv0);
              vec2 edgeFactors = smoothstep(vec2(0.0), 1.5 * dVuv, min(vuv0, 1.0 - vuv0));
              float edgeFactor = 1.0 - min(edgeFactors.x, edgeFactors.y);
              fragColor = mix(fragColor, vec4(1.0, 0.0, 0.0, 1.0), edgeFactor);`:""}
          fragColor = highlightSlice(fragColor, vpos);
        }
      `)}break;case n.ShaderOutput.Depth:W&&a.include(O.OverlayTerrain,e),o.code.add(L.glsl`
              void main(void) {
                ${W?L.glsl`setOverlayVTC(getUV0());`:""}
                gl_Position = transformPosition(proj, view, position);
              }
          `),D.code.add(L.glsl`
              void main() {
                ${W?L.glsl`if (getCombinedOverlayColor().a == 0.0) { discard; }`:""}
              }
          `);break;case n.ShaderOutput.Shadow:case n.ShaderOutput.ShadowHighlight:case n.ShaderOutput.ShadowExcludeHighlight:case n.ShaderOutput.ViewshedShadow:a.include(u.OutputDepth,e),t.addLinearDepth(a),t.addNearFar(a),o.code.add(L.glsl`void main(void) {
gl_Position = transformPositionWithDepth(proj, view, position, nearFar, linearDepth);
}`),D.code.add(L.glsl`void main() {
outputDepth(linearDepth);
}`);break;case n.ShaderOutput.Normal:W&&a.include(O.OverlayTerrain,e),N.add("vnormal","vec3"),x.addViewNormal(o),$(),o.code.add(L.glsl`
        void main(void) {
          ${W?L.glsl`setOverlayVTC(getUV0());`:""}
          gl_Position = transformPosition(proj, view, position);
          vnormal = normalize((viewNormal * vec4(getNormal(), 1.0)).xyz);
        }
      `),D.code.add(L.glsl`
        void main() {
          ${W?L.glsl`if (getCombinedOverlayColor().a == 0.0) { discard; }`:""}
          vec3 normal = normalize(vnormal);
          if (gl_FrontFacing == false) {
            normal = -normal;
          }
          fragColor = vec4(vec3(0.5) + 0.5 * normal, 1.0);
        }
      `);break;case n.ShaderOutput.Highlight:F&&a.include(O.OverlayTerrain,e),o.code.add(L.glsl`
          void main() {
            ${F?L.glsl`setOverlayVTC(getUV0());`:""}
            gl_Position = transformPosition(proj, view, position);
          }
        `),a.include(p.OutputHighlight,e),D.code.add(L.glsl`
          void main() {
            ${F?L.glsl`if (getCombinedOverlayColor().a == 0.0) { discard; }`:""}
            outputHighlight();
          }
        `)}return e.output===n.ShaderOutput.ObjectAndLayerIdColor&&(F?(a.include(O.OverlayTerrain,{...e,pbrMode:y.PBRMode.Disabled}),o.code.add(L.glsl`void main(void) {
gl_Position = transformPosition(proj, view, position);
setOverlayVTC(getUV0());
}`),D.code.add(L.glsl`void main() {
fragColor = getOverlayColorTexel(vtcOverlay);
}`)):(o.code.add(L.glsl`void main(void) {
        ${e.opaque?L.glsl` gl_Position = transformPosition(proj, view, position);`:""}
      }`),D.code.add(L.glsl`void main() {
fragColor = vec4(0.0);
}`))),a}const V=a.create(),U=o.create(),$=Object.freeze(Object.defineProperty({__proto__:null,TerrainPassParameters:D,build:N},Symbol.toStringTag,{value:"Module"}));e.Terrain=$,e.TerrainPassParameters=D,e.build=N}));
