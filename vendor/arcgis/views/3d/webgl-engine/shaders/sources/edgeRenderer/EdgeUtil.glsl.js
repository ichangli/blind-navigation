/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../collections/Component/Material/shader/ComponentData.glsl","../../../core/shaderLibrary/attributes/NormalAttribute.glsl","../../../core/shaderLibrary/util/DoublePrecision.glsl","../../../core/shaderLibrary/util/RgbaFloatEncoding.glsl","../../../core/shaderModules/Float3DrawUniform","../../../core/shaderModules/Float3PassUniform","../../../core/shaderModules/FloatPassUniform","../../../core/shaderModules/interfaces","../../../core/shaderModules/Matrix3DrawUniform","../../../core/shaderModules/Matrix3PassUniform","../../../core/shaderModules/Matrix4PassUniform","../../../core/shaderModules/Texture2DDrawUniform","../../../lib/VertexAttribute"],(function(e,o,t,r,a,l,n,d,s,i,c,m,f,u){"use strict";function v(e,v){const x=e.vertex;x.include(a.RgbaFloatEncoding),e.include(t.NormalAttribute,v),x.uniforms.add(new d.FloatPassUniform("distanceFalloffFactor",(e=>e.distanceFalloffFactor))),x.code.add(s.glsl`float distanceBasedPerspectiveFactor(float distance) {
return clamp(sqrt(distanceFalloffFactor / distance), 0.0, 1.0);
}`),x.uniforms.add(new f.Texture2DDrawUniform("componentDataTex",(e=>e.componentDataTexture))),e.attributes.add(u.VertexAttribute.COMPONENTINDEX,"float"),x.constants.add("componentColorFieldOffset","float",0),x.constants.add("componentOtherFieldOffset","float",1),x.constants.add("componentVerticalOffsetFieldOffset","float",2),x.constants.add("componentFieldCount","float",3),x.constants.add("lineWidthFractionFactor","float",8),x.constants.add("extensionLengthOffset","float",128),x.constants.add("verticalOffsetScale","float",2*o.maxElevationOffset),x.code.add(s.glsl`
    vec2 _componentTextureCoords(float componentIndex, float fieldOffset) {
      float fieldIndex = componentFieldCount * componentIndex + fieldOffset;
      float texSize = float(textureSize(componentDataTex, 0).x);
      float colIndex = mod(fieldIndex, texSize);
      float rowIndex = floor(fieldIndex / texSize);

      return vec2(colIndex, rowIndex) + 0.5;
    }

    struct ComponentData {
      vec4 color;
      vec3 normal;
      vec3 normal2;
      float lineWidth;
      float extensionLength;
      float type;
      float verticalOffset;
    };

    ComponentData readComponentData() {
      vec2 colorIndex = _componentTextureCoords(componentIndex, componentColorFieldOffset);
      vec2 otherIndex = _componentTextureCoords(componentIndex, componentOtherFieldOffset);
      vec2 verticalOffsetIndex = _componentTextureCoords(componentIndex, componentVerticalOffsetFieldOffset);
      vec3 normal = normalModel();
      vec3 normal2 = ${v.silhouette?s.glsl`decompressNormal(normal2Compressed)`:s.glsl`normal`};

      vec4 colorValue = texelFetch(componentDataTex, ivec2(colorIndex), 0);
      vec4 otherValue = texelFetch(componentDataTex, ivec2(otherIndex), 0);
      float verticalOffset = (rgba2float(texelFetch(componentDataTex, ivec2(verticalOffsetIndex), 0)) - 0.5) * verticalOffsetScale;

      return ComponentData(
        vec4(colorValue.rgb, colorValue.a * otherValue.w), // otherValue.w stores separate opacity
        normal, normal2,
        otherValue.x * (255.0 / lineWidthFractionFactor),
        otherValue.y * 255.0 - extensionLengthOffset,
        -(otherValue.z * 255.0) + 0.5, // SOLID (=0/255) needs to be > 0.0, SKETCHY (=1/255) needs to be <= 0;
        verticalOffset
      );
    }
  `),v.legacy?x.code.add(s.glsl`vec3 _modelToWorldNormal(vec3 normal) {
return (model * vec4(normal, 0.0)).xyz;
}
vec3 _modelToViewNormal(vec3 normal) {
return (localView * model * vec4(normal, 0.0)).xyz;
}`):(x.uniforms.add(new i.Matrix3DrawUniform("transformNormalGlobalFromModel",(e=>e.transformNormalGlobalFromModel))),x.code.add(s.glsl`vec3 _modelToWorldNormal(vec3 normal) {
return transformNormalGlobalFromModel * normal;
}`)),v.silhouette?(e.attributes.add(u.VertexAttribute.NORMAL2COMPRESSED,"vec2"),x.code.add(s.glsl`vec3 worldNormal(ComponentData data) {
return _modelToWorldNormal(normalize(data.normal + data.normal2));
}`)):x.code.add(s.glsl`vec3 worldNormal(ComponentData data) {
return _modelToWorldNormal(data.normal);
}`),v.legacy?x.code.add(s.glsl`void worldAndViewFromModelPosition(vec3 modelPos, float verticalOffset, out vec3 worldPos, out vec3 viewPos) {
worldPos = (model * vec4(modelPos, 1.0)).xyz;
viewPos = (localView * vec4(worldPos, 1.0)).xyz;
}`):(x.include(r.DoublePrecision,v),x.uniforms.add(new c.Matrix3PassUniform("transformViewFromCameraRelativeRS",(e=>e.transformViewFromCameraRelativeRS)),new i.Matrix3DrawUniform("transformWorldFromModelRS",(e=>e.transformWorldFromModelRS)),new l.Float3DrawUniform("transformWorldFromModelTL",(e=>e.transformWorldFromModelTL)),new l.Float3DrawUniform("transformWorldFromModelTH",(e=>e.transformWorldFromModelTH)),new n.Float3PassUniform("transformWorldFromViewTL",(e=>e.transformWorldFromViewTL)),new n.Float3PassUniform("transformWorldFromViewTH",(e=>e.transformWorldFromViewTH))),x.code.add(s.glsl`
      void worldAndViewFromModelPosition(vec3 modelPos, float verticalOffset, out vec3 worldPos, out vec3 viewPos) {
        vec3 rotatedModelPosition = transformWorldFromModelRS * modelPos;

        vec3 transformCameraRelativeFromModel = dpAdd(
          transformWorldFromModelTL,
          transformWorldFromModelTH,
          -transformWorldFromViewTL,
          -transformWorldFromViewTH
        );

        worldPos = transformCameraRelativeFromModel + rotatedModelPosition;

        if (verticalOffset != 0.0) {
          vec3 vUp = ${v.spherical?s.glsl`normalize(transformWorldFromModelTL + rotatedModelPosition);`:s.glsl`vec3(0.0, 0.0, 1.0);`}
          worldPos += verticalOffset * vUp;
        }

        viewPos = transformViewFromCameraRelativeRS * worldPos;
      }
    `)),x.uniforms.add(new m.Matrix4PassUniform("transformProjFromView",((e,o)=>o.camera.projectionMatrix))),x.code.add(s.glsl`vec4 projFromViewPosition(vec3 position) {
return transformProjFromView * vec4(position, 1.0);
}`),x.code.add(s.glsl`float calculateExtensionLength(float extensionLength, float lineLength) {
return extensionLength / (log2(max(1.0, 256.0 / lineLength)) * 0.2 + 1.0);
}`)}function x(o){return o===e.EdgeType.Sketch||o===e.EdgeType.Mixed}var F,w;e.EdgeType=void 0,(F=e.EdgeType||(e.EdgeType={}))[F.Solid=0]="Solid",F[F.Sketch=1]="Sketch",F[F.Mixed=2]="Mixed",F[F.COUNT=3]="COUNT",e.EdgeSilhouette=void 0,(w=e.EdgeSilhouette||(e.EdgeSilhouette={}))[w.REGULAR=0]="REGULAR",w[w.SILHOUETTE=1]="SILHOUETTE",e.EdgeUtil=v,e.usesSketchLogic=x,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
