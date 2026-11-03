/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["require","exports","../core/shaderTechnique/ReloadableShaderModule","../core/shaderTechnique/ShaderTechnique","../lib/DefaultVertexAttributeLocations","../lib/Program","../../../../chunks/HUDCompositing.glsl","../../../webgl/renderState"],(function(e,i,r,t,o,a,n,l){"use strict";class s extends t.ShaderTechnique{initializeProgram(e){return new a.Program(e.rctx,s.shader.get().build(),o.Default3D)}initializePipeline(){return l.makePipelineState({colorWrite:{r:!1,g:!0,b:!1,a:!1}})}}s.shader=new r.ReloadableShaderModule(n.HUDCompositing,(()=>new Promise(((i,r)=>e(["./HUDCompositing.glsl"],i,r))))),i.HUDCompositingTechnique=s,Object.defineProperty(i,Symbol.toStringTag,{value:"Module"})}));
