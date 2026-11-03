/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../../../chunks/tslib.es6","../../../../../../core/libs/gl-matrix-2/math/mat3","../../../../../../core/libs/gl-matrix-2/factories/mat3f64","../../../../../../core/libs/gl-matrix-2/factories/mat4f64","../../../../../../chunks/vec32","../../../../../../core/libs/gl-matrix-2/factories/vec3f64","../ShaderOutput","../util/DoublePrecision.glsl","../util/View.glsl","../../shaderModules/Float3DrawUniform","../../shaderModules/interfaces","../../shaderModules/Matrix3PassUniform","../../shaderModules/Matrix4PassUniform","../../shaderTechnique/ShaderTechniqueConfiguration","../../../lib/VertexAttribute","../../../../../webgl/doublePrecisionUtils"],(function(e,r,o,a,n,t,i,s,l,c,d,m,u,g,v,x,M){"use strict";class f extends v.ShaderTechniqueConfiguration{constructor(){super(...arguments),this.instancedDoublePrecision=!1,this.hasModelTransformation=!1}}r.__decorate([v.parameter()],f.prototype,"instancedDoublePrecision",void 0),r.__decorate([v.parameter()],f.prototype,"hasModelTransformation",void 0);class p extends m.NoParameters{constructor(){super(...arguments),this.modelTransformation=null}}const b=a.create();function w(e,r){const a=r.hasModelTransformation,i=r.instancedDoublePrecision;a&&(e.vertex.uniforms.add(new g.Matrix4PassUniform("model",(e=>e.modelTransformation??n.IDENTITY))),e.vertex.uniforms.add(new u.Matrix3PassUniform("normalLocalOriginFromModel",(e=>(o.normalFromMat4(b,e.modelTransformation??n.IDENTITY),b))))),r.instanced&&i&&(e.attributes.add(x.VertexAttribute.INSTANCEMODELORIGINHI,"vec3"),e.attributes.add(x.VertexAttribute.INSTANCEMODELORIGINLO,"vec3"),e.attributes.add(x.VertexAttribute.INSTANCEMODEL,"mat3"),e.attributes.add(x.VertexAttribute.INSTANCEMODELNORMAL,"mat3"));const v=e.vertex;i&&(v.include(l.DoublePrecision,r),v.uniforms.add(new d.Float3DrawUniform("viewOriginHi",((e,r)=>M.encodeDoubleHi(t.set(O,r.camera.viewInverseTransposeMatrix[3],r.camera.viewInverseTransposeMatrix[7],r.camera.viewInverseTransposeMatrix[11]),O))),new d.Float3DrawUniform("viewOriginLo",((e,r)=>M.encodeDoubleLo(t.set(O,r.camera.viewInverseTransposeMatrix[3],r.camera.viewInverseTransposeMatrix[7],r.camera.viewInverseTransposeMatrix[11]),O))))),v.code.add(m.glsl`
    vec3 getVertexInLocalOriginSpace() {
      return ${a?i?"(model * vec4(instanceModel * localPosition().xyz, 1.0)).xyz":"(model * localPosition()).xyz":i?"instanceModel * localPosition().xyz":"localPosition().xyz"};
    }

    vec3 subtractOrigin(vec3 _pos) {
      ${i?m.glsl`
          // Negated inputs are intentionally the first two arguments. The other way around the obfuscation in dpAdd() stopped
          // working for macOS 14+ and iOS 17+.
          // Issue: https://devtopia.esri.com/WebGIS/arcgis-js-api/issues/56280
          vec3 originDelta = dpAdd(-instanceModelOriginHi, -instanceModelOriginLo, viewOriginHi, viewOriginLo);
          return _pos - originDelta;`:"return vpos;"}
    }
    `),v.code.add(m.glsl`
    vec3 dpNormal(vec4 _normal) {
      return normalize(${a?i?"normalLocalOriginFromModel * (instanceModelNormal * _normal.xyz)":"normalLocalOriginFromModel * _normal.xyz":i?"instanceModelNormal * _normal.xyz":"_normal.xyz"});
    }
    `),r.output===s.ShaderOutput.Normal&&(c.addViewNormal(v),v.code.add(m.glsl`
    vec3 dpNormalView(vec4 _normal) {
      return normalize((viewNormal * ${a?i?"vec4(normalLocalOriginFromModel * (instanceModelNormal * _normal.xyz), 1.0)":"vec4(normalLocalOriginFromModel * _normal.xyz, 1.0)":i?"vec4(instanceModelNormal * _normal.xyz, 1.0)":"_normal"}).xyz);
    }
    `)),r.hasVertexTangents&&v.code.add(m.glsl`
    vec4 dpTransformVertexTangent(vec4 _tangent) {
      ${a?i?"return vec4(normalLocalOriginFromModel * (instanceModelNormal * _tangent.xyz), _tangent.w);":"return vec4(normalLocalOriginFromModel * _tangent.xyz, _tangent.w);":i?"return vec4(instanceModelNormal * _tangent.xyz, _tangent.w);":"return _tangent;"}
    }`)}const O=i.create();e.InstancedDoubleConfiguration=f,e.InstancedDoublePassParameters=p,e.InstancedDoublePrecision=w,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
