/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../geometry/projection","../../support/ElevationProvider"],(function(e,o,t){"use strict";function n(e,n,i,r=!1){const l=o.tryProjectWithZConversion(e,n);return null==l?null:(l.hasZ&&!r||null==i||(l.z=t.getElevationAtPoint(i,l)??0),l)}function i(e,o,t){t.warnOnce(`Failed to project analysis geometry (id: '${e.id}'), projection from spatial reference (wkid: '${o.wkid}') to view spatial reference is not supported. Projection may be possible after calling projection.load().`)}e.applyProjectionAndElevationAlignment=n,e.logFailedGeometryProjectionError=i,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
