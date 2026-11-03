/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../../chunks/vec32","../../../../../core/libs/gl-matrix-2/factories/vec3f64","../../../../../chunks/boundedPlane"],(function(e,t,n,c){"use strict";function o(e,n){return c.fromAABoundingRect(n.extent,i),c.distance(i,t.set(r,e.x,e.y,0))}const i=c.create(),r=n.create();e.distanceToTile=o,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
