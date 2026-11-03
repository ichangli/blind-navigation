/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["require","exports","../core/shaderTechnique/ReloadableShaderModule","../core/shaderTechnique/ShaderTechnique","../lib/DefaultVertexAttributeLocations","../lib/Program","../../../../chunks/OverlayCompositing.glsl","../../../webgl/enums","../../../webgl/renderState"],(function(e,r,i,a,l,t,n,o,d){"use strict";class s extends a.ShaderTechnique{initializeProgram(e){return new t.Program(e.rctx,s.shader.get().build(),l.Default3D)}initializePipeline(){return d.makePipelineState({blending:d.simpleBlendingParams(o.BlendFactor.ONE,o.BlendFactor.ONE_MINUS_SRC_ALPHA),colorWrite:d.defaultColorWriteParams})}}s.shader=new i.ReloadableShaderModule(n.OverlayCompositing,(()=>new Promise(((r,i)=>e(["./OverlayCompositing.glsl"],r,i))))),r.OverlayCompositingTechnique=s,Object.defineProperty(r,Symbol.toStringTag,{value:"Module"})}));
