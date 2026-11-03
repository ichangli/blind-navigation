/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../FeatureTechnique","../featureTechniqueUtils","../TechniqueType","../shaders/FillShader"],(function(e,t,i,r,s){"use strict";class n extends t.FeatureTechnique{constructor(){super(...arguments),this.type=r.TechniqueType.Fill,this.shaders={geometry:new s.FillShader}}render(e,t){const{painter:r}=e,s=t.instance.getInput();r.setShader({shader:this.shaders.geometry,uniforms:{...i.resolveDynamicUniforms(e,t.target,s.uniforms),...i.getFeatureUniforms(e,t.target)},defines:i.getSelectionDefines(e),optionalAttributes:s.optionalAttributes,useComputeBuffer:i.isHittest(e)}),r.setPipelineState(i.getFeaturePipelineState(e)),r.submitDraw(e,t)}}e.FillTechnique=n,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
