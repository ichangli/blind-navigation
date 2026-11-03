/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../views/3d/webgl-engine/core/shaderLibrary/ShaderOutput","../views/3d/webgl-engine/core/shaderLibrary/Slice.glsl","../views/3d/webgl-engine/core/shaderLibrary/Transform.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/MultipassTerrainTest.glsl","../views/3d/webgl-engine/core/shaderLibrary/util/AlphaCutoff","../views/3d/webgl-engine/core/shaderLibrary/util/ColorConversion.glsl","../views/3d/webgl-engine/core/shaderLibrary/util/View.glsl","../views/3d/webgl-engine/core/shaderModules/FloatPassUniform","../views/3d/webgl-engine/core/shaderModules/interfaces","../views/3d/webgl-engine/core/shaderModules/ShaderBuilder","../views/3d/webgl-engine/core/shaderModules/Texture2DPassUniform","../views/3d/webgl-engine/lib/TransparencyPassType","../views/3d/webgl-engine/lib/VertexAttribute"],(function(e,r,a,i,o,s,t,l,d,n,g,p,u,c){"use strict";function v(e){const v=new g.ShaderBuilder,{vertex:b,fragment:f}=v;return l.addProjViewLocalOrigin(b,e),v.include(i.Transform,e),v.attributes.add(c.VertexAttribute.POSITION,"vec3"),v.attributes.add(c.VertexAttribute.UV0,"vec2"),e.perspectiveInterpolation&&v.attributes.add(c.VertexAttribute.PERSPECTIVEDIVIDE,"float"),v.varyings.add("vpos","vec3"),e.multipassEnabled&&v.varyings.add("depth","float"),b.code.add(n.glsl`
    void main(void) {
      vpos = position;
      ${e.multipassEnabled?"depth = (view * vec4(vpos, 1.0)).z;":""}
      vTexCoord = uv0;
      gl_Position = transformPosition(proj, view, vpos);

      ${e.perspectiveInterpolation?"gl_Position *= perspectiveDivide;":""}
    }
  `),v.include(a.SliceDraw,e),v.include(o.multipassTerrainTest,e),f.uniforms.add(new p.Texture2DPassUniform("tex",(e=>e.texture)),new d.FloatPassUniform("opacity",(e=>e.opacity))),v.varyings.add("vTexCoord","vec2"),e.transparencyPassType===u.TransparencyPassType.ColorAlpha&&(v.outputs.add("fragColor","vec4",0),v.outputs.add("fragAlpha","float",1)),f.include(t.ColorConversion),f.code.add(n.glsl`
    void main() {
      discardBySlice(vpos);
      ${e.multipassEnabled?"terrainDepthTest(depth);":""}
      fragColor = texture(tex, vTexCoord) * opacity;

      if (fragColor.a < ${n.glsl.float(s.defaultMaskAlphaCutoff)}) {
        discard;
      }

      fragColor = highlightSlice(fragColor, vpos);
      ${e.transparencyPassType===u.TransparencyPassType.ColorAlpha?n.glsl`
              fragColor = premultiplyAlpha(fragColor);
              fragAlpha = fragColor.a;`:""}
      ${e.output===r.ShaderOutput.ObjectAndLayerIdColor?n.glsl`
              fragColor = vec4(0,0,0,1);`:""}
    }
    `),v}const b=Object.freeze(Object.defineProperty({__proto__:null,build:v},Symbol.toStringTag,{value:"Module"}));e.ImageMaterial=b,e.build=v}));
