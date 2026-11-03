/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../layers/catalog/catalogUtils","./FeatureLayerVersionAdapter","./NetworkVersionAdapter","./SubTypeGroupLayerVersionAdapter"],(function(e,r,t,o,a){"use strict";function n(e){return"networkServiceUrl"in e?new o.NetworkVersionAdapter(e):"feature"!==e.type||r.isLayerFromCatalog(e)?"subtype-group"!==e.type||r.isLayerFromCatalog(e)?null:new a.SubTypeGroupLayerVersionAdapter(e):new t.FeatureLayerVersionAdapter(e)}function s(e){const r=[];for(const t of e)if("group"===t.type){const e=t,o=e.allTables.concat(e.allLayers);for(const t of o)if("feature"===t.type||"subtype-group"===t.type){const e=n(t);e&&r.push(e)}}else{const e=n(t);e&&r.push(e)}return r}e.createVersionAdapters=s,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
