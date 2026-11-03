/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../FeatureTechnique","../featureTechniqueUtils","../TechniqueType","../line/utils","../shaders/OutlineFillShader"],(function(e,t,i,n,s,r){"use strict";class a extends t.FeatureTechnique{constructor(){super(...arguments),this.type=n.TechniqueType.OutlineFill,this.shaders={geometry:new r.OutlineFillShader}}render(e,t){const{painter:n,pixelRatio:r}=e,a=t.instance.getInput();n.setShader({shader:this.shaders.geometry,uniforms:{...i.resolveDynamicUniforms(e,t.target,a.uniforms),...i.getFeatureUniforms(e,t.target),antialiasingControls:s.getAntialiasingControls(r)},defines:{...i.getSelectionDefines(e)},optionalAttributes:a.optionalAttributes,useComputeBuffer:i.isHittest(e)}),n.setPipelineState(i.getFeaturePipelineState(e)),n.submitDraw(e,t)}}e.OutlineFillTechnique=a,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
