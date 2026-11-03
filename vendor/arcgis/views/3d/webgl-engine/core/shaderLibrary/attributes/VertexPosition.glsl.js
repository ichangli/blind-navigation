/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../../../core/libs/gl-matrix-2/factories/mat3f64","../../../../../../core/libs/gl-matrix-2/factories/mat4f64","../../../../../../core/libs/gl-matrix-2/factories/vec3f64","./PositionAttribute.glsl","../util/DoublePrecision.glsl","../../shaderModules/Float3DrawUniform","../../shaderModules/Float3PassUniform","../../shaderModules/interfaces","../../shaderModules/Matrix3DrawUniform","../../shaderModules/Matrix3PassUniform","../../shaderModules/Matrix4PassUniform"],(function(r,o,e,a,t,i,s,l,m,n,d,f){"use strict";function c(r,o){r.include(t.PositionAttribute);const e=r.vertex;e.include(i.DoublePrecision,o),r.varyings.add("vPositionWorldCameraRelative","vec3"),r.varyings.add("vPosition_view","vec3"),e.uniforms.add(new l.Float3PassUniform("transformWorldFromViewTH",(r=>r.transformWorldFromViewTH)),new l.Float3PassUniform("transformWorldFromViewTL",(r=>r.transformWorldFromViewTL)),new d.Matrix3PassUniform("transformViewFromCameraRelativeRS",(r=>r.transformViewFromCameraRelativeRS)),new f.Matrix4PassUniform("transformProjFromView",(r=>r.transformProjFromView)),new n.Matrix3DrawUniform("transformWorldFromModelRS",(r=>r.transformWorldFromModelRS)),new s.Float3DrawUniform("transformWorldFromModelTH",(r=>r.transformWorldFromModelTH)),new s.Float3DrawUniform("transformWorldFromModelTL",(r=>r.transformWorldFromModelTL))),e.code.add(m.glsl`vec3 positionWorldCameraRelative() {
vec3 rotatedModelPosition = transformWorldFromModelRS * positionModel();
vec3 transform_CameraRelativeFromModel = dpAdd(
transformWorldFromModelTL,
transformWorldFromModelTH,
-transformWorldFromViewTL,
-transformWorldFromViewTH
);
return transform_CameraRelativeFromModel + rotatedModelPosition;
}`),e.code.add(m.glsl`
    void forwardPosition(float fOffset) {
      vPositionWorldCameraRelative = positionWorldCameraRelative();
      if (fOffset != 0.0) {
        vPositionWorldCameraRelative += fOffset * ${o.spherical?m.glsl`normalize(transformWorldFromViewTL + vPositionWorldCameraRelative)`:m.glsl`vec3(0.0, 0.0, 1.0)`};
      }

      vPosition_view = transformViewFromCameraRelativeRS * vPositionWorldCameraRelative;
      gl_Position = transformProjFromView * vec4(vPosition_view, 1.0);
    }
  `),r.fragment.uniforms.add(new l.Float3PassUniform("transformWorldFromViewTL",(r=>r.transformWorldFromViewTL))),e.code.add(m.glsl`vec3 positionWorld() {
return transformWorldFromViewTL + vPositionWorldCameraRelative;
}`),r.fragment.code.add(m.glsl`vec3 positionWorld() {
return transformWorldFromViewTL + vPositionWorldCameraRelative;
}`)}class v extends m.NoParameters{constructor(){super(...arguments),this.transformWorldFromViewTH=a.create(),this.transformWorldFromViewTL=a.create(),this.transformViewFromCameraRelativeRS=o.create(),this.transformProjFromView=e.create()}}class F extends m.NoParameters{constructor(){super(...arguments),this.transformWorldFromModelRS=o.create(),this.transformWorldFromModelTH=a.create(),this.transformWorldFromModelTL=a.create()}}r.VertexPosition=c,r.VertexPositionDrawParameters=F,r.VertexPositionPassParameters=v,Object.defineProperty(r,Symbol.toStringTag,{value:"Module"})}));
