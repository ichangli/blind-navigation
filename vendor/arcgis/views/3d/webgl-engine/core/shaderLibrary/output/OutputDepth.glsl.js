/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../ShaderOutput","../util/RgbaFloat16Encoding.glsl","../../shaderModules/interfaces"],(function(t,e,a,o){"use strict";function d(t,d){switch(d.output){case e.ShaderOutput.Shadow:case e.ShaderOutput.ShadowHighlight:case e.ShaderOutput.ShadowExcludeHighlight:case e.ShaderOutput.ViewshedShadow:t.fragment.include(a.Rgba4FloatEncoding),t.fragment.code.add(o.glsl`float _calculateFragDepth(const in float depth) {
const float SLOPE_SCALE = 2.0;
const float BIAS = 20.0 * .000015259;
float m = max(abs(dFdx(depth)), abs(dFdy(depth)));
return depth + SLOPE_SCALE * m + BIAS;
}
void outputDepth(float _linearDepth) {
fragColor = floatToRgba4(_calculateFragDepth(_linearDepth));
}`)}}t.OutputDepth=d,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
