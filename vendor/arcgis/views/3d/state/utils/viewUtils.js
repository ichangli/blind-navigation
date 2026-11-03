/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../core/mathUtils","../../../../chunks/vec32","../../../../core/libs/gl-matrix-2/factories/vec3f64"],(function(e,t,o,c){"use strict";function r(e,c,r){e.worldUpAtPosition(c,n),o.subtract(i,r,c);const s=o.length(i);return 0===s?0:t.acosClamped(o.dot(i,n)/s)}const n=c.create(),i=c.create();e.viewAngle=r,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
