/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../shaderModules/Float3PassUniform","../../shaderModules/Float4sPassUniform","../../shaderModules/FloatsPassUniform","../../shaderModules/interfaces","../../shaderModules/Matrix3PassUniform","../../../lib/VertexAttribute","../../../materials/VisualVariablePassParameters"],(function(e,o,r,v,t,a,i,l){"use strict";function s(e,s){const{vertex:n,attributes:u}=e;s.hasVvInstancing&&(s.vvSize||s.vvColor)&&u.add(i.VertexAttribute.INSTANCEFEATUREATTRIBUTE,"vec4"),s.vvSize?(n.uniforms.add(new o.Float3PassUniform("vvSizeMinSize",(e=>e.vvSize.minSize))),n.uniforms.add(new o.Float3PassUniform("vvSizeMaxSize",(e=>e.vvSize.maxSize))),n.uniforms.add(new o.Float3PassUniform("vvSizeOffset",(e=>e.vvSize.offset))),n.uniforms.add(new o.Float3PassUniform("vvSizeFactor",(e=>e.vvSize.factor))),n.uniforms.add(new a.Matrix3PassUniform("vvSymbolRotationMatrix",(e=>e.vvSymbolRotationMatrix))),n.uniforms.add(new o.Float3PassUniform("vvSymbolAnchor",(e=>e.vvSymbolAnchor))),n.code.add(t.glsl`vec3 vvScale(vec4 _featureAttribute) {
return clamp(vvSizeOffset + _featureAttribute.x * vvSizeFactor, vvSizeMinSize, vvSizeMaxSize);
}
vec4 vvTransformPosition(vec3 position, vec4 _featureAttribute) {
return vec4(vvSymbolRotationMatrix * ( vvScale(_featureAttribute) * (position + vvSymbolAnchor)), 1.0);
}`),n.code.add(t.glsl`
      const float eps = 1.192092896e-07;
      vec4 vvTransformNormal(vec3 _normal, vec4 _featureAttribute) {
        vec3 vvScale = clamp(vvSizeOffset + _featureAttribute.x * vvSizeFactor, vvSizeMinSize + eps, vvSizeMaxSize);
        return vec4(vvSymbolRotationMatrix * _normal / vvScale, 1.0);
      }

      ${s.hasVvInstancing?t.glsl`
      vec4 vvLocalNormal(vec3 _normal) {
        return vvTransformNormal(_normal, instanceFeatureAttribute);
      }

      vec4 localPosition() {
        return vvTransformPosition(position, instanceFeatureAttribute);
      }`:""}
    `)):n.code.add(t.glsl`vec4 localPosition() { return vec4(position, 1.0); }
vec4 vvLocalNormal(vec3 _normal) { return vec4(_normal, 1.0); }`),s.vvColor?(n.constants.add("vvColorNumber","int",l.vvColorNumber),n.uniforms.add(new v.FloatsPassUniform("vvColorValues",(e=>e.vvColor.values),l.vvColorNumber),new r.Float4sPassUniform("vvColorColors",(e=>e.vvColor.colors),l.vvColorNumber)),n.code.add(t.glsl`
      vec4 interpolateVVColor(float value) {
        if (value <= vvColorValues[0]) {
          return vvColorColors[0];
        }

        for (int i = 1; i < vvColorNumber; ++i) {
          if (vvColorValues[i] >= value) {
            float f = (value - vvColorValues[i-1]) / (vvColorValues[i] - vvColorValues[i-1]);
            return mix(vvColorColors[i-1], vvColorColors[i], f);
          }
        }
        return vvColorColors[vvColorNumber - 1];
      }

      vec4 vvGetColor(vec4 featureAttribute) {
        return interpolateVVColor(featureAttribute.y);
      }

      ${s.hasVvInstancing?t.glsl`
            vec4 vvColor() {
              return vvGetColor(instanceFeatureAttribute);
            }`:"vec4 vvColor() { return vec4(1.0); }"}
    `)):n.code.add(t.glsl`vec4 vvColor() { return vec4(1.0); }`)}e.VisualVariables=s,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
