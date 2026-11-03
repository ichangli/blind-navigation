/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../views/3d/webgl-engine/core/shaderLibrary/ShaderOutput","../views/3d/webgl-engine/core/shaderLibrary/Slice.glsl","../views/3d/webgl-engine/core/shaderLibrary/Transform.glsl","../views/3d/webgl-engine/core/shaderLibrary/attributes/ObjectAndLayerIdColor.glsl","../views/3d/webgl-engine/core/shaderLibrary/attributes/VertexColor.glsl","../views/3d/webgl-engine/core/shaderLibrary/output/OutputHighlight.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/MultipassTerrainTest.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/VisualVariables.glsl","../views/3d/webgl-engine/core/shaderLibrary/util/AlphaCutoff","../views/3d/webgl-engine/core/shaderLibrary/util/ColorConversion.glsl","../views/3d/webgl-engine/core/shaderLibrary/util/View.glsl","../views/3d/webgl-engine/core/shaderModules/Float4PassUniform","../views/3d/webgl-engine/core/shaderModules/FloatPassUniform","../views/3d/webgl-engine/core/shaderModules/interfaces","../views/3d/webgl-engine/core/shaderModules/ShaderBuilder","../views/3d/webgl-engine/lib/TransparencyPassType","../views/3d/webgl-engine/lib/VertexAttribute","../views/3d/webgl-engine/materials/PatternStyle"],(function(e,t,o,a,l,r,i,n,d,s,c,g,u,p,v,f,m,h,w){"use strict";const b=.70710678118,y=b,S=.08715574274;function C(e){const C=new f.ShaderBuilder,P=e.multipassEnabled&&e.output===t.ShaderOutput.Color,{vertex:x,fragment:V,attributes:A,varyings:O}=C;g.addProjViewLocalOrigin(x,e),C.include(a.Transform,e),C.include(r.VertexColor,e),C.include(d.VisualVariables,e),C.include(l.ObjectAndLayerIdColor,e),e.draped?x.uniforms.add(new p.FloatPassUniform("worldToScreenRatio",((e,t)=>1/t.screenToPCSRatio))):A.add(h.VertexAttribute.BOUNDINGRECT,"mat3"),A.add(h.VertexAttribute.POSITION,"vec3"),A.add(h.VertexAttribute.UVMAPSPACE,"vec4"),e.vvColor&&A.add(h.VertexAttribute.COLORFEATUREATTRIBUTE,"float"),O.add("vColor","vec4"),O.add("vpos","vec3"),O.add("vuv","vec2"),P&&O.add("depth","float"),x.uniforms.add(new u.Float4PassUniform("uColor",(e=>e.color)));const R=e.style===w.Style.ForwardDiagonal||e.style===w.Style.BackwardDiagonal||e.style===w.Style.DiagonalCross;return R&&x.code.add(v.glsl`
      const mat2 rotate45 = mat2(${v.glsl.float(b)}, ${v.glsl.float(-y)},
                                 ${v.glsl.float(y)}, ${v.glsl.float(b)});
    `),e.draped||(g.addCameraPosition(x,e),x.uniforms.add(new p.FloatPassUniform("worldToScreenPerDistanceRatio",((e,t)=>1/t.camera.perScreenPixelRatio))),x.code.add(v.glsl`vec3 projectPointToLineSegment(vec3 center, vec3 halfVector, vec3 point) {
float projectedLength = dot(halfVector, point - center) / dot(halfVector, halfVector);
return center + halfVector * clamp(projectedLength, -1.0, 1.0);
}`),x.code.add(v.glsl`vec3 intersectRayPlane(vec3 rayDir, vec3 rayOrigin, vec3 planeNormal, vec3 planePoint) {
float d = dot(planeNormal, planePoint);
float t = (d - dot(planeNormal, rayOrigin)) / dot(planeNormal, rayDir);
return rayOrigin + t * rayDir;
}`),x.code.add(v.glsl`
      float boundingRectDistanceToCamera() {
        vec3 center = vec3(boundingRect[0][0], boundingRect[0][1], boundingRect[0][2]);
        vec3 halfU = vec3(boundingRect[1][0], boundingRect[1][1], boundingRect[1][2]);
        vec3 halfV = vec3(boundingRect[2][0], boundingRect[2][1], boundingRect[2][2]);
        vec3 n = normalize(cross(halfU, halfV));

        vec3 viewDir = - vec3(view[0][2], view[1][2], view[2][2]);

        float viewAngle = dot(viewDir, n);
        float minViewAngle = ${v.glsl.float(S)};

        if (abs(viewAngle) < minViewAngle) {
          // view direction is (almost) parallel to plane -> clamp it to min angle
          float normalComponent = sign(viewAngle) * minViewAngle - viewAngle;
          viewDir = normalize(viewDir + normalComponent * n);
        }

        // intersect view direction with infinite plane that contains bounding rect
        vec3 planeProjected = intersectRayPlane(viewDir, cameraPosition, n, center);

        // clip to bounds by projecting to u and v line segments individually
        vec3 uProjected = projectPointToLineSegment(center, halfU, planeProjected);
        vec3 vProjected = projectPointToLineSegment(center, halfV, planeProjected);

        // use to calculate the closest point to camera on bounding rect
        vec3 closestPoint = uProjected + vProjected - center;

        return length(closestPoint - cameraPosition);
      }
    `)),x.code.add(v.glsl`
    vec2 scaledUV() {
      vec2 uv = uvMapSpace.xy ${R?" * rotate45":""};
      vec2 uvCellOrigin = uvMapSpace.zw ${R?" * rotate45":""};

      ${e.draped?"":v.glsl`
            float distanceToCamera = boundingRectDistanceToCamera();
            float worldToScreenRatio = worldToScreenPerDistanceRatio / distanceToCamera;
          `}

      // Logarithmically discretize ratio to avoid jittering
      float step = 0.1;
      float discreteWorldToScreenRatio = log(worldToScreenRatio);
      discreteWorldToScreenRatio = ceil(discreteWorldToScreenRatio / step) * step;
      discreteWorldToScreenRatio = exp(discreteWorldToScreenRatio);

      vec2 uvOffset = mod(uvCellOrigin * discreteWorldToScreenRatio, ${v.glsl.float(e.patternSpacing)});
      return uvOffset + (uv * discreteWorldToScreenRatio);
    }
  `),x.code.add(v.glsl`
    void main(void) {
      vuv = scaledUV();
      vpos = position;
      ${P?"depth = (view * vec4(vpos, 1.0)).z;":""}
      forwardNormalizedVertexColor();
      forwardObjectAndLayerIdColor();
      ${e.hasVertexColors?"vColor *= uColor;":e.vvColor?"vColor = uColor * interpolateVVColor(colorFeatureAttribute);":"vColor = uColor;"}
      gl_Position = transformPosition(proj, view, vpos);
    }
  `),C.include(o.SliceDraw,e),V.include(c.ColorConversion),e.draped&&V.uniforms.add(new p.FloatPassUniform("texelSize",((e,t)=>1/t.camera.pixelRatio))),e.output===t.ShaderOutput.Highlight&&C.include(i.OutputHighlight,e),P&&C.include(n.multipassTerrainTest,e),e.output!==t.ShaderOutput.Highlight&&(V.code.add(v.glsl`
      const float lineWidth = ${v.glsl.float(e.lineWidth)};
      const float spacing = ${v.glsl.float(e.patternSpacing)};
      const float spacingINV = ${v.glsl.float(1/e.patternSpacing)};

      float coverage(float p, float txlSize) {
        p = mod(p, spacing);

        float halfTxlSize = txlSize / 2.0;

        float start = p - halfTxlSize;
        float end = p + halfTxlSize;

        float coverage = (ceil(end * spacingINV) - floor(start * spacingINV)) * lineWidth;
        coverage -= min(lineWidth, mod(start, spacing));
        coverage -= max(lineWidth - mod(end, spacing), 0.0);

        return coverage / txlSize;
      }
    `),e.draped||V.code.add(v.glsl`const int maxSamples = 5;
float sampleAA(float p) {
vec2 dxdy = abs(vec2(dFdx(p), dFdy(p)));
float fwidth = dxdy.x + dxdy.y;
ivec2 samples = 1 + ivec2(clamp(dxdy, 0.0, float(maxSamples - 1)));
vec2 invSamples = 1.0 / vec2(samples);
float accumulator = 0.0;
for (int j = 0; j < maxSamples; j++) {
if(j >= samples.y) {
break;
}
for (int i = 0; i < maxSamples; i++) {
if(i >= samples.x) {
break;
}
vec2 step = vec2(i,j) * invSamples - 0.5;
accumulator += coverage(p + step.x * dxdy.x + step.y * dxdy.y, fwidth);
}
}
accumulator /= float(samples.x * samples.y);
return accumulator;
}`)),e.transparencyPassType===m.TransparencyPassType.ColorAlpha&&(C.outputs.add("fragColor","vec4",0),C.outputs.add("fragAlpha","float",1)),V.code.add(v.glsl`
    void main() {
      discardBySlice(vpos);
      ${P?"terrainDepthTest(depth);":""}
      vec4 color = vColor;
      color = highlightSlice(color, vpos);

      ${e.output!==t.ShaderOutput.Highlight?v.glsl`color.a *= ${T(e)};`:""}

      ${e.output===t.ShaderOutput.ObjectAndLayerIdColor?v.glsl`color.a = 1.0;`:""}

      if (color.a < ${v.glsl.float(s.symbolAlphaCutoff)}) {
        discard;
      }

      ${e.output===t.ShaderOutput.Color?v.glsl`fragColor = color; ${e.transparencyPassType===m.TransparencyPassType.ColorAlpha?v.glsl`
                    fragColor = premultiplyAlpha(fragColor);
                    fragAlpha = fragColor.a;`:""}`:""}
      ${e.output===t.ShaderOutput.Highlight?v.glsl`outputHighlight();`:""}
      ${e.output===t.ShaderOutput.ObjectAndLayerIdColor?v.glsl`outputObjectAndLayerIdColor();`:""}
    }
  `),C}function T(e){function t(t){return e.draped?v.glsl`coverage(vuv.${t}, texelSize)`:v.glsl`sampleAA(vuv.${t})`}switch(e.style){case w.Style.ForwardDiagonal:case w.Style.Horizontal:return t("y");case w.Style.BackwardDiagonal:case w.Style.Vertical:return t("x");case w.Style.DiagonalCross:case w.Style.Cross:return v.glsl`
        1.0 - (1.0 - ${t("x")}) * (1.0 - ${t("y")})
      `;default:return"0.0"}}const P=Object.freeze(Object.defineProperty({__proto__:null,build:C},Symbol.toStringTag,{value:"Module"}));e.Pattern=P,e.build=C}));
