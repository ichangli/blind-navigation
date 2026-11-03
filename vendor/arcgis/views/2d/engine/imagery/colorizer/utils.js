/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(e){"use strict";function i(e){const i=[];return e&&(i.push("applyProjection"),1===e.spacing[0]&&i.push("lookupProjection")),i}function n(e,i,n){const t=!n.capabilities.textureFloatLinear,o=[];return"cubic"===e?o.push("bicubic"):"bilinear"===e&&(i?(o.push("bilinear"),o.push("nnedge")):t&&o.push("bilinear")),o}e.getInterpolationDefines=n,e.getProjectionDefines=i,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
