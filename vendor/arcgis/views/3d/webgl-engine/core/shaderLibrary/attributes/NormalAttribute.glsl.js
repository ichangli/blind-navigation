/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../../../core/compilerUtils","../../shaderModules/interfaces","../../../lib/VertexAttribute"],(function(e,r,t,o){"use strict";function a(a,i){switch(i.normalType){case e.NormalType.Compressed:a.attributes.add(o.VertexAttribute.NORMALCOMPRESSED,"vec2"),a.vertex.code.add(t.glsl`vec3 decompressNormal(vec2 normal) {
float z = 1.0 - abs(normal.x) - abs(normal.y);
return vec3(normal + sign(normal) * min(z, 0.0), z);
}
vec3 normalModel() {
return decompressNormal(normalCompressed);
}`);break;case e.NormalType.Attribute:a.attributes.add(o.VertexAttribute.NORMAL,"vec3"),a.vertex.code.add(t.glsl`vec3 normalModel() {
return normal;
}`);break;case e.NormalType.ScreenDerivative:a.fragment.code.add(t.glsl`vec3 screenDerivativeNormal(vec3 positionView) {
return normalize(cross(dFdx(positionView), dFdy(positionView)));
}`);break;default:r.neverReached(i.normalType);case e.NormalType.COUNT:case e.NormalType.Ground:}}var i;e.NormalType=void 0,(i=e.NormalType||(e.NormalType={}))[i.Attribute=0]="Attribute",i[i.Compressed=1]="Compressed",i[i.Ground=2]="Ground",i[i.ScreenDerivative=3]="ScreenDerivative",i[i.COUNT=4]="COUNT",e.NormalAttribute=a,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
