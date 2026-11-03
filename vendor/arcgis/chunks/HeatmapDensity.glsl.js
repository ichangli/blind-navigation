/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../views/3d/webgl-engine/core/shaderLibrary/util/View.glsl","../views/3d/webgl-engine/core/shaderModules/FloatPassUniform","../views/3d/webgl-engine/core/shaderModules/interfaces","../views/3d/webgl-engine/core/shaderModules/ShaderBuilder","../views/3d/webgl-engine/lib/VertexAttribute"],(function(e,t,i,r,a,o){"use strict";function s(e){const s=new a.ShaderBuilder,{vertex:d,fragment:l,attributes:u,varyings:n}=s;t.addProjViewLocalOrigin(d,e);const{isAttributeDriven:c,usesHalfFloat:f}=e;return u.add(o.VertexAttribute.POSITION,"vec3"),u.add(o.VertexAttribute.UV0,"vec2"),c&&(u.add(o.VertexAttribute.FEATUREATTRIBUTE,"float"),n.add("attributeValue","float")),f&&s.constants.add("compressionFactor","float",.25),n.add("unitCirclePos","vec2"),d.uniforms.add(new i.FloatPassUniform("radius",(({resolutionForScale:e,searchRadius:t},{camera:i,screenToWorldRatio:r,overlayStretch:a})=>2*t*(0===e?1:e/r)*i.pixelRatio/i.fullViewport[2]/a))),d.code.add(r.glsl`
    void main() {
      unitCirclePos = uv0;

      vec4 posProj = proj * (view * vec4(${o.VertexAttribute.POSITION}, 1.0));
      vec4 quadOffset = vec4(unitCirclePos * radius, 0.0, 0.0);

      ${c?r.glsl`attributeValue = ${o.VertexAttribute.FEATUREATTRIBUTE};`:""}
      gl_Position = posProj + quadOffset;
    }
  `),l.code.add(r.glsl`
    void main() {
      float radiusRatioSquared = dot(unitCirclePos, unitCirclePos);
      if (radiusRatioSquared > 1.0) {
        discard;
      }

      float oneMinusRadiusRatioSquared = 1.0 - radiusRatioSquared;
      float density = oneMinusRadiusRatioSquared * oneMinusRadiusRatioSquared ${c?r.glsl` * attributeValue`:""} ${f?r.glsl` * compressionFactor`:""};
      fragColor = vec4(density);
    }
  `),s}const d=Object.freeze(Object.defineProperty({__proto__:null,build:s},Symbol.toStringTag,{value:"Module"}));e.HeatmapDensity=d,e.build=s}));
