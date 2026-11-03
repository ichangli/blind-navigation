/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../core/libs/gl-matrix-2/factories/vec3f64","./euclideanLengthMeasurementUtils","./geodesicLengthMeasurementUtils"],(function(e,t,n,i){"use strict";function o(e){return i.geodesicLength(e)??n.euclideanHorizontalLength(e)}function c(e,t){return i.geodesicDistanceBetweenPoints(e,t)??n.euclideanHorizontalDistanceBetweenPoints(e,t)}function a(e,t,o){return s[0]=e[0],s[1]=e[1],s[2]=3===e.length?e[2]:0,r[0]=t[0],r[1]=t[1],r[2]=3===t.length?t[2]:0,i.geodesicDistance(s,r,o)??n.euclideanHorizontalDistance(s,r,o)}const s=t.create(),r=t.create();e.autoDistance2D=a,e.autoDistanceBetweenPoints2D=c,e.autoLength2D=o,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
