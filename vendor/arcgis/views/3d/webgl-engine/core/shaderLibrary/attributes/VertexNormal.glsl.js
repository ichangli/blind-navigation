/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../../../core/compilerUtils","../../../../../../core/libs/gl-matrix-2/factories/mat3f64","../../../../../../core/libs/gl-matrix-2/factories/vec4f64","./NormalAttribute.glsl","./VertexPosition.glsl","../../shaderModules/interfaces","../../shaderModules/Matrix3DrawUniform","../../shaderModules/Matrix3PassUniform"],(function(r,e,a,o,l,t,s,m,i){"use strict";function d(r,a){switch(a.normalType){case l.NormalType.Attribute:case l.NormalType.Compressed:r.include(l.NormalAttribute,a),r.varyings.add("vNormalWorld","vec3"),r.varyings.add("vNormalView","vec3"),r.vertex.uniforms.add(new m.Matrix3DrawUniform("transformNormalGlobalFromModel",(r=>r.transformNormalGlobalFromModel)),new i.Matrix3PassUniform("transformNormalViewFromGlobal",(r=>r.transformNormalViewFromGlobal))),r.vertex.code.add(s.glsl`void forwardNormal() {
vNormalWorld = transformNormalGlobalFromModel * normalModel();
vNormalView = transformNormalViewFromGlobal * vNormalWorld;
}`);break;case l.NormalType.Ground:r.include(t.VertexPosition,a),r.varyings.add("vNormalWorld","vec3"),r.vertex.code.add(s.glsl`
        void forwardNormal() {
          vNormalWorld = ${a.spherical?s.glsl`normalize(vPositionWorldCameraRelative);`:s.glsl`vec3(0.0, 0.0, 1.0);`}
        }
        `);break;case l.NormalType.ScreenDerivative:r.vertex.code.add(s.glsl`void forwardNormal() {}`);break;default:e.neverReached(a.normalType);case l.NormalType.COUNT:}}class n extends t.VertexPositionPassParameters{constructor(){super(...arguments),this.transformNormalViewFromGlobal=a.create()}}class c extends t.VertexPositionDrawParameters{constructor(){super(...arguments),this.transformNormalGlobalFromModel=a.create(),this.toMapSpace=o.create()}}r.VertexNormal=d,r.VertexNormalDrawParameters=c,r.VertexNormalPassParameters=n,Object.defineProperty(r,Symbol.toStringTag,{value:"Module"})}));
