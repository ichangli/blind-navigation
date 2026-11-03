/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["require","exports","../../core/shaderTechnique/ReloadableShaderModule","../../core/shaderTechnique/ShaderTechnique","../../lib/DefaultVertexAttributeLocations","../../lib/Program","../../../../../chunks/SSAO.glsl","../../../../webgl/renderState"],(function(e,r,i,a,t,l,n,o){"use strict";class d extends a.ShaderTechnique{initializeProgram(e){return new l.Program(e.rctx,d.shader.get().build(),t.Default3D)}initializePipeline(){return o.makePipelineState({colorWrite:o.defaultColorWriteParams})}}d.shader=new i.ReloadableShaderModule(n.SSAO,(()=>new Promise(((r,i)=>e(["../../shaders/SSAO.glsl"],r,i))))),r.SSAOTechnique=d,Object.defineProperty(r,Symbol.toStringTag,{value:"Module"})}));
