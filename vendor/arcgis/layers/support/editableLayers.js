/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../catalog/catalogUtils","./layerUtils"],(function(e,t,i){"use strict";function n(e){return"object"==typeof e&&null!=e&&"loaded"in e&&!0===e.loaded&&"type"in e}function a(e){return!(!n(e)||!i.getEffectiveLayerCapabilities(e)?.operations?.supportsEditing||"editingEnabled"in e&&!i.getEffectiveEditingEnabled(e)||t.isLayerFromCatalog(e))}e.isEditableLayer=a,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
