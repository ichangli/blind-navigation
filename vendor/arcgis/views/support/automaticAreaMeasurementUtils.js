/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./euclideanAreaMeasurementUtils","./geodesicAreaMeasurementUtils"],(function(e,a,n){"use strict";function r(e,r,t=a.createEuclideanPlanarAreaCache()){if("on-the-ground"===r){const r=n.geodesicArea(e);return null!=r?r:a.euclideanHorizontalPlanarArea(e,t)}return a.euclideanPlanarArea(e,t)}function t(e,n=a.createEuclideanPlanarAreaCache()){return r(e,"on-the-ground",n)}e.autoArea2D=t,e.autoAreaByElevationMode=r,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
