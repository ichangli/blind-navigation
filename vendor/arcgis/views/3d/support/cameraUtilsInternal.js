/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../core/mathUtils","../../../chunks/vec32","../../../core/libs/gl-matrix-2/factories/vec3f64"],(function(t,e,c,o){"use strict";const a=o.create(),n=o.create();function r(){return{direction:o.create(),up:o.create()}}function i(t,o,r,i,l){let d=c.normalize(a,t),s=c.dot(d,i);const u=s>0;s=Math.abs(s),s>.99&&(s=Math.abs(c.dot(o,i)),s<.99?(c.copy(d,o),u&&c.scale(d,d,-1)):d=null);let g=0;if(d){c.scale(n,i,c.dot(i,d)),c.subtract(d,d,n);const t=c.dot(d,l)/(c.length(d)*c.length(l));c.cross(n,d,l);g=(c.dot(n,i)>0?1:-1)*e.rad2deg(e.acosClamped(t))}const h=e.rad2deg(e.acosClamped(-c.dot(i,t)/c.length(t)));return r?(r.heading=g,r.tilt=h,r):{heading:g,tilt:h}}t.createDirectionUp=r,t.directionToHeadingTilt=i,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
