/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["require","exports","../../core/shaderTechnique/ReloadableShaderModule","../../core/shaderTechnique/ShaderTechnique","../../lib/DefaultVertexAttributeLocations","../../lib/Program","../../../../../chunks/EdgeDetect.glsl","../../../../webgl/renderState"],(function(e,r,t,i,a,l,d,n){"use strict";class o extends i.ShaderTechnique{initializeProgram(e){return new l.Program(e.rctx,o.shader.get().build(),a.Default3D)}initializePipeline(){return n.makePipelineState({colorWrite:n.defaultColorWriteParams})}}o.shader=new t.ReloadableShaderModule(d.EdgeDetect,(()=>new Promise(((r,t)=>e(["../../shaders/EdgeDetect.glsl"],r,t))))),r.SMAAEdgeDetectTechnique=o,Object.defineProperty(r,Symbol.toStringTag,{value:"Module"})}));
