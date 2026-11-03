/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./Callout3D","./LineCallout3D"],(function(t,e,n){"use strict";function l(t){if(!t)return!1;const e=t.verticalOffset;return!!e&&!(e.screenLength<=0||null!=e.maxWorldLength&&e.maxWorldLength<=0)}function r(t){if(!t)return!1;if(!t.supportsCallout||!t.supportsCallout())return!1;const e=t.callout;return!!e&&(!!e.visible&&!!l(t))}function o(t){return"point-3d"===t.type||"label-3d"===t.type}function u(t){return"center"===t.horizontalAlignment}const i={types:{key:"type",base:e,typeMap:{line:n}},json:{write:!0}};t.calloutProperty=i,t.hasCalloutSupport=o,t.hasVisibleCallout=r,t.hasVisibleVerticalOffset=l,t.textSymbolLayerSupportsVerticalOffset=u,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
