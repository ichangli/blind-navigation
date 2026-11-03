/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./spatialReferenceUtils","./webMercatorUtils"],(function(t,e,n){"use strict";function r(t,e){const n=t.x-e.x,r=t.y-e.y,i=null!=t.z&&null!=e.z?t.z-e.z:0;return Math.sqrt(n*n+r*r+i*i)}function i(t){return o(t,l)?.[0]??null}function u(t){return o(t,l)?.[1]??null}function o({x:t,y:r,spatialReference:i},u=[0,0]){if(i){if(e.isWebMercator(i))return n.xyToLngLat(t,r,u);if(e.isGeographic(i))return u[0]=t,u[1]=r,u}return null}const l=[0,0];t.distance=r,t.getLatitude=u,t.getLongitude=i,t.getLongitudeLatitude=o,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
