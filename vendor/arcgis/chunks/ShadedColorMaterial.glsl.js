/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../core/libs/gl-matrix-2/factories/vec4f64","../views/3d/webgl-engine/core/shaderLibrary/ScreenSizeScaling.glsl","../views/3d/webgl-engine/core/shaderLibrary/ShaderOutput","../views/3d/webgl-engine/core/shaderLibrary/Slice.glsl","../views/3d/webgl-engine/core/shaderLibrary/Transform.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/MultipassTerrainTest.glsl","../views/3d/webgl-engine/core/shaderLibrary/util/AlphaCutoff","../views/3d/webgl-engine/core/shaderLibrary/util/ColorConversion.glsl","../views/3d/webgl-engine/core/shaderLibrary/util/View.glsl","../views/3d/webgl-engine/core/shaderModules/Float3PassUniform","../views/3d/webgl-engine/core/shaderModules/Float4PassUniform","../views/3d/webgl-engine/core/shaderModules/interfaces","../views/3d/webgl-engine/core/shaderModules/ShaderBuilder","../views/3d/webgl-engine/lib/TransparencyPassType","../views/3d/webgl-engine/lib/VertexAttribute"],(function(e,r,o,i,a,l,d,s,n,t,c,g,u,v,h,w){"use strict";function b(e){const r=new v.ShaderBuilder,b=e.multipassEnabled&&e.output===i.ShaderOutput.Color;r.include(l.Transform,e),r.include(o.ScreenSizeScaling,e),r.include(a.SliceDraw,e);const{vertex:p,fragment:m}=r;return m.include(n.ColorConversion),t.addProjViewLocalOrigin(p,e),m.uniforms.add(new g.Float4PassUniform("uColor",(e=>e.color))),r.attributes.add(w.VertexAttribute.POSITION,"vec3"),r.varyings.add("vWorldPosition","vec3"),b&&r.varyings.add("depth","float"),e.screenSizeEnabled&&r.attributes.add(w.VertexAttribute.OFFSET,"vec3"),e.shadingEnabled&&(t.addViewNormal(p),r.attributes.add(w.VertexAttribute.NORMAL,"vec3"),r.varyings.add("vViewNormal","vec3")),p.code.add(u.glsl`
    void main(void) {
      vWorldPosition = ${e.screenSizeEnabled?"screenSizeScaling(offset, position)":"position"};
  `),e.shadingEnabled&&p.code.add(u.glsl`vec3 worldNormal = normal;
vViewNormal = (viewNormal * vec4(worldNormal, 1)).xyz;`),p.code.add(u.glsl`
    ${b?"depth = (view * vec4(vWorldPosition, 1.0)).z;":""}
    gl_Position = transformPosition(proj, view, vWorldPosition);
  }
  `),b&&r.include(d.multipassTerrainTest,e),m.code.add(u.glsl`
    void main() {
      discardBySlice(vWorldPosition);
      ${b?"terrainDepthTest(depth);":""}
    `),e.shadingEnabled?(m.uniforms.add(new c.Float3PassUniform("shadingDirection",(e=>e.shadingDirection))),m.uniforms.add(new g.Float4PassUniform("shadedColor",(e=>f(e.shadingTint,e.color)))),m.code.add(u.glsl`vec3 viewNormalNorm = normalize(vViewNormal);
float shadingFactor = 1.0 - clamp(-dot(viewNormalNorm, shadingDirection), 0.0, 1.0);
vec4 finalColor = mix(uColor, shadedColor, shadingFactor);`)):m.code.add(u.glsl`vec4 finalColor = uColor;`),e.transparencyPassType===h.TransparencyPassType.ColorAlpha&&(r.outputs.add("fragColor","vec4",0),r.outputs.add("fragAlpha","float",1)),m.code.add(u.glsl`
      ${e.output===i.ShaderOutput.ObjectAndLayerIdColor?u.glsl`finalColor.a = 1.0;`:""}
      if (finalColor.a < ${u.glsl.float(s.symbolAlphaCutoff)}) {
        discard;
      }

      ${e.output===i.ShaderOutput.Color?u.glsl`fragColor = highlightSlice(finalColor, vWorldPosition); ${e.transparencyPassType===h.TransparencyPassType.ColorAlpha?u.glsl`
                    fragColor = premultiplyAlpha(fragColor);
                    fragAlpha = fragColor.a;`:""}`:""}
    }
    `),r}function f(e,r){const o=1-e[3],i=e[3]+r[3]*o;return 0===i?(p[3]=i,p):(p[0]=(e[0]*e[3]+r[0]*r[3]*o)/i,p[1]=(e[1]*e[3]+r[1]*r[3]*o)/i,p[2]=(e[2]*e[3]+r[2]*r[3]*o)/i,p[3]=r[3],p)}const p=r.create(),m=Object.freeze(Object.defineProperty({__proto__:null,build:b},Symbol.toStringTag,{value:"Module"}));e.ShadedColorMaterialShader=m,e.build=b}));
