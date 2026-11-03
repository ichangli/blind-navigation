/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(e){"use strict";function t(e,t,n){e[0]=t[0]+n[0],e[1]=t[1]+n[1],e[2]=t[2]+n[2]}function n(e,t,n){e[0]=t[0]-n[0],e[1]=t[1]-n[1],e[2]=t[2]-n[2]}function o(e,t,n){e[0]=t[0]*n,e[1]=t[1]*n,e[2]=t[2]*n}function c(e,t){let n=t[0]*t[0]+t[1]*t[1]+t[2]*t[2];n>0&&(n=1/Math.sqrt(n),e[0]=t[0]*n,e[1]=t[1]*n,e[2]=t[2]*n)}function r(e,t,n){e[0]=t[1]*n[2]-t[2]*n[1],e[1]=t[2]*n[0]-t[0]*n[2],e[2]=t[0]*n[1]-t[1]*n[0]}const i=Object.freeze(Object.defineProperty({__proto__:null,add:t,cross:r,normalize:c,scale:o,subtract:n},Symbol.toStringTag,{value:"Module"}));e.add=t,e.cross=r,e.normalize=c,e.scale=o,e.subtract=n,e.vec3Inline=i,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
