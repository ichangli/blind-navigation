/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../../../core/libs/gl-matrix-2/factories/vec2f64","../../shaderModules/Float2PassUniform","../../shaderModules/FloatPassUniform","../../shaderModules/interfaces","../../../lib/VertexAttribute"],(function(e,t,s,o,a,i){"use strict";class r extends a.NoParameters{constructor(){super(...arguments),this.scale=1,this.offset=t.ZEROS}}function d(e){e.attributes.add(i.VertexAttribute.POSITION,"vec2"),e.attributes.add(i.VertexAttribute.UV0,"vec2"),e.varyings.add("uv","vec2"),e.varyings.add("vuv","vec2"),e.vertex.uniforms.add(new o.FloatPassUniform("scale",(e=>e.scale)),new s.Float2PassUniform("offset",(e=>e.offset))).code.add(a.glsl`void main(void) {
gl_Position = vec4(position, 0.0, 1.0);
uv = uv0 * scale + offset;
vuv = uv0;
}`)}e.TileComposite=d,e.TileCompositePassParameters=r,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
