/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../core/mathUtils","../../chunks/vec32","../../core/libs/gl-matrix-2/factories/vec3f64"],(function(t,e,n,o){"use strict";function c(t,e,o){const c=n.dot(t,e)/n.dot(t,t);return n.scale(o,t,c)}function r(t,e){return n.dot(t,e)/n.length(t)}function i(t,o){const c=n.dot(t,o)/(n.length(t)*n.length(o));return-e.acosClamped(c)}function a(t,o,c){n.normalize(s,t),n.normalize(l,o);const r=n.dot(s,l),i=e.acosClamped(r),a=n.cross(s,s,l);return n.dot(a,c)<0?2*Math.PI-i:i}const s=o.create(),l=o.create();t.angle=i,t.angleAroundAxis=a,t.projectPoint=c,t.projectPointSignedLength=r,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
