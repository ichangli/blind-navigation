/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../views/3d/webgl-engine/core/shaderLibrary/ShaderOutput","../views/3d/webgl-engine/core/shaderLibrary/Slice.glsl","../views/3d/webgl-engine/core/shaderLibrary/attributes/ObjectAndLayerIdColor.glsl","../views/3d/webgl-engine/core/shaderLibrary/attributes/RibbonVertexPosition.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/LineStipple.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/MarkerSizing.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/MultipassTerrainTest.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/PiUtils.glsl","../views/3d/webgl-engine/core/shaderLibrary/util/AlphaCutoff","../views/3d/webgl-engine/core/shaderLibrary/util/ColorConversion.glsl","../views/3d/webgl-engine/core/shaderLibrary/util/View.glsl","../views/3d/webgl-engine/core/shaderModules/Float2PassUniform","../views/3d/webgl-engine/core/shaderModules/Float4PassUniform","../views/3d/webgl-engine/core/shaderModules/FloatPassUniform","../views/3d/webgl-engine/core/shaderModules/interfaces","../views/3d/webgl-engine/core/shaderModules/Matrix4PassUniform","../views/3d/webgl-engine/core/shaderModules/ShaderBuilder","../views/3d/webgl-engine/lib/TransparencyPassType","../views/3d/webgl-engine/lib/VertexAttribute","../views/3d/webgl-engine/shaders/LineMarkerTechniqueConfiguration","../views/3d/webgl-engine/shaders/RibbonLineTechniqueConfiguration"],(function(e,i,t,n,o,r,a,l,s,d,p,c,g,v,f,m,u,h,S,b,D,x){"use strict";const L=1;function w(e){const w=new h.ShaderBuilder,{attributes:y,varyings:C,constants:P,vertex:A,fragment:R}=w;w.include(s.PiUtils),w.include(o.RibbonVertexPosition,e),w.include(r.LineStipple,e);const F=e.applyMarkerOffset&&!e.draped;F&&(A.uniforms.add(new f.FloatPassUniform("markerScale",(e=>e.markerScale))),w.include(a.MarkerSizing,{space:D.LineMarkerSpace.World,draped:!1})),w.include(n.ObjectAndLayerIdColor,e),c.addProjViewLocalOrigin(A,e),A.uniforms.add(new u.Matrix4PassUniform("inverseProjectionMatrix",((e,i)=>i.camera.inverseProjectionMatrix)),new g.Float2PassUniform("nearFar",((e,i)=>i.camera.nearFar)),new f.FloatPassUniform("miterLimit",(e=>"miter"!==e.join?0:e.miterLimit)),new v.Float4PassUniform("viewport",((e,i)=>i.camera.fullViewport))),A.constants.add("LARGE_HALF_FLOAT","float",65500),y.add(b.VertexAttribute.POSITION,"vec3"),y.add(b.VertexAttribute.PREVPOSITION,"vec3"),y.add(b.VertexAttribute.NEXTPOSITION,"vec3"),y.add(b.VertexAttribute.SUBDIVISIONFACTOR,"float"),y.add(b.VertexAttribute.UV0,"vec2"),C.add("vColor","vec4"),C.add("vpos","vec3"),C.add("vLineDistance","float"),C.add("vLineWidth","float");const T=e.multipassEnabled&&e.output===i.ShaderOutput.Color;T&&C.add("depth","float");const E=e.stippleEnabled;E&&C.add("vLineSizeInv","float"),P.add("aaWidth","float",e.stippleEnabled?0:1);const j=e.capType===x.CapType.ROUND,z=e.stippleEnabled&&j,O=e.falloffEnabled||z;O&&C.add("vLineDistanceNorm","float"),j&&(C.add("vSegmentSDF","float"),C.add("vReverseSegmentSDF","float")),A.code.add(m.glsl`#define PERPENDICULAR(v) vec2(v.y, -v.x);
float interp(float ncp, vec4 a, vec4 b) {
return (-ncp - a.z) / (b.z - a.z);
}
vec2 rotate(vec2 v, float a) {
float s = sin(a);
float c = cos(a);
mat2 m = mat2(c, -s, s, c);
return m * v;
}`),A.code.add(m.glsl`vec4 projectAndScale(vec4 pos) {
vec4 posNdc = proj * pos;
posNdc.xy *= viewport.zw / posNdc.w;
return posNdc;
}`),A.code.add(m.glsl`
    void clipAndTransform(inout vec4 pos, inout vec4 prev, inout vec4 next, in bool isStartVertex) {
      float vnp = nearFar[0] * 0.99;

      if(pos.z > -nearFar[0]) {
        //current pos behind ncp --> we need to clip
        if (!isStartVertex) {
          if(prev.z < -nearFar[0]) {
            //previous in front of ncp
            pos = mix(prev, pos, interp(vnp, prev, pos));
            next = pos;
          } else {
            pos = vec4(0.0, 0.0, 0.0, 1.0);
          }
        } else {
          if(next.z < -nearFar[0]) {
            //next in front of ncp
            pos = mix(pos, next, interp(vnp, pos, next));
            prev = pos;
          } else {
            pos = vec4(0.0, 0.0, 0.0, 1.0);
          }
        }
      } else {
        //current position visible
        if (prev.z > -nearFar[0]) {
          //previous behind ncp
          prev = mix(pos, prev, interp(vnp, pos, prev));
        }
        if (next.z > -nearFar[0]) {
          //next behind ncp
          next = mix(next, pos, interp(vnp, next, pos));
        }
      }

      ${T?"depth = pos.z;":""}

      pos = projectAndScale(pos);
      next = projectAndScale(next);
      prev = projectAndScale(prev);
    }
  `),c.addPixelRatio(A),A.code.add(m.glsl`
  void main(void) {
    // unpack values from uv0.y
    bool isStartVertex = abs(abs(uv0.y)-3.0) == 1.0;

    float coverage = 1.0;

    // Check for special value of uv0.y which is used by the Renderer when graphics
    // are removed before the VBO is recompacted. If this is the case, then we just
    // project outside of clip space.
    if (uv0.y == 0.0) {
      // Project out of clip space
      gl_Position = vec4(1e038, 1e038, 1e038, 1.0);
    }
    else {
      bool isJoin = abs(uv0.y) < 3.0;
      float lineSize = getSize();

      if (lineSize < 1.0) {
        coverage = lineSize; // convert sub-pixel coverage to alpha
        lineSize = 1.0;
      }
      lineSize += aaWidth;

      float lineWidth = lineSize * pixelRatio;
      vLineWidth = lineWidth;
      ${E?m.glsl`vLineSizeInv = 1.0 / lineSize;`:""}

      vec4 pos  = view * vec4(position, 1.0);
      vec4 prev = view * vec4(prevPosition, 1.0);
      vec4 next = view * vec4(nextPosition, 1.0);
  `),F&&A.code.add(m.glsl`vec4 other = isStartVertex ? next : prev;
bool markersHidden = areWorldMarkersHidden(pos, other);
if(!isJoin && !markersHidden) {
pos.xyz += normalize(other.xyz - pos.xyz) * getWorldMarkerSize(pos) * 0.5;
}`),A.code.add(m.glsl`clipAndTransform(pos, prev, next, isStartVertex);
vec2 left = (pos.xy - prev.xy);
vec2 right = (next.xy - pos.xy);
float leftLen = length(left);
float rightLen = length(right);`);(e.stippleEnabled||j)&&A.code.add(m.glsl`
      float isEndVertex = float(!isStartVertex);
      vec2 segmentOrigin = mix(pos.xy, prev.xy, isEndVertex);
      vec2 segment = mix(right, left, isEndVertex);
      ${j?m.glsl`vec2 segmentEnd = mix(next.xy, pos.xy, isEndVertex);`:""}
    `),A.code.add(m.glsl`left = (leftLen > 0.001) ? left/leftLen : vec2(0.0, 0.0);
right = (rightLen > 0.001) ? right/rightLen : vec2(0.0, 0.0);
vec2 capDisplacementDir = vec2(0, 0);
vec2 joinDisplacementDir = vec2(0, 0);
float displacementLen = lineWidth;
if (isJoin) {
bool isOutside = (left.x * right.y - left.y * right.x) * uv0.y > 0.0;
joinDisplacementDir = normalize(left + right);
joinDisplacementDir = PERPENDICULAR(joinDisplacementDir);
if (leftLen > 0.001 && rightLen > 0.001) {
float nDotSeg = dot(joinDisplacementDir, left);
displacementLen /= length(nDotSeg * left - joinDisplacementDir);
if (!isOutside) {
displacementLen = min(displacementLen, min(leftLen, rightLen)/abs(nDotSeg));
}
}
if (isOutside && (displacementLen > miterLimit * lineWidth)) {`),e.roundJoins?A.code.add(m.glsl`
        vec2 startDir = leftLen < 0.001 ? right : left;
        startDir = PERPENDICULAR(startDir);

        vec2 endDir = rightLen < 0.001 ? left : right;
        endDir = PERPENDICULAR(endDir);

        float factor = ${e.stippleEnabled?m.glsl`min(1.0, subdivisionFactor * ${m.glsl.float((L+2)/(L+1))})`:m.glsl`subdivisionFactor`};

        float rotationAngle = acos(clamp(dot(startDir, endDir), -1.0, 1.0));
        joinDisplacementDir = rotate(startDir, -sign(uv0.y) * factor * rotationAngle);
      `):A.code.add(m.glsl`if (leftLen < 0.001) {
joinDisplacementDir = right;
}
else if (rightLen < 0.001) {
joinDisplacementDir = left;
}
else {
joinDisplacementDir = (isStartVertex || subdivisionFactor > 0.0) ? right : left;
}
joinDisplacementDir = PERPENDICULAR(joinDisplacementDir);`);const V=e.capType!==x.CapType.BUTT;return A.code.add(m.glsl`
        displacementLen = lineWidth;
      }
    } else {
      // CAP handling ---------------------------------------------------
      joinDisplacementDir = isStartVertex ? right : left;
      joinDisplacementDir = PERPENDICULAR(joinDisplacementDir);

      ${V?m.glsl`capDisplacementDir = isStartVertex ? -right : left;`:""}
    }
  `),A.code.add(m.glsl`
    // Displacement (in pixels) caused by join/or cap
    vec2 dpos = joinDisplacementDir * sign(uv0.y) * displacementLen + capDisplacementDir * displacementLen;
    float lineDistNorm = sign(uv0.y) * pos.w;

    vLineDistance =  lineWidth * lineDistNorm;
    ${O?m.glsl`vLineDistanceNorm = lineDistNorm;`:""}

    pos.xy += dpos;
  `),j&&A.code.add(m.glsl`vec2 segmentDir = normalize(segment);
vSegmentSDF = (isJoin && isStartVertex) ? LARGE_HALF_FLOAT : (dot(pos.xy - segmentOrigin, segmentDir) * pos.w) ;
vReverseSegmentSDF = (isJoin && !isStartVertex) ? LARGE_HALF_FLOAT : (dot(pos.xy - segmentEnd, -segmentDir) * pos.w);`),e.stippleEnabled&&(e.draped?A.uniforms.add(new f.FloatPassUniform("worldToScreenRatio",((e,i)=>1/i.screenToPCSRatio))):A.code.add(m.glsl`vec3 segmentCenter = mix((nextPosition + position) * 0.5, (position + prevPosition) * 0.5, isEndVertex);
float worldToScreenRatio = computeWorldToScreenRatio(segmentCenter);`),A.code.add(m.glsl`float segmentLengthScreenDouble = length(segment);
float segmentLengthScreen = segmentLengthScreenDouble * 0.5;
float discreteWorldToScreenRatio = discretizeWorldToScreenRatio(worldToScreenRatio);
float segmentLengthRender = length(mix(nextPosition - position, position - prevPosition, isEndVertex));
vStipplePatternStretch = worldToScreenRatio / discreteWorldToScreenRatio;`),e.draped?A.code.add(m.glsl`float segmentLengthPseudoScreen = segmentLengthScreen / pixelRatio * discreteWorldToScreenRatio / worldToScreenRatio;
float startPseudoScreen = uv0.x * discreteWorldToScreenRatio - mix(0.0, segmentLengthPseudoScreen, isEndVertex);`):A.code.add(m.glsl`float startPseudoScreen = mix(uv0.x, uv0.x - segmentLengthRender, isEndVertex) * discreteWorldToScreenRatio;
float segmentLengthPseudoScreen = segmentLengthRender * discreteWorldToScreenRatio;`),A.uniforms.add(new f.FloatPassUniform("stipplePatternPixelSize",(e=>r.computePixelSize(e)))),A.code.add(m.glsl`float patternLength = lineSize * stipplePatternPixelSize;
vStippleDistanceLimits = computeStippleDistanceLimits(startPseudoScreen, segmentLengthPseudoScreen, segmentLengthScreen, patternLength);
vStippleDistance = mix(vStippleDistanceLimits.x, vStippleDistanceLimits.y, isEndVertex);
if (segmentLengthScreenDouble >= 0.001) {
vec2 stippleDisplacement = pos.xy - segmentOrigin;
float stippleDisplacementFactor = dot(segment, stippleDisplacement) / (segmentLengthScreenDouble * segmentLengthScreenDouble);
vStippleDistance += (stippleDisplacementFactor - isEndVertex) * (vStippleDistanceLimits.y - vStippleDistanceLimits.x);
}
vStippleDistanceLimits *= pos.w;
vStippleDistance *= pos.w;
vStippleDistanceLimits = isJoin ?
vStippleDistanceLimits :
isStartVertex ?
vec2(-1e34, vStippleDistanceLimits.y) :
vec2(vStippleDistanceLimits.x, 1e34);`)),A.code.add(m.glsl`
      // Convert back into NDC
      pos.xy = (pos.xy / viewport.zw) * pos.w;

      vColor = getColor();
      vColor.a *= coverage;

      ${e.wireframe&&!e.draped?"pos.z -= 0.001 * pos.w;":""}

      // transform final position to camera space for slicing
      vpos = (inverseProjectionMatrix * pos).xyz;
      gl_Position = pos;
      forwardObjectAndLayerIdColor();
    }
  }
  `),T&&w.include(l.multipassTerrainTest,e),w.include(t.SliceDraw,e),R.include(p.ColorConversion),R.code.add(m.glsl`
  void main() {
    discardBySlice(vpos);
    ${T?"terrainDepthTest(depth);":""}
  `),e.wireframe?R.code.add(m.glsl`vec4 finalColor = vec4(1.0, 0.0, 1.0, 1.0);`):(j&&R.code.add(m.glsl`
        float sdf = min(vSegmentSDF, vReverseSegmentSDF);
        vec2 fragmentPosition = vec2(
          min(sdf, 0.0),
          vLineDistance
        ) * gl_FragCoord.w;

        float fragmentRadius = length(fragmentPosition);
        float fragmentCapSDF = (fragmentRadius - vLineWidth) * 0.5; // Divide by 2 to transform from double pixel scale
        float capCoverage = clamp(0.5 - fragmentCapSDF, 0.0, 1.0);

        if (capCoverage < ${m.glsl.float(d.symbolAlphaCutoff)}) {
          discard;
        }
      `),z?R.code.add(m.glsl`
      vec2 stipplePosition = vec2(
        min(getStippleSDF() * 2.0 - 1.0, 0.0),
        vLineDistanceNorm * gl_FragCoord.w
      );
      float stippleRadius = length(stipplePosition * vLineWidth);
      float stippleCapSDF = (stippleRadius - vLineWidth) * 0.5; // Divide by 2 to transform from double pixel scale
      float stippleCoverage = clamp(0.5 - stippleCapSDF, 0.0, 1.0);
      float stippleAlpha = step(${m.glsl.float(d.symbolAlphaCutoff)}, stippleCoverage);
      `):R.code.add(m.glsl`float stippleAlpha = getStippleAlpha();`),e.output!==i.ShaderOutput.ObjectAndLayerIdColor&&R.code.add(m.glsl`discardByStippleAlpha(stippleAlpha, stippleAlphaColorDiscard);`),R.uniforms.add(new v.Float4PassUniform("intrinsicColor",(e=>e.color))),R.code.add(m.glsl`vec4 color = intrinsicColor * vColor;`),e.innerColorEnabled&&(R.uniforms.add(new v.Float4PassUniform("innerColor",(e=>e.innerColor??e.color)),new f.FloatPassUniform("innerWidth",((e,i)=>e.innerWidth*i.camera.pixelRatio))),R.code.add(m.glsl`float distToInner = abs(vLineDistance * gl_FragCoord.w) - innerWidth;
float innerAA = clamp(0.5 - distToInner, 0.0, 1.0);
float innerAlpha = innerColor.a + color.a * (1.0 - innerColor.a);
color = mix(color, vec4(innerColor.rgb, innerAlpha), innerAA);`)),R.code.add(m.glsl`vec4 finalColor = blendStipple(color, stippleAlpha);`),e.falloffEnabled&&(R.uniforms.add(new f.FloatPassUniform("falloff",(e=>e.falloff))),R.code.add(m.glsl`finalColor.a *= pow(max(0.0, 1.0 - abs(vLineDistanceNorm * gl_FragCoord.w)), falloff);`)),e.stippleEnabled||R.code.add(m.glsl`float featherStartDistance = max(vLineWidth - 2.0, 0.0);
float value = abs(vLineDistance) * gl_FragCoord.w;
float feather = (value - featherStartDistance) / (vLineWidth - featherStartDistance);
finalColor.a *= 1.0 - clamp(feather, 0.0, 1.0);`)),e.transparencyPassType===S.TransparencyPassType.ColorAlpha&&(w.outputs.add("fragColor","vec4",0),w.outputs.add("fragAlpha","float",1)),R.code.add(m.glsl`
    ${e.output===i.ShaderOutput.ObjectAndLayerIdColor?m.glsl`finalColor.a = 1.0;`:""}

    if (finalColor.a < ${m.glsl.float(d.symbolAlphaCutoff)}) {
      discard;
    }

    ${e.output===i.ShaderOutput.Color?m.glsl`fragColor = highlightSlice(finalColor, vpos);`:""}
    ${e.output===i.ShaderOutput.Color&&e.transparencyPassType===S.TransparencyPassType.ColorAlpha?m.glsl`
            fragColor = premultiplyAlpha(fragColor);
            fragAlpha = fragColor.a;`:""}
    ${e.output===i.ShaderOutput.Highlight?m.glsl`fragColor = vec4(1.0);`:""}
    ${e.output===i.ShaderOutput.ObjectAndLayerIdColor?m.glsl`outputObjectAndLayerIdColor();`:""}
  }
  `),w}const y=Object.freeze(Object.defineProperty({__proto__:null,build:w,ribbonlineNumRoundJoinSubdivisions:L},Symbol.toStringTag,{value:"Module"}));e.RibbonLine=y,e.build=w,e.ribbonlineNumRoundJoinSubdivisions=L}));
