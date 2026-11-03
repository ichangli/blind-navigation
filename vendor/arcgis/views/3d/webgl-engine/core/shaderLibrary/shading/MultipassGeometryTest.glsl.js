/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../output/ReadDepth.glsl","../../shaderModules/interfaces","../../shaderModules/Texture2DPassUniform"],(function(e,t,o,r){"use strict";function s(e){e.include(t.ReadDepth),e.uniforms.add(new r.Texture2DPassUniform("geometryDepthTexture",((e,t)=>t.multipassGeometry.depth?.attachment))),e.code.add(o.glsl`bool geometryDepthTest(vec2 pos, float elementDepth) {
float geometryDepth = linearDepthFromTexture(geometryDepthTexture, pos);
return (elementDepth < (geometryDepth - 1.0));
}`)}class a{}e.MultipassGeometryUniforms=a,e.multipassGeometryTest=s,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
