/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["require","exports","../core/shaderTechnique/ReloadableShaderModule","../core/shaderTechnique/ShaderTechnique","../lib/DefaultVertexAttributeLocations","../lib/OrderIndependentTransparency","../lib/Program","../../../../chunks/Viewshed.glsl","../../../webgl/renderState"],(function(e,r,i,n,a,t,l,d,o){"use strict";class s extends n.ShaderTechnique{initializeProgram(e){return new l.Program(e.rctx,s.shader.get().build(this.configuration),a.Default3D)}initializePipeline(){return o.makePipelineState({colorWrite:o.defaultColorWriteParams,blending:t.blendingDefault})}}s.shader=new i.ReloadableShaderModule(d.Viewshed,(()=>new Promise(((r,i)=>e(["./Viewshed.glsl"],r,i))))),r.ViewshedTechnique=s,Object.defineProperty(r,Symbol.toStringTag,{value:"Module"})}));
