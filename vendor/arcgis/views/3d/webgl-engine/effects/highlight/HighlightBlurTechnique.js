/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["require","exports","../../core/shaderTechnique/ReloadableShaderModule","../../core/shaderTechnique/ShaderTechnique","../../lib/DefaultVertexAttributeLocations","../../lib/Program","../../../../../chunks/HighlightBlur.glsl","../../../../webgl/renderState"],(function(e,r,i,l,t,a,u,h){"use strict";class n extends l.ShaderTechnique{initializeProgram(e){return new a.Program(e.rctx,n.shader.get().build(),t.Default3D)}initializePipeline(){return h.makePipelineState({colorWrite:h.defaultColorWriteParams})}}n.shader=new i.ReloadableShaderModule(u.HighlightBlur,(()=>new Promise(((r,i)=>e(["../../shaders/HighlightBlur.glsl"],r,i))))),r.HighlightBlurTechnique=n,Object.defineProperty(r,Symbol.toStringTag,{value:"Module"})}));
