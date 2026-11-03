/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../geometry/support/spatialReferenceUtils"],(function(e,t){"use strict";function r(e){return i(e)||t.isMars(e)||t.isMoon(e)}function i(e){return t.isWGS84(e)||t.isCGCS2000(e)}e.isSupportedEarthGCS=i,e.isSupportedGCSOnGlobe=r,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
