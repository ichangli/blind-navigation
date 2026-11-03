/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../core/jsonMap","../../geometry/support/spatialReferenceUtils"],(function(e,t,n){"use strict";const o=new t.JSONMap({preserveShape:"preserve-shape"});function s(e){const{polylines:t,lengthUnit:s,geodesic:r,calculationType:i}=e.toJSON(),l={};l.polylines=JSON.stringify(t);const a=e.polylines[0].spatialReference;return l.sr=n.srToRESTValue(a),s&&(l.lengthUnit=s),r&&(l.geodesic=r),i&&(l.calculationType=o.toJSON(i)),l}e.lengthsToRESTParameters=s,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
