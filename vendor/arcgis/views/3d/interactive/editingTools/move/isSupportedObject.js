/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../../core/has","../../../../../support/elevationInfoUtils","../isSupportedObjectUtils"],(function(e,t,o,r){"use strict";function p(e){if(e.graphic&&"graphics"!==e.graphic.layer?.type)return r.SupportedObjectResult.GRAPHICS_LAYER_MISSING;const t=e.operations?.data.type;if(!t)return r.SupportedObjectResult.GEOMETRY_TYPE_UNSUPPORTED;switch(t){case"polygon":case"point":case"polyline":case"mesh":break;default:return r.SupportedObjectResult.GEOMETRY_TYPE_UNSUPPORTED}const p=e.elevationInfo;return o.hasEffectiveFeatureExpressionInfo(p)?r.SupportedObjectResult.ELEVATION_MODE_UNSUPPORTED:r.SupportedObjectResult.SUPPORTED}e.isSupportedObject=p,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
