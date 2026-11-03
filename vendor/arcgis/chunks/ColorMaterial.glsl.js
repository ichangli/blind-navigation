/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../views/3d/webgl-engine/core/shaderLibrary/ShaderOutput","../views/3d/webgl-engine/core/shaderLibrary/Slice.glsl","../views/3d/webgl-engine/core/shaderLibrary/Transform.glsl","../views/3d/webgl-engine/core/shaderLibrary/attributes/ObjectAndLayerIdColor.glsl","../views/3d/webgl-engine/core/shaderLibrary/attributes/VertexColor.glsl","../views/3d/webgl-engine/core/shaderLibrary/output/OutputHighlight.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/MultipassTerrainTest.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/VisualVariables.glsl","../views/3d/webgl-engine/core/shaderLibrary/util/AlphaCutoff","../views/3d/webgl-engine/core/shaderLibrary/util/ColorConversion.glsl","../views/3d/webgl-engine/core/shaderLibrary/util/View.glsl","../views/3d/webgl-engine/core/shaderModules/Float4PassUniform","../views/3d/webgl-engine/core/shaderModules/interfaces","../views/3d/webgl-engine/core/shaderModules/ShaderBuilder","../views/3d/webgl-engine/lib/TransparencyPassType","../views/3d/webgl-engine/lib/VertexAttribute"],(function(e,r,o,l,a,i,t,s,d,n,u,g,c,p,b,h,v){"use strict";function C(e){const C=new b.ShaderBuilder,{vertex:w,fragment:f,attributes:y,varyings:O}=C;g.addProjViewLocalOrigin(w,e),C.include(l.Transform,e),C.include(i.VertexColor,e),C.include(d.VisualVariables,e),C.include(a.ObjectAndLayerIdColor,e),y.add(v.VertexAttribute.POSITION,"vec3"),e.vvColor&&y.add(v.VertexAttribute.COLORFEATUREATTRIBUTE,"float"),O.add("vColor","vec4"),O.add("vpos","vec3");const T=e.multipassEnabled&&e.output===r.ShaderOutput.Color;T&&O.add("depth","float"),w.uniforms.add(new c.Float4PassUniform("eColor",(e=>e.color))),w.code.add(p.glsl`
    void main(void) {
      vpos = position;
      forwardNormalizedVertexColor();
      forwardObjectAndLayerIdColor();

      ${e.hasVertexColors?"vColor *= eColor;":e.vvColor?"vColor = eColor * interpolateVVColor(colorFeatureAttribute);":"vColor = eColor;"}
      ${T?"depth = (view * vec4(vpos, 1.0)).z;":""}
      gl_Position = transformPosition(proj, view, vpos);
    }
  `),C.include(o.SliceDraw,e),T&&C.include(s.multipassTerrainTest,e),f.include(u.ColorConversion);const A=e.output===r.ShaderOutput.Highlight;return A&&C.include(t.OutputHighlight,e),e.transparencyPassType===h.TransparencyPassType.ColorAlpha&&(C.outputs.add("fragColor","vec4",0),C.outputs.add("fragAlpha","float",1)),f.code.add(p.glsl`
  void main() {
    discardBySlice(vpos);
    ${T?"terrainDepthTest(depth);":""}
    vec4 fColor = vColor;

    ${e.output===r.ShaderOutput.ObjectAndLayerIdColor?p.glsl`fColor.a = 1.0;`:""}

    if (fColor.a < ${p.glsl.float(n.symbolAlphaCutoff)}) {
      discard;
    }

    ${e.output===r.ShaderOutput.Color?p.glsl`fragColor = highlightSlice(fColor, vpos); ${e.transparencyPassType===h.TransparencyPassType.ColorAlpha?p.glsl`
                  fragColor = premultiplyAlpha(fragColor);
                  fragAlpha = fragColor.a;`:""}`:""}
    ${A?p.glsl`outputHighlight();`:""};
    ${e.output===r.ShaderOutput.ObjectAndLayerIdColor?p.glsl`outputObjectAndLayerIdColor();`:""}
  }
  `),C}const w=Object.freeze(Object.defineProperty({__proto__:null,build:C},Symbol.toStringTag,{value:"Module"}));e.ColorMaterial=w,e.build=C}));
