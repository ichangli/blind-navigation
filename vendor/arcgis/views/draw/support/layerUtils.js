/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(e){"use strict";function r(e,r,n){if(!r||!e?.map)return;const{map:t}=e,a=t.layers.find((e=>e===r));a||t.add(r,n),a&&null!=n&&t.layers.reorder(a,n)}function n(e,r){const n="subtype-sublayer"===r?.type?r.parent:r;return e.allLayerViews.find((e=>{const r=e.layer;return r===n||"sublayers"in r&&null!=r.sublayers&&r.sublayers.includes(n)}))}e.addUniqueLayer=r,e.findLayerView=n,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
