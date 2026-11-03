/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../core/handleUtils","../../../../support/elevationInfoUtils"],(function(e,n,t){"use strict";function o(e,n){return r(e?.data.coordinateHelper.hasZ(),n)}function r(e,n){return!!e&&"on-the-ground"!==n.mode&&!t.hasFeatureExpressionInfo(n)}function a(e,t){let o=null;const r=e.events.on("grab-changed",(n=>{null!=o&&(o.remove(),o=null),"start"===n.action?(o=e.disableDisplay(),t&&t(n)):t&&t(n)}));return n.makeHandle((()=>{o?.remove(),r.remove()}))}e.canMoveZOperations=o,e.disableDisplayOnGrab=a,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
