/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../core/handleUtils","../../core/reactiveUtils"],(function(e,t,a){"use strict";const n=new WeakMap;function r(e){return!e.destroyed&&(n.has(e)||e.addHandles([a.watch((()=>{const t=e.parent;return!(!t||!("type"in t))&&("catalog-dynamic-group"===t.type||r(t))}),(t=>n.set(e,t)),a.syncAndInitial),t.makeHandle((()=>n.delete(e)))]),n.get(e))}function o(e){return e.parent&&"type"in e.parent&&"catalog-dynamic-group"===e.parent.type?e.parent.parent:null}e.getCatalogLayerForLayer=o,e.isLayerFromCatalog=r,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
