/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../geometry/ellipsoidUtils","../../geometry/spatialReferenceEllipsoidUtils","../../geometry/support/spatialReferenceUtils"],(function(e,t,i,r){"use strict";function s(e){return r.isEarth(e)?r.isWGS84(e)||r.isWebMercator(e)||r.isCGCS2000(e)||t.isSphericalECEF(e)?i.WGS84ECEFSpatialReference:e:i.getSphericalPCPF(e)}e.computeEuclideanMeasurementSR=s,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
