/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../core/libs/gl-matrix-2/math/vec2","../core/libs/gl-matrix-2/factories/vec2f64","../core/libs/gl-matrix-2/factories/vec4f64","../views/3d/webgl-engine/core/shaderLibrary/ShaderOutput","../views/3d/webgl-engine/core/shaderLibrary/Slice.glsl","../views/3d/webgl-engine/core/shaderLibrary/attributes/ObjectAndLayerIdColor.glsl","../views/3d/webgl-engine/core/shaderLibrary/hud/AlignPixel.glsl","../views/3d/webgl-engine/core/shaderLibrary/hud/HUD.glsl","../views/3d/webgl-engine/core/shaderLibrary/hud/HUDOcclusionPass.glsl","../views/3d/webgl-engine/core/shaderLibrary/hud/HUDVisibility.glsl","../views/3d/webgl-engine/core/shaderLibrary/output/OutputHighlight.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/VisualVariables.glsl","../views/3d/webgl-engine/core/shaderLibrary/util/AlphaCutoff","../views/3d/webgl-engine/core/shaderLibrary/util/ColorConversion.glsl","../views/3d/webgl-engine/core/shaderLibrary/util/RgbaFloatEncoding.glsl","../views/3d/webgl-engine/core/shaderLibrary/util/ScreenSizePerspective.glsl","../views/3d/webgl-engine/core/shaderLibrary/util/View.glsl","../views/3d/webgl-engine/core/shaderModules/Float2PassUniform","../views/3d/webgl-engine/core/shaderModules/Float4PassUniform","../views/3d/webgl-engine/core/shaderModules/FloatPassUniform","../views/3d/webgl-engine/core/shaderModules/interfaces","../views/3d/webgl-engine/core/shaderModules/ShaderBuilder","../views/3d/webgl-engine/core/shaderModules/Texture2DPassUniform","../views/3d/webgl-engine/lib/TransparencyPassType","../views/3d/webgl-engine/lib/VertexAttribute"],(function(e,o,l,i,r,a,t,s,n,c,d,u,g,p,f,v,b,h,x,w,C,P,m,S,y,z){"use strict";function A(e){const l=new m.ShaderBuilder,A=e.signedDistanceFieldEnabled;if(l.include(n.HUD,e),l.include(a.SliceDraw,e),e.occlusionPass)return l.include(c.HUDOcclusionPass,e),l;const{vertex:j,fragment:L}=l;l.include(b.ScreenSizePerspective),L.include(v.RgbaFloatEncoding),L.include(f.ColorConversion),l.include(g.VisualVariables,e),l.include(t.ObjectAndLayerIdColor,e),l.include(d.HUDVisibility),l.varyings.add("vcolor","vec4"),l.varyings.add("vtc","vec2"),l.varyings.add("vsize","vec2"),l.varyings.add("voccluded","float"),j.uniforms.add(new w.Float4PassUniform("viewport",((e,o)=>o.camera.fullViewport)),new x.Float2PassUniform("screenOffset",((e,l)=>o.set(D,2*e.screenOffset[0]*l.camera.pixelRatio,2*e.screenOffset[1]*l.camera.pixelRatio))),new x.Float2PassUniform("anchorPosition",(e=>O(e))),new w.Float4PassUniform("materialColor",(e=>e.color))),h.addPixelRatio(j),A&&(j.uniforms.add(new w.Float4PassUniform("outlineColor",(e=>e.outlineColor))),L.uniforms.add(new w.Float4PassUniform("outlineColor",(e=>F(e)?e.outlineColor:i.ZEROS)),new C.FloatPassUniform("outlineSize",(e=>F(e)?e.outlineSize:0)))),e.pixelSnappingEnabled&&j.include(s.AlignPixel),e.hasScreenSizePerspective&&(b.addScreenSizePerspective(j),b.addScreenSizePerspectiveAlignment(j)),e.debugDrawLabelBorder&&l.varyings.add("debugBorderCoords","vec4"),l.attributes.add(z.VertexAttribute.UV0,"vec2"),l.attributes.add(z.VertexAttribute.COLOR,"vec4"),l.attributes.add(z.VertexAttribute.SIZE,"vec2"),l.attributes.add(z.VertexAttribute.FEATUREATTRIBUTE,"vec4"),j.code.add(P.glsl`
    void main(void) {
      ProjectHUDAux projectAux;
      vec4 posProj = projectPositionHUD(projectAux);
      forwardObjectAndLayerIdColor();

      if (rejectBySlice(projectAux.posModel)) {
        // Project outside of clip plane
        gl_Position = vec4(1e038, 1e038, 1e038, 1.0);
        return;
      }
      vec2 inputSize;
      ${e.hasScreenSizePerspective?P.glsl`
            inputSize = screenSizePerspectiveScaleVec2(size, projectAux.absCosAngle, projectAux.distanceToCamera, screenSizePerspective);
            vec2 screenOffsetScaled = screenSizePerspectiveScaleVec2(screenOffset, projectAux.absCosAngle, projectAux.distanceToCamera, screenSizePerspectiveAlignment);
         `:P.glsl`
            inputSize = size;
            vec2 screenOffsetScaled = screenOffset;`}

      ${e.vvSize?"inputSize *= vvScale(featureAttribute).xx;":""}

      vec2 combinedSize = inputSize * pixelRatio;
      vec4 quadOffset = vec4(0.0);
      bool visible = testHUDVisibility(posProj);
      voccluded = visible ? 0.0 : 1.0;
    `);const T=P.glsl`vec2 uv01 = floor(uv0);
vec2 uv = uv0 - uv01;
quadOffset.xy = ((uv01 - anchorPosition) * 2.0 * combinedSize + screenOffsetScaled) / viewport.zw * posProj.w;`,$=e.pixelSnappingEnabled?A?P.glsl`posProj = alignToPixelOrigin(posProj, viewport.zw) + quadOffset;`:P.glsl`posProj += quadOffset;
if (inputSize.x == size.x) {
posProj = alignToPixelOrigin(posProj, viewport.zw);
}`:P.glsl`posProj += quadOffset;`;j.code.add(P.glsl`
    ${e.occlusionTestEnabled?"if (visible) {":""}
    ${T}
    ${e.vvColor?"vcolor = interpolateVVColor(featureAttribute.y) * materialColor;":"vcolor = color / 255.0 * materialColor;"}

    ${e.output===r.ShaderOutput.ObjectAndLayerIdColor?P.glsl`vcolor.a = 1.0;`:""}

    bool alphaDiscard = vcolor.a < ${P.glsl.float(p.symbolAlphaCutoff)};
    ${A?`alphaDiscard = alphaDiscard && outlineColor.a < ${P.glsl.float(p.symbolAlphaCutoff)};`:""}
    if (alphaDiscard) {
      // "early discard" if both symbol color (= fill) and outline color (if applicable) are transparent
      gl_Position = vec4(1e38, 1e38, 1e38, 1.0);
      return;
    } else {
      ${$}
      gl_Position = posProj;
    }

    vtc = uv;

    ${e.debugDrawLabelBorder?"debugBorderCoords = vec4(uv01, 1.5 / combinedSize);":""}
    vsize = inputSize;
    ${e.occlusionTestEnabled?P.glsl`} else { vtc = vec2(0.0);
      ${e.debugDrawLabelBorder?"debugBorderCoords = vec4(0.5, 0.5, 1.5 / combinedSize);}":"}"}`:""}
  }
  `),L.uniforms.add(new S.Texture2DPassUniform("tex",(e=>e.texture)));const U=e.debugDrawLabelBorder?P.glsl`(isBorder > 0.0 ? 0.0 : ${P.glsl.float(p.defaultMaskAlphaCutoff)})`:P.glsl.float(p.defaultMaskAlphaCutoff),B=P.glsl`
    ${e.debugDrawLabelBorder?P.glsl`
      float isBorder = float(any(lessThan(debugBorderCoords.xy, debugBorderCoords.zw)) || any(greaterThan(debugBorderCoords.xy, 1.0 - debugBorderCoords.zw)));`:""}

    ${e.sampleSignedDistanceFieldTexelCenter?P.glsl`
      // Attempt to sample texel centers to avoid that thin cross outlines
      // disappear with large symbol sizes.
      // see: https://devtopia.esri.com/WebGIS/arcgis-js-api/issues/7058#issuecomment-603041
      float txSize = float(textureSize(tex, 0).x);
      float texelSize = 1.0 / txSize;

      // Calculate how much we have to add/subtract to/from each texel to reach the size of an onscreen pixel
      vec2 scaleFactor = (vsize - txSize) * texelSize;
      vec2 samplePos = vtc + (vec2(1.0, -1.0) * texelSize) * scaleFactor;
      `:P.glsl`
      vec2 samplePos = vtc;
      `}

    ${A?P.glsl`
      vec4 fillPixelColor = vcolor;

      // Get distance and map it into [-0.5, 0.5]
      float d = rgba2float(texture(tex, samplePos)) - 0.5;

      // Distance in output units (i.e. pixels)
      float dist = d * vsize.x;

      // Create smooth transition from the icon into its outline
      float fillAlphaFactor = clamp(0.5 - dist, 0.0, 1.0);
      fillPixelColor.a *= fillAlphaFactor;

      if (outlineSize > 0.25) {
        vec4 outlinePixelColor = outlineColor;
        float clampedOutlineSize = min(outlineSize, 0.5*vsize.x);

        // Create smooth transition around outline
        float outlineAlphaFactor = clamp(0.5 - (abs(dist) - 0.5*clampedOutlineSize), 0.0, 1.0);
        outlinePixelColor.a *= outlineAlphaFactor;

        if (
          outlineAlphaFactor + fillAlphaFactor < ${U} ||
          fillPixelColor.a + outlinePixelColor.a < ${P.glsl.float(p.symbolAlphaCutoff)}
        ) {
          discard;
        }

        // perform un-premultiplied over operator (see https://en.wikipedia.org/wiki/Alpha_compositing#Description)
        float compositeAlpha = outlinePixelColor.a + fillPixelColor.a * (1.0 - outlinePixelColor.a);
        vec3 compositeColor = vec3(outlinePixelColor) * outlinePixelColor.a +
          vec3(fillPixelColor) * fillPixelColor.a * (1.0 - outlinePixelColor.a);

        fragColor = vec4(compositeColor, compositeAlpha);
      } else {
        if (fillAlphaFactor < ${U}) {
          discard;
        }

        fragColor = premultiplyAlpha(fillPixelColor);
      }

      // visualize SDF:
      // fragColor = vec4(clamp(-dist/vsize.x*2.0, 0.0, 1.0), clamp(dist/vsize.x*2.0, 0.0, 1.0), 0.0, 1.0);
      `:P.glsl`
          vec4 texColor = texture(tex, vtc, -0.5);
          if (texColor.a < ${U}) {
            discard;
          }
          fragColor = texColor * premultiplyAlpha(vcolor);
          `}

    // Draw debug border with transparency, so that original texels along border are still partially visible
    ${e.debugDrawLabelBorder?P.glsl`fragColor = mix(fragColor, vec4(1.0, 0.0, 1.0, 1.0), isBorder * 0.5);`:""}
  `;switch(e.output){case r.ShaderOutput.Color:e.transparencyPassType===y.TransparencyPassType.ColorAlpha&&(l.outputs.add("fragColor","vec4",0),l.outputs.add("fragAlpha","float",1)),L.code.add(P.glsl`
        void main() {
          ${B}
          ${e.transparencyPassType===y.TransparencyPassType.FrontFace?"fragColor.rgb /= fragColor.a;":""}
          ${e.transparencyPassType===y.TransparencyPassType.ColorAlpha?"fragAlpha = fragColor.a;":""}
        }`);break;case r.ShaderOutput.ObjectAndLayerIdColor:L.code.add(P.glsl`
        void main() {
          ${B}
          outputObjectAndLayerIdColor();
        }`);break;case r.ShaderOutput.Highlight:L.constants.add("occludedHighlightFlag","vec4",u.occludedHighlightFlag),L.constants.add("unoccludedHighlightFlag","vec4",u.unoccludedHighlightFlag),L.code.add(P.glsl`
        void main() {
          ${B}
          if (voccluded == 1.0) {
            fragColor = occludedHighlightFlag;
          } else {
            fragColor = unoccludedHighlightFlag;
          }
        }`)}return l}function F(e){return e.outlineColor[3]>0&&e.outlineSize>0}function O(e,l=D){return e.textureIsSignedDistanceField?j(e.anchorPosition,e.distanceFieldBoundingBox,l):o.copy(l,e.anchorPosition),l}function j(e,l,i){null!=l?o.set(i,e[0]*(l[2]-l[0])+l[0],e[1]*(l[3]-l[1])+l[1]):o.set(i,0,0)}const D=l.create(),L=Object.freeze(Object.defineProperty({__proto__:null,build:A,calculateAnchorPosForRendering:O},Symbol.toStringTag,{value:"Module"}));e.HUDMaterial=L,e.build=A,e.calculateAnchorPosForRendering=O}));
