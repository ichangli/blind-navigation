/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../core/mathUtils","../../core/unitUtils","../../chunks/vec32","./Axis","./plane"],(function(t,e,r,i,n,s){"use strict";function a(t,r,i){const a=o(c,t,r,i)?s.getNormal(c):[0,0,1];return Math.abs(a[2])>Math.cos(e.deg2rad(80))?n.Axis.Z:Math.abs(a[1])>Math.abs(a[0])?n.Axis.Y:n.Axis.X}function o(t,e,n,a){const o=(t=>!Array.isArray(t[0]))(e)?(t,r)=>e[3*t+r]:(t,r)=>e[t][r],c=a?r.getMetersPerUnitForSR(a)/r.getMetersPerVerticalUnitForSR(a):1;return s.fromManyPoints(t,((t,e)=>i.set(t,o(e,0)*c,o(e,1)*c,o(e,2))),n)}const c=s.create();t.fitPlane=o,t.leastSignificantAxis=a,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
