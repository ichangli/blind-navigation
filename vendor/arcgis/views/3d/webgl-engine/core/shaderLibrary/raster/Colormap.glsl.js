/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../shaderModules/FloatPassUniform","../../shaderModules/interfaces","../../shaderModules/Texture2DPassUniform"],(function(e,o,r,a){"use strict";function l(e){e.fragment.uniforms.add(new a.Texture2DPassUniform("u_colormap",(e=>e.u_colormap)),new o.FloatPassUniform("u_colormapOffset",(e=>e.colormap.u_colormapOffset)),new o.FloatPassUniform("u_colormapMaxIndex",(e=>e.colormap.u_colormapMaxIndex)),new o.FloatPassUniform("u_opacity",(e=>e.common.u_opacity))),e.fragment.code.add(r.glsl`vec4 colormap(vec4 currentPixel, bool isFloat) {
float colorIndex = isFloat ? currentPixel.r - u_colormapOffset : currentPixel.r * 255.0 - u_colormapOffset;
vec4 result;
if (currentPixel.a == 0.0 || colorIndex > u_colormapMaxIndex) {
result = vec4(0.0, 0.0, 0.0, 0.0);
} else {
vec2 texelCoordinates = vec2((colorIndex + 0.5), 0.5);
result = texelFetch(u_colormap, ivec2(texelCoordinates), 0);
}
return result;
}`)}e.Colormap=l,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
