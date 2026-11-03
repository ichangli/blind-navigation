/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../chunks/vec32","../../core/libs/gl-matrix-2/factories/vec3f64","./projectVectorToVector"],(function(e,t,o,c){"use strict";function r(e,o,r,a,s){t.copy(i,e),t.add(n,e,o),c.projectVectorToVector(i,r,i,s),c.projectVectorToVector(n,r,n,s),t.subtract(a,n,i),t.normalize(a,a)}const i=o.create(),n=o.create();e.projectDirection=r,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
