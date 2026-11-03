/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["require","exports","../../core/shaderTechnique/ReloadableShaderModule","../../core/shaderTechnique/ShaderTechnique","../../lib/DefaultVertexAttributeLocations","../../lib/Program","../../../../../chunks/BlendWeights.glsl","../../../../webgl/renderState"],(function(e,r,i,t,l,a,n,d){"use strict";class o extends t.ShaderTechnique{initializeProgram(e){return new a.Program(e.rctx,o.shader.get().build(),l.Default3D)}initializePipeline(){return d.makePipelineState({colorWrite:d.defaultColorWriteParams})}}o.shader=new i.ReloadableShaderModule(n.BlendWeights,(()=>new Promise(((r,i)=>e(["../../shaders/BlendWeights.glsl"],r,i))))),r.SMAABlendWeightsTechnique=o,Object.defineProperty(r,Symbol.toStringTag,{value:"Module"})}));
