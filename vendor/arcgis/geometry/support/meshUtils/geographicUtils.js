/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../core/deprecate","../meshVertexSpaceUtils"],(function(e,r,t){"use strict";function o(e,r){return e.isGeographic||e.isWebMercator&&(r??!0)}function i(e,o,i,a){if(void 0!==a){r.deprecated(e(),"option: geographic",{replacement:"Use mesh `vertexSpace` and spatial reference to control how operations are performed instead.",version:"4.30",warnOnce:!0});const c="local"===o.type;if(!t.isRelativeVertexSpace(o)||a===c)return i.isGeographic||i.isWebMercator&&a;e().warnOnce(`Specifying the 'geographic' parameter (${a}) for a Mesh vertex space of type "${o.type}" is not supported. This parameter will be ignored.`)}switch(o.type){case"georeferenced":return i.isGeographic;case"local":return i.isGeographic||i.isWebMercator}}e.isGlobal=o,e.performGlobalOperation=i,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
