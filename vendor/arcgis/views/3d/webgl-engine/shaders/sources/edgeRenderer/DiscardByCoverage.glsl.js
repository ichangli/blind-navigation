/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../core/shaderModules/interfaces"],(function(e,o){"use strict";function r(e){const r=e.fragment;r.constants.add("coverageTestThreshold","float",.01),r.code.add(o.glsl`#define discardByCoverage(radius, coverage) { if (coverage < coverageTestThreshold) discard; }`)}e.DiscardByCoverage=r,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
