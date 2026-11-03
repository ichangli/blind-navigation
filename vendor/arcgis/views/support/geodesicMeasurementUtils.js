/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../geometry/support/geodesicUtils","../../geometry/support/spatialReferenceUtils"],(function(e,o,t){"use strict";function r(e){return t.isGeographic(e)&&o.isSupported(e)||t.isWebMercator(e)}function i(e,r,i,...s){return t.isGeographic(e)&&o.isSupported(e)?r.apply(void 0,s):t.isWebMercator(e)?i.apply(void 0,s):null}const s=1e5;e.geodesicDistanceThreshold=s,e.geodesicMeasure=i,e.supportsGeodesicMeasurement=r,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
