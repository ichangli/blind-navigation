/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["require","exports","../../core/shaderTechnique/ReloadableShaderModule","../../core/shaderTechnique/ShaderTechnique","../../lib/DefaultVertexAttributeLocations","../../lib/Program","../../../../../chunks/HighlightDownsample.glsl","../../../../webgl/renderState"],(function(e,i,r,l,a,t,n,o){"use strict";class h extends l.ShaderTechnique{initializeProgram(e){return new t.Program(e.rctx,h.shader.get().build(),a.Default3D)}initializePipeline(){return o.makePipelineState({colorWrite:o.defaultColorWriteParams})}}h.shader=new r.ReloadableShaderModule(n.HighlightDownsample,(()=>new Promise(((i,r)=>e(["../../shaders/HighlightDownsample.glsl"],i,r))))),i.HighlightDownsampleTechnique=h,Object.defineProperty(i,Symbol.toStringTag,{value:"Module"})}));
