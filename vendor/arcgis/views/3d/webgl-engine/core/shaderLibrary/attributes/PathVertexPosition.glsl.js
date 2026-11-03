/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../../../core/libs/gl-matrix-2/factories/vec2f64","./PositionAttribute.glsl","../../shaderModules/Float2PassUniform","../../shaderModules/Float3PassUniform","../../shaderModules/Float4sPassUniform","../../shaderModules/FloatsPassUniform","../../shaderModules/interfaces","../../../lib/VertexAttribute","../../../materials/VisualVariablePassParameters"],(function(e,o,i,r,t,a,l,s,v,c){"use strict";const n=8;function f(e,o){const f=v.VertexAttribute.FEATUREVALUE;e.attributes.add(f,"vec4");const p=e.vertex;p.code.add(s.glsl`
  bool isCapVertex() {
    return ${f}.w == 1.0;
  }
  `),p.uniforms.add(new r.Float2PassUniform("size",(e=>e.size))),o.vvSize?(p.uniforms.add(new t.Float3PassUniform("vvSizeMinSize",(e=>e.vvSize.minSize)),new t.Float3PassUniform("vvSizeMaxSize",(e=>e.vvSize.maxSize)),new t.Float3PassUniform("vvSizeOffset",(e=>e.vvSize.offset)),new t.Float3PassUniform("vvSizeFactor",(e=>e.vvSize.factor))),p.code.add(s.glsl`
    vec2 getSize() {
      return size * clamp(vvSizeOffset + ${f}.x * vvSizeFactor, vvSizeMinSize, vvSizeMaxSize).xz;
    }
    `)):p.code.add(s.glsl`vec2 getSize(){
return size;
}`),o.vvOpacity?(p.constants.add("vvOpacityNumber","int",n),p.uniforms.add(new l.FloatsPassUniform("vvOpacityValues",(e=>e.vvOpacity.values),n),new l.FloatsPassUniform("vvOpacityOpacities",(e=>e.vvOpacity.opacityValues),n)),p.code.add(s.glsl`
    vec4 applyOpacity(vec4 color) {
      float value = ${f}.z;
      if (value <= vvOpacityValues[0]) {
        return vec4( color.xyz, vvOpacityOpacities[0]);
      }

      for (int i = 1; i < vvOpacityNumber; ++i) {
        if (vvOpacityValues[i] >= value) {
          float f = (value - vvOpacityValues[i-1]) / (vvOpacityValues[i] - vvOpacityValues[i-1]);
          return vec4( color.xyz, mix(vvOpacityOpacities[i-1], vvOpacityOpacities[i], f));
        }
      }

      return vec4( color.xyz, vvOpacityOpacities[vvOpacityNumber - 1]);
    }
    `)):p.code.add(s.glsl`vec4 applyOpacity(vec4 color){
return color;
}`),o.vvColor?(p.constants.add("vvColorNumber","int",c.vvColorNumber),p.uniforms.add(new l.FloatsPassUniform("vvColorValues",(e=>e.vvColor.values),c.vvColorNumber),new a.Float4sPassUniform("vvColorColors",(e=>e.vvColor.colors),c.vvColorNumber)),p.code.add(s.glsl`
    vec4 getColor() {
      float value = ${f}.y;
      if (value <= vvColorValues[0]) {
        return applyOpacity(vvColorColors[0]);
      }

      for (int i = 1; i < vvColorNumber; ++i) {
        if (vvColorValues[i] >= value) {
          float f = (value - vvColorValues[i-1]) / (vvColorValues[i] - vvColorValues[i-1]);
          return applyOpacity(mix(vvColorColors[i-1], vvColorColors[i], f));
        }
      }

      return applyOpacity(vvColorColors[vvColorNumber - 1]);
    }
    `)):p.code.add(s.glsl`vec4 getColor(){
return applyOpacity(vec4(1, 1, 1, 1));
}`),e.include(i.PositionAttribute),e.attributes.add(v.VertexAttribute.PROFILERIGHT,"vec4"),e.attributes.add(v.VertexAttribute.PROFILEUP,"vec4"),e.attributes.add(v.VertexAttribute.PROFILEVERTEXANDNORMAL,"vec4"),p.code.add(s.glsl`vec3 calculateVPos() {
vec2 size = getSize();
vec3 origin = position;
vec3 right = profileRight.xyz;
vec3 up = profileUp.xyz;
vec3 forward = cross(up, right);
vec2 profileVertex = profileVertexAndNormal.xy * size;
vec2 profileNormal = profileVertexAndNormal.zw;
float positionOffsetAlongProfilePlaneNormal = 0.0;
float normalOffsetAlongProfilePlaneNormal = 0.0;`),p.code.add(s.glsl`if(!isCapVertex()) {
vec2 rotationRight = vec2(profileRight.w, profileUp.w);
float maxDistance = length(rotationRight);`),p.code.add(s.glsl`rotationRight = maxDistance > 0.0 ? normalize(rotationRight) : vec2(0, 0);
float rx = dot(profileVertex, rotationRight);
if (abs(rx) > maxDistance) {
vec2 rotationUp = vec2(-rotationRight.y, rotationRight.x);
float ry = dot(profileVertex, rotationUp);
profileVertex = rotationRight * maxDistance * sign(rx) + rotationUp * ry;
}
}else{
positionOffsetAlongProfilePlaneNormal = profileRight.w * size[0];
normalOffsetAlongProfilePlaneNormal = profileUp.w;
}
vec3 offset = right * profileVertex.x + up * profileVertex.y + forward * positionOffsetAlongProfilePlaneNormal;
return origin + offset;
}`),p.code.add(s.glsl`vec3 localNormal() {
vec3 right = profileRight.xyz;
vec3 up = profileUp.xyz;
vec3 forward = cross(up, right);
vec2 profileNormal = profileVertexAndNormal.zw;
vec3 normal = right * profileNormal.x + up * profileNormal.y;
if(isCapVertex()) {
normal += forward * profileUp.w;
}
return normal;
}`)}class p extends c.VisualVariablePassParameters{constructor(){super(...arguments),this.size=o.fromValues(1,1)}}e.PathVertexPosition=f,e.PathVertexPositionPassParameters=p,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
