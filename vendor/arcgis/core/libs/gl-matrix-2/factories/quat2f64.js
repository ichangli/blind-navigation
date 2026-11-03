/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(e){"use strict";function t(){return[0,0,0,1,0,0,0,0]}function n(e){return[e[0],e[1],e[2],e[3],e[4],e[5],e[6],e[7]]}function o(e,t,n,o,r,u,a,c){return[e,t,n,o,r,u,a,c]}function r(e,t,n,o,r,u,a){const c=.5*r,i=.5*u,l=.5*a;return[e,t,n,o,c*o+i*n-l*t,i*o+l*e-c*n,l*o+c*t-i*e,-c*e-i*t-l*n]}function u(e,t){return new Float64Array(e,t,8)}const a=Object.freeze(Object.defineProperty({__proto__:null,clone:n,create:t,createView:u,fromRotationTranslationValues:r,fromValues:o},Symbol.toStringTag,{value:"Module"}));e.clone=n,e.create=t,e.createView=u,e.fromRotationTranslationValues=r,e.fromValues=o,e.quat2f64=a,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
