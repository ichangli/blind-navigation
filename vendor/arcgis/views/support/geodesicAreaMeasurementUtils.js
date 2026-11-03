/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../core/quantityUtils","../../geometry/geometryEngine","../../geometry/support/geodesicUtils","./geodesicMeasurementUtils"],(function(e,r,t,s,a){"use strict";function n(e){const{spatialReference:r}=e;return a.geodesicMeasure(r,o,i,e)}function o(e){return r.createArea(Math.abs(s.geodesicAreas([e],"square-meters")[0]),"square-meters")}function i(e){try{return r.createArea(Math.abs(t.geodesicArea(e,"square-meters")),"square-meters")}catch(s){return null}}e.geodesicArea=n,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
