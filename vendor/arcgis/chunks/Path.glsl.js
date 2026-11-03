/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../views/3d/webgl-engine/core/shaderLibrary/ForwardLinearDepth.glsl","../views/3d/webgl-engine/core/shaderLibrary/ShaderOutput","../views/3d/webgl-engine/core/shaderLibrary/Slice.glsl","../views/3d/webgl-engine/core/shaderLibrary/Transform.glsl","../views/3d/webgl-engine/core/shaderLibrary/attributes/ObjectAndLayerIdColor.glsl","../views/3d/webgl-engine/core/shaderLibrary/attributes/PathVertexPosition.glsl","../views/3d/webgl-engine/core/shaderLibrary/output/OutputDepth.glsl","../views/3d/webgl-engine/core/shaderLibrary/output/OutputHighlight.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/EvaluateAmbientOcclusion.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/EvaluateSceneLighting.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/MainLighting.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/MultipassTerrainTest.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/Normals.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/NormalUtils.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/ReadShadowMap.glsl","../views/3d/webgl-engine/core/shaderLibrary/util/ColorConversion.glsl","../views/3d/webgl-engine/core/shaderLibrary/util/View.glsl","../views/3d/webgl-engine/core/shaderModules/Float3PassUniform","../views/3d/webgl-engine/core/shaderModules/FloatPassUniform","../views/3d/webgl-engine/core/shaderModules/interfaces","../views/3d/webgl-engine/core/shaderModules/ShaderBuilder","../views/3d/webgl-engine/lib/TransparencyPassType"],(function(e,a,i,o,r,l,d,s,n,t,c,g,u,h,p,v,m,w,b,y,f,S,P){"use strict";function L(e){const L=new S.ShaderBuilder,{vertex:O,fragment:C}=L;switch(w.addProjViewLocalOrigin(O,e),L.varyings.add("vpos","vec3"),L.include(d.PathVertexPosition,e),e.output!==i.ShaderOutput.Color&&e.output!==i.ShaderOutput.ObjectAndLayerIdColor||(L.include(r.Transform,e),L.include(v.ReadShadowMapDraw,e),L.include(a.ForwardLinearDepth,e),L.include(l.ObjectAndLayerIdColor,e),L.varyings.add("vnormal","vec3"),L.varyings.add("vcolor","vec4"),e.multipassEnabled&&L.varyings.add("depth","float"),O.code.add(f.glsl`
      void main() {
        vpos = calculateVPos();
        vnormal = normalize(localNormal());

        ${e.multipassEnabled?"depth = (view * vec4(vpos, 1.0)).z;":""}
        gl_Position = transformPosition(proj, view, vpos);

        ${e.output===i.ShaderOutput.Color?"forwardLinearDepth();":""}
        forwardObjectAndLayerIdColor();

        vcolor = getColor();
      }
    `)),L.include(u.multipassTerrainTest,e),e.output){case i.ShaderOutput.Color:L.include(o.SliceDraw,e),L.include(c.EvaluateSceneLighting,e),L.include(t.EvaluateAmbientOcclusion,e),L.include(v.ReadShadowMapDraw,e),L.include(h.Normals,e),w.addCameraPosition(C,e),c.addAmbientBoostFactor(C),c.addLightingGlobalFactor(C),C.uniforms.add(O.uniforms.get("localOrigin"),new b.Float3PassUniform("ambient",(e=>e.ambient)),new b.Float3PassUniform("diffuse",(e=>e.diffuse)),new b.Float3PassUniform("specular",(e=>e.specular)),new y.FloatPassUniform("opacity",(e=>e.opacity))),C.include(m.ColorConversion),e.transparencyPassType===P.TransparencyPassType.ColorAlpha&&(L.outputs.add("fragColor","vec4",0),L.outputs.add("fragAlpha","float",1)),g.addMainLightIntensity(C),C.code.add(f.glsl`
        void main() {
          discardBySlice(vpos);
          ${e.multipassEnabled?"terrainDepthTest(depth);":""}

          shadingParams.viewDirection = normalize(vpos - cameraPosition);
          shadingParams.normalView = vnormal;
          vec3 normal = shadingNormal(shadingParams);
          float ssao = evaluateAmbientOcclusionInverse();

          float additionalAmbientScale = additionalDirectedAmbientLight(vpos + localOrigin);
          vec3 additionalLight = ssao * mainLightIntensity * additionalAmbientScale * ambientBoostFactor * lightingGlobalFactor;
          ${e.receiveShadows?"float shadow = readShadowMap(vpos, linearDepth);":e.spherical?"float shadow = lightingGlobalFactor * (1.0 - additionalAmbientScale);":"float shadow = 0.0;"}
          vec3 albedo = vcolor.rgb * max(ambient, diffuse); // combine the old material parameters into a single one
          float combinedOpacity = vcolor.a * opacity;
          albedo += 0.25 * specular; // don't completely ignore specular for now

          vec3 shadedColor = evaluateSceneLighting(normal, albedo, shadow, 1.0 - ssao, additionalLight);
          fragColor = vec4(shadedColor, combinedOpacity);
          fragColor = highlightSlice(fragColor, vpos);
          ${e.transparencyPassType===P.TransparencyPassType.ColorAlpha?f.glsl`
                  fragColor = premultiplyAlpha(fragColor);
                  fragAlpha = fragColor.a;`:""}
        }
      `);break;case i.ShaderOutput.Depth:L.include(r.Transform,e),O.code.add(f.glsl`void main() {
vpos = calculateVPos();
gl_Position = transformPosition(proj, view, vpos);
}`),L.include(o.SliceDraw,e),C.code.add(f.glsl`void main() {
discardBySlice(vpos);
}`);break;case i.ShaderOutput.Shadow:case i.ShaderOutput.ShadowHighlight:case i.ShaderOutput.ShadowExcludeHighlight:case i.ShaderOutput.ViewshedShadow:L.include(r.Transform,e),a.addNearFar(L),L.varyings.add("depth","float"),O.code.add(f.glsl`void main() {
vpos = calculateVPos();
gl_Position = transformPositionWithDepth(proj, view, vpos, nearFar, depth);
}`),L.include(o.SliceDraw,e),L.include(s.OutputDepth,e),C.code.add(f.glsl`void main() {
discardBySlice(vpos);
outputDepth(depth);
}`);break;case i.ShaderOutput.ObjectAndLayerIdColor:L.include(o.SliceDraw,e),C.code.add(f.glsl`void main() {
discardBySlice(vpos);
outputObjectAndLayerIdColor();
}`);break;case i.ShaderOutput.Normal:L.include(r.Transform,e),L.include(p.NormalUtils,e),w.addViewNormal(O),L.varyings.add("vnormal","vec3"),O.code.add(f.glsl`void main(void) {
vpos = calculateVPos();
vnormal = normalize((viewNormal * vec4(localNormal(), 1.0)).xyz);
gl_Position = transformPosition(proj, view, vpos);
}`),L.include(o.SliceDraw,e),C.code.add(f.glsl`void main() {
discardBySlice(vpos);
vec3 normal = normalize(vnormal);
if (gl_FrontFacing == false) normal = -normal;
fragColor = vec4(vec3(0.5) + 0.5 * normal, 1.0);
}`);break;case i.ShaderOutput.Highlight:L.include(r.Transform,e),L.include(p.NormalUtils,e),L.varyings.add("vnormal","vec3"),O.code.add(f.glsl`void main(void) {
vpos = calculateVPos();
gl_Position = transformPosition(proj, view, vpos);
}`),L.include(o.SliceDraw,e),L.include(n.OutputHighlight,e),C.code.add(f.glsl`void main() {
discardBySlice(vpos);
outputHighlight();
}`)}return L}const O=Object.freeze(Object.defineProperty({__proto__:null,build:L},Symbol.toStringTag,{value:"Module"}));e.Path=O,e.build=L}));
