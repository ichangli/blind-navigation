/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../views/3d/webgl-engine/core/shaderLibrary/ShaderOutput","../views/3d/webgl-engine/core/shaderLibrary/Slice.glsl","../views/3d/webgl-engine/core/shaderLibrary/Transform.glsl","../views/3d/webgl-engine/core/shaderLibrary/attributes/VertexColor.glsl","../views/3d/webgl-engine/core/shaderLibrary/output/OutputHighlight.glsl","../views/3d/webgl-engine/core/shaderLibrary/util/AlphaCutoff","../views/3d/webgl-engine/core/shaderLibrary/util/View.glsl","../views/3d/webgl-engine/core/shaderModules/Float4PassUniform","../views/3d/webgl-engine/core/shaderModules/FloatPassUniform","../views/3d/webgl-engine/core/shaderModules/interfaces","../views/3d/webgl-engine/core/shaderModules/ShaderBuilder","../views/3d/webgl-engine/lib/VertexAttribute"],(function(e,r,o,i,l,t,a,s,d,n,g,u,c){"use strict";function h(e){const h=new u.ShaderBuilder,{vertex:w,fragment:b}=h;return h.include(i.Transform,e),h.include(l.VertexColor,e),s.addProjViewLocalOrigin(w,e),h.attributes.add(c.VertexAttribute.POSITION,"vec3"),h.varyings.add("vpos","vec3"),w.code.add(g.glsl`void main(void) {
vpos = position;
forwardNormalizedVertexColor();
gl_Position = transformPosition(proj, view, vpos);
}`),e.output===r.ShaderOutput.Highlight&&h.include(t.OutputHighlight,e),h.include(o.SliceDraw,e),b.uniforms.add(new n.FloatPassUniform("alphaCoverage",((e,r)=>Math.min(1,e.width*r.camera.pixelRatio)))),e.hasVertexColors||b.uniforms.add(new d.Float4PassUniform("constantColor",(e=>e.color))),b.code.add(g.glsl`
  void main() {
    discardBySlice(vpos);

    vec4 color = ${e.hasVertexColors?"vColor":"constantColor"};

    ${e.output===r.ShaderOutput.ObjectAndLayerIdColor?g.glsl`color.a = 1.0;`:""}

    if (color.a < ${g.glsl.float(a.symbolAlphaCutoff)}) {
      discard;
    }

    ${e.output===r.ShaderOutput.Color?g.glsl`fragColor = highlightSlice(color, vpos);`:""}
    ${e.output===r.ShaderOutput.Highlight?g.glsl`outputHighlight();`:""}
  }
  `),h}const w=Object.freeze(Object.defineProperty({__proto__:null,build:h},Symbol.toStringTag,{value:"Module"}));e.NativeLine=w,e.build=h}));
