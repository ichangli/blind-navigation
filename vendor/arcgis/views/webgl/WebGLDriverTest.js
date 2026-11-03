/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./testAppleAmdDrawArrays","./testDoublePrecisionArithmetic","./testFloatBufferBlend","./testSVGPremultipliedAlpha"],(function(e,s,i,t,r){"use strict";class l{constructor(e){this.rctx=e,this.floatBufferBlend=new t.FloatBufferBlend(e),this.svgPremultipliesAlpha=new r.SVGPremultipliedAlpha(e),this.doublePrecisionRequiresObfuscation=new i.DoublePrecisionRequiresObfuscation(e),this.drawArraysRequiresIndicesTypeReset=new s.DrawArraysRequiresIndicesTypeReset(e)}dispose(){this.doublePrecisionRequiresObfuscation.dispose(),this.svgPremultipliesAlpha.dispose(),this.floatBufferBlend.dispose(),this.drawArraysRequiresIndicesTypeReset.dispose()}}e.WebGLDriverTest=l,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
