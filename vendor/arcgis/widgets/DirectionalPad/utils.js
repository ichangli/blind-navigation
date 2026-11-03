/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../core/mathUtils","./constants"],(function(t,n,e){"use strict";function o(t){const n=r(t),o=e.directionalPadCyclicalAngles.map((t=>({angle:t,offset:Math.abs(t-n)}))).sort(((t,n)=>t.offset-n.offset)),c=o[0].angle;return-180===c?180:c}function r({x:t,y:e}){const o=Math.atan2(t,e);return n.rad2deg(o)}function c(t){const e=n.deg2rad(t);return{x:Math.sin(e),y:Math.cos(e)}}function i(t,n){const e=n.y-t.y,o=n.x-t.x,r=Math.sqrt(o*o+e*e);return{x:o/r,y:e/r}}function s(t){const{x:n,y:e,width:o,height:r}=t.getBoundingClientRect();return{x:n+o/2,y:e+r/2}}t.angleToUnitVector=c,t.findElementCenter=s,t.toUnitVector=i,t.unitVectorToAngle=r,t.vectorToClosestAngle=o,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
