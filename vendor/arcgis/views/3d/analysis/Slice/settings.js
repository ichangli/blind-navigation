/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../core/colorUtils","../../../../core/libs/gl-matrix-2/factories/vec4f64"],(function(o,t,e){"use strict";const r=e.fromValues(0,0,0,.04);function i({accentColor:o}){return t.multiplyOpacityToUnitRGBA(o,.5)}function l({accentColor:o}){return t.multiplyOpacityToUnitRGBA(o,.7)}o.getGridColor=i,o.getOutlineColor=l,o.planeColor=r,Object.defineProperty(o,Symbol.toStringTag,{value:"Module"})}));
