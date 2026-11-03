/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../renderers/visualVariables/SizeVariable"],(function(e,i){"use strict";function l(e,l,a){const s=e.effectiveClusterRenderer;if(!s||!("visualVariables"in s)||!s.visualVariables)return null;const t=s.visualVariables.find((e=>"size"===e.type));if(!("stops"in t)||!t.stops)return null;const n=t.stops.find((e=>e.useMinValue)),u=t.stops.find((e=>e.useMaxValue));if(null==n||null==u)return null;const r=a.featuresTilingScheme.getClosestInfoForScale(a.scale).level,f=t.field,o=l.getDisplayStatistics(r,f);return o?new i({field:t.field,minSize:e.clusterMinSize,minDataValue:o.minValue,maxSize:e.clusterMaxSize,maxDataValue:o.maxValue}):null}e.getEffectiveClusterSizeVariable=l,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
