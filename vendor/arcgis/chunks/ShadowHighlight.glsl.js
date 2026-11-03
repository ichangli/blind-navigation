/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../core/libs/gl-matrix-2/math/mat4","../core/libs/gl-matrix-2/factories/mat4f64","./vec32","../core/libs/gl-matrix-2/factories/vec3f64","../views/3d/webgl-engine/core/shaderLibrary/NormalFromDepth.glsl","../views/3d/webgl-engine/core/shaderLibrary/ScreenSpacePass.glsl","../views/3d/webgl-engine/core/shaderLibrary/output/OutputHighlight.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/ReadShadowMap.glsl","../views/3d/webgl-engine/core/shaderLibrary/util/RgbaFloatEncoding.glsl","../views/3d/webgl-engine/core/shaderModules/Float3PassUniform","../views/3d/webgl-engine/core/shaderModules/Float4PassUniform","../views/3d/webgl-engine/core/shaderModules/FloatPassUniform","../views/3d/webgl-engine/core/shaderModules/interfaces","../views/3d/webgl-engine/core/shaderModules/Matrix4PassUniform","../views/3d/webgl-engine/core/shaderModules/ShaderBuilder","../views/3d/webgl-engine/core/shaderModules/Texture2DPassUniform","../views/3d/webgl-engine/lib/ShadowMap"],(function(e,i,a,t,o,r,l,s,d,n,h,c,g,p,u,w,v,f){"use strict";const m=.99999,x=.025;function b(e){const a=new w.ShaderBuilder;a.include(d.ReadShadowMapPass,e),a.include(l.ScreenSpacePass),a.include(r.NormalFromDepth);const o=a.fragment;return o.include(n.RgbaFloatEncoding),o.uniforms.add(new v.Texture2DPassUniform("defaultDepthTex",((e,i)=>i.shadowMap.getSnapshot(f.SnapshotSlot.ExcludeHighlight))),new v.Texture2DPassUniform("highlightDepthTex",((e,i)=>i.shadowMap.getSnapshot(f.SnapshotSlot.Highlight))),new v.Texture2DPassUniform("depthMap",((e,i)=>i.depth?.attachment)),new v.Texture2DPassUniform("highlightTexture",(e=>e.highlight)),new c.Float4PassUniform("uColor",(e=>e.shadowColor)),new g.FloatPassUniform("opacity",(e=>e.shadowOpacity)),new g.FloatPassUniform("occludedOpacity",(e=>e.occludedShadowOpacity)),new g.FloatPassUniform("terminationFactor",(e=>e.opacityElevation*e.dayNightTerminator)),new h.Float3PassUniform("lightingMainDirectionView",((e,i)=>t.normalize(M,t.transformMat4(M,i.lighting.mainLight.direction,i.camera.viewInverseTransposeMatrix)))),new u.Matrix4PassUniform("inverseViewMatrix",((e,a)=>i.invert(P,i.translate(P,a.camera.viewMatrix,a.camera.center))))),o.constants.add("unoccludedHighlightFlag","vec4",s.unoccludedHighlightFlag),o.code.add(p.glsl`
    void main(void) {
      vec4 highlightInfo = texture(highlightTexture, uv);
      float visiblyHighlighted = (1.0 - clamp(distance(unoccludedHighlightFlag, highlightInfo), 0.0, 1.0)) * highlightInfo.a;
      if (visiblyHighlighted > ${p.glsl.float(m)}) {
        discard;
      }

      float depth = depthFromTexture(depthMap, uv);

      // 1.0 is the clear value of depthMap, which means nothing has been drawn there and we should discard
      if (depth >= 1.0 || depth <= 0.0) {
        discard;
      }

      float currentPixelDepth = linearizeDepth(depth);
      vec4 currentPixelPos = vec4(reconstructPosition(gl_FragCoord.xy, currentPixelDepth), 1.0);
      vec4 worldSpacePos = inverseViewMatrix * currentPixelPos;

      mat4 shadowMatrix;
      float linearDepth = -currentPixelDepth;
      int i = chooseCascade(linearDepth, shadowMatrix);
      if (i >= numCascades) {
        discard;
      }

      vec3 lvpos = lightSpacePosition(worldSpacePos.xyz, shadowMatrix);

      // vertex completely outside? -> no shadow
      if (lvpos.z >= 1.0 || lvpos.x < 0.0 || lvpos.x > 1.0 || lvpos.y < 0.0 || lvpos.y > 1.0) {
        discard;
      }

      ivec2 texSize = textureSize(highlightDepthTex, 0);
      ivec2 uvShadow = ivec2(cascadeCoordinates(i, texSize, lvpos) * vec2(texSize));

      float depthHighlight = readShadowMapDepth(uvShadow, highlightDepthTex);
      bool shadowHighlight = depthHighlight < lvpos.z;
      if (!shadowHighlight) {
        discard;
      }

      float depthDefault = readShadowMapDepth(uvShadow, defaultDepthTex);
      bool shadowDefault = depthDefault < lvpos.z;

      vec3 normal = normalFromDepth(depthMap, currentPixelPos.xyz, gl_FragCoord.xy, uv);
      bool shaded = dot(normal, lightingMainDirectionView) < ${p.glsl.float(x)};

      float fragOpacity = (shadowDefault || shaded) ? occludedOpacity : opacity;
      fragColor = vec4(uColor.rgb, uColor.a * fragOpacity * terminationFactor);
    }
  `),a}const P=a.create(),M=o.create(),S=Object.freeze(Object.defineProperty({__proto__:null,build:b},Symbol.toStringTag,{value:"Module"}));e.ShadowHighlight=S,e.build=b}));
