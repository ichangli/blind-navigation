/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(t){"use strict";let e=1e-6;function n(){return e}function o(t){e=t}const a=Math.random,r=Math.PI/180,i=180/Math.PI;function u(t){return t*r}function s(t){return t*i}function l(t,n){return Math.abs(t-n)<=e*Math.max(1,Math.abs(t),Math.abs(n))}const c=Object.freeze(Object.defineProperty({__proto__:null,RANDOM:a,equals:l,getEpsilon:n,setEpsilon:o,toDegree:s,toRadian:u},Symbol.toStringTag,{value:"Module"}));t.RANDOM=a,t.common=c,t.equals=l,t.getEpsilon=n,t.setEpsilon=o,t.toDegree=s,t.toRadian=u,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
