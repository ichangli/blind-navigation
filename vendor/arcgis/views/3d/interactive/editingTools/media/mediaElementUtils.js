/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../../layers/support/ImageElement","../../../../../layers/support/VideoElement"],(function(e,n,i){"use strict";function t(e,n,i){return r(e.allLayerViews.find((e=>e.layer===n)),i)}function r(e,t){if(!e||"media-3d"!==e.type||e.suspended)return!1;const r=e.layer.source;return!!r&&(r instanceof n||r instanceof i?r===t:"hasElement"in r&&r.hasElement(t))}e.isMediaElementVisibleLayerView=r,e.isMediaElementVisibleView=t,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
