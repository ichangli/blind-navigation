/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../core/libs/gl-matrix-2/factories/vec2f64","../../../../core/libs/gl-matrix-2/math/common"],(function(t,n,o){"use strict";function e(t){const o=i(t);return n.fromValues(Math.cos(o),Math.sin(o))}function i(t){if(null==t||"polyline"!==t.type&&"polygon"!==t.type)return 0;const n="polyline"===t.type?t.paths:t.rings,e=o.getEpsilon();for(const o of n)for(let t=0;t<o.length-1;t++){const n=o[t],i=o[t+1],r=n[0]-i[0],l=n[1]-i[1];if(r*r+l*l>e)return Math.atan2(i[1]-n[1],i[0]-n[0])}return 0}t.mainAxis=e,t.orientation=i,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
