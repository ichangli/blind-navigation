/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./AlignPixel.glsl","./HUDRenderStyle","../../shaderModules/Float4PassUniform","../../shaderModules/FloatPassUniform","../../shaderModules/interfaces","../../shaderModules/Texture2DPassUniform"],(function(e,r,i,l,o,t,n){"use strict";function s(e){e.vertex.uniforms.add(new o.FloatPassUniform("renderTransparentlyOccludedHUD",((e,r)=>r.hudRenderStyle===i.HUDRenderStyle.Occluded?1:r.hudRenderStyle===i.HUDRenderStyle.NotOccluded?0:.75)),new l.Float4PassUniform("viewport",((e,r)=>r.camera.fullViewport)),new n.Texture2DPassUniform("hudVisibilityTexture",((e,r)=>r.hudVisibility?.getTexture()))),e.vertex.include(r.AlignPixel),e.vertex.code.add(t.glsl`bool testHUDVisibility(vec4 posProj) {
vec4 posProjCenter = alignToPixelCenter(posProj, viewport.zw);
vec4 occlusionPixel = texture(hudVisibilityTexture, .5 + .5 * posProjCenter.xy / posProjCenter.w);
if (renderTransparentlyOccludedHUD > 0.5) {
return occlusionPixel.r * occlusionPixel.g > 0.0 && occlusionPixel.g * renderTransparentlyOccludedHUD < 1.0;
}
return occlusionPixel.r * occlusionPixel.g > 0.0 && occlusionPixel.g == 1.0;
}`)}e.HUDVisibility=s,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
