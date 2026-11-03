/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../views/3d/webgl-engine/core/shaderLibrary/ForwardLinearDepth.glsl","../views/3d/webgl-engine/core/shaderLibrary/ShaderOutput","../views/3d/webgl-engine/core/shaderLibrary/Slice.glsl","../views/3d/webgl-engine/core/shaderLibrary/Transform.glsl","../views/3d/webgl-engine/core/shaderLibrary/attributes/ObjectAndLayerIdColor.glsl","../views/3d/webgl-engine/core/shaderLibrary/output/OutputHighlight.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/EvaluateAmbientLighting.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/MainLighting.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/MultipassTerrainTest.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/NormalUtils.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/PhysicallyBasedRenderingParameters.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/ReadShadowMap.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/Water.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/WaterDistortion.glsl","../views/3d/webgl-engine/core/shaderLibrary/util/AlphaCutoff","../views/3d/webgl-engine/core/shaderLibrary/util/ColorConversion.glsl","../views/3d/webgl-engine/core/shaderLibrary/util/View.glsl","../views/3d/webgl-engine/core/shaderModules/Float4PassUniform","../views/3d/webgl-engine/core/shaderModules/FloatPassUniform","../views/3d/webgl-engine/core/shaderModules/interfaces","../views/3d/webgl-engine/core/shaderModules/ShaderBuilder","../views/3d/webgl-engine/lib/TransparencyPassType","../views/3d/webgl-engine/lib/VertexAttribute"],(function(e,a,i,r,o,l,t,s,n,d,g,v,c,u,p,m,h,w,b,f,y,C,L,P){"use strict";function S(e){const S=new C.ShaderBuilder,{vertex:O,fragment:A}=S;w.addProjViewLocalOrigin(O,e),S.include(o.Transform,e),S.attributes.add(P.VertexAttribute.POSITION,"vec3"),S.attributes.add(P.VertexAttribute.UV0,"vec2");const D=new b.Float4PassUniform("waterColor",(e=>e.color));if(e.output===i.ShaderOutput.Color&&e.draped)return S.varyings.add("vpos","vec3"),O.uniforms.add(D),O.code.add(y.glsl`
        void main(void) {
          if (waterColor.a < ${y.glsl.float(m.symbolAlphaCutoff)}) {
            // Discard this vertex
            gl_Position = vec4(1e38, 1e38, 1e38, 1.0);
            return;
          }

          vpos = position;
          gl_Position = transformPosition(proj, view, vpos);
        }
    `),A.uniforms.add(D),A.code.add(y.glsl`void main() {
fragColor = waterColor;
}`),S;switch(e.output===i.ShaderOutput.Color&&(S.include(g.NormalUtils,e),S.include(a.ForwardLinearDepth,e),S.varyings.add("vuv","vec2"),S.varyings.add("vpos","vec3"),S.varyings.add("vnormal","vec3"),S.varyings.add("vtbnMatrix","mat3"),e.multipassEnabled&&S.varyings.add("depth","float"),O.uniforms.add(D),O.code.add(y.glsl`
      void main(void) {
        if (waterColor.a < ${y.glsl.float(m.symbolAlphaCutoff)}) {
          // Discard this vertex
          gl_Position = vec4(1e38, 1e38, 1e38, 1.0);
          return;
        }

        vuv = uv0;
        vpos = position;

        vnormal = getLocalUp(vpos, localOrigin);
        vtbnMatrix = getTBNMatrix(vnormal);

        ${e.multipassEnabled?"depth = (view * vec4(vpos, 1.0)).z;":""}

        gl_Position = transformPosition(proj, view, vpos);
        ${e.output===i.ShaderOutput.Color?"forwardLinearDepth();":""}
      }
    `)),S.include(d.multipassTerrainTest,e),e.output){case i.ShaderOutput.Color:S.include(n.MainLighting),S.include(s.EvaluateAmbientLighting,{pbrMode:v.PBRMode.Disabled,lightingSphericalHarmonicsOrder:2}),S.include(p.WaterDistortion),S.include(r.SliceDraw,e),S.include(c.ReadShadowMapDraw,e),S.include(u.Water,e),A.uniforms.add(D,new f.FloatPassUniform("timeElapsed",(e=>e.timeElapsed)),O.uniforms.get("view"),O.uniforms.get("localOrigin")),w.addCameraPosition(A,e),A.include(h.ColorConversion),e.transparencyPassType===L.TransparencyPassType.ColorAlpha&&(S.outputs.add("fragColor","vec4",0),S.outputs.add("fragAlpha","float",1)),n.addMainLightDirection(A),n.addMainLightIntensity(A),A.code.add(y.glsl`
      void main() {
        discardBySlice(vpos);
        ${e.multipassEnabled?"terrainDepthTest(depth);":""}
        vec3 localUp = vnormal;
        // the created normal is in tangent space
        vec4 tangentNormalFoam = getSurfaceNormalAndFoam(vuv, timeElapsed);

        // we rotate the normal according to the tangent-bitangent-normal-Matrix
        vec3 n = normalize(vtbnMatrix * tangentNormalFoam.xyz);
        vec3 v = -normalize(vpos - cameraPosition);
        float shadow = ${e.receiveShadows?y.glsl`1.0 - readShadowMap(vpos, linearDepth)`:"1.0"};
        vec4 vPosView = view * vec4(vpos, 1.0);
        vec4 final = vec4(getSeaColor(n, v, mainLightDirection, waterColor.rgb, mainLightIntensity, localUp, shadow, tangentNormalFoam.w, vPosView.xyz, vpos + localOrigin), waterColor.w);

        // gamma correction
        fragColor = delinearizeGamma(final);
        fragColor = highlightSlice(fragColor, vpos);
        ${e.transparencyPassType===L.TransparencyPassType.ColorAlpha?y.glsl`
                fragColor = premultiplyAlpha(fragColor);
                fragAlpha = fragColor.a;`:""}
      }
    `);break;case i.ShaderOutput.Normal:S.include(g.NormalUtils,e),S.include(p.WaterDistortion,e),S.include(r.SliceDraw,e),S.varyings.add("vpos","vec3"),S.varyings.add("vuv","vec2"),O.uniforms.add(D),O.code.add(y.glsl`
        void main(void) {
          if (waterColor.a < ${y.glsl.float(m.symbolAlphaCutoff)}) {
            // Discard this vertex
            gl_Position = vec4(1e38, 1e38, 1e38, 1.0);
            return;
          }

          vuv = uv0;
          vpos = position;

          gl_Position = transformPosition(proj, view, vpos);
        }
    `),A.uniforms.add(new f.FloatPassUniform("timeElapsed",(e=>e.timeElapsed))),A.code.add(y.glsl`void main() {
discardBySlice(vpos);
vec4 tangentNormalFoam = getSurfaceNormalAndFoam(vuv, timeElapsed);
tangentNormalFoam.xyz = normalize(tangentNormalFoam.xyz);
fragColor = vec4((tangentNormalFoam.xyz + vec3(1.0)) * 0.5, tangentNormalFoam.w);
}`);break;case i.ShaderOutput.Highlight:S.include(t.OutputHighlight,e),S.varyings.add("vpos","vec3"),O.uniforms.add(D),O.code.add(y.glsl`
      void main(void) {
        if (waterColor.a < ${y.glsl.float(m.symbolAlphaCutoff)}) {
          // Discard this vertex
          gl_Position = vec4(1e38, 1e38, 1e38, 1.0);
          return;
        }

        vpos = position;
        gl_Position = transformPosition(proj, view, vpos);
      }
    `),S.include(r.SliceDraw,e),A.code.add(y.glsl`void main() {
discardBySlice(vpos);
outputHighlight();
}`);break;case i.ShaderOutput.ObjectAndLayerIdColor:S.include(l.ObjectAndLayerIdColor,e),S.varyings.add("vpos","vec3"),O.uniforms.add(D),O.code.add(y.glsl`
      void main(void) {
        if (waterColor.a < ${y.glsl.float(m.symbolAlphaCutoff)}) {
          // Discard this vertex
          gl_Position = vec4(1e38, 1e38, 1e38, 1.0);
          return;
        }

        vpos = position;
        gl_Position = transformPosition(proj, view, vpos);
        forwardObjectAndLayerIdColor();
      }
    `),S.include(r.SliceDraw,e),A.code.add(y.glsl`void main() {
discardBySlice(vpos);
outputObjectAndLayerIdColor();
}`)}return S}const O=Object.freeze(Object.defineProperty({__proto__:null,build:S},Symbol.toStringTag,{value:"Module"}));e.WaterSurface=O,e.build=S}));
