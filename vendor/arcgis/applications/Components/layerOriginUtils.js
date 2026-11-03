/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../layers/support/layerOriginUtils"],(function(r,e){"use strict";function n(r){return e.isSupportedLayer(r)}function t(r,n){return e.clearOverrides(r,n)}function i(r,n){return e.disconnectFromSource(r,n)}function o(r,n){return e.getLayerOriginInfo(r,n)}r.clearOverrides=t,r.disconnectFromSource=i,r.getLayerOriginInfo=o,r.isSupportedLayer=n,Object.defineProperty(r,Symbol.toStringTag,{value:"Module"})}));
