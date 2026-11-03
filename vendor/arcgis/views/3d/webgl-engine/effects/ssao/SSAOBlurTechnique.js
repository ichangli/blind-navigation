/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["require","exports","../../core/shaderTechnique/ReloadableShaderModule","../../core/shaderTechnique/ShaderTechnique","../../lib/DefaultVertexAttributeLocations","../../lib/Program","../../../../../chunks/SSAOBlur.glsl","../../../../webgl/renderState"],(function(e,r,i,l,a,t,u,n){"use strict";class o extends l.ShaderTechnique{initializeProgram(e){return new t.Program(e.rctx,o.shader.get().build(),a.Default3D)}initializePipeline(){return n.makePipelineState({colorWrite:n.defaultColorWriteParams})}}o.shader=new i.ReloadableShaderModule(u.SSAOBlur,(()=>new Promise(((r,i)=>e(["../../shaders/SSAOBlur.glsl"],r,i))))),r.SSAOBlurTechnique=o,Object.defineProperty(r,Symbol.toStringTag,{value:"Module"})}));
