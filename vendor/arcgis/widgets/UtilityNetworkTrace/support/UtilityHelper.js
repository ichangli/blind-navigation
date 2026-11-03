/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../layers/support/layerUtils"],(function(e,r){"use strict";function t(e){return"feature"===e.type}function i(e,r){return e.url.includes(r)}function a(e,r){return(e.dataElement?.domainNetworks||[]).some((e=>e.subnetworkLayerId===r.layerId))}class l{getValidUtilityNetworkLayers(e,l){const u=[];return e?.allLayers.forEach((e=>{"group"===e.type?u.push(...e.layers.filter(r.isFeatureLayer).filter((e=>t(e)&&l.isUtilityLayer(e)&&!a(l,e))).filter((e=>i(e,l.featureServiceUrl))).toArray()):"subtype-group"===e.type?u.push(...e.sublayers.filter((e=>i(e,l.featureServiceUrl))).toArray()):r.isFeatureLayer(e)&&t(e)&&l.isUtilityLayer(e)&&!a(l,e)&&i(e,l.featureServiceUrl)&&u.push(e)})),u}}e.UtilityHelper=l,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
