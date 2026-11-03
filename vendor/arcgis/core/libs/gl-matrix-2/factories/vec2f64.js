/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(e){"use strict";function n(){return[0,0]}function t(e){return[e[0],e[1]]}function r(e,n){return[e,n]}function o(e,t=n()){const r=Math.min(2,e.length);for(let n=0;n<r;++n)t[n]=e[n];return t}function u(e,n){return new Float64Array(e,n,2)}function c(){return n()}function i(){return r(1,1)}function f(){return r(1,0)}function a(){return r(0,1)}const l=c(),s=i(),S=f(),_=a(),m=Object.freeze(Object.defineProperty({__proto__:null,ONES:s,UNIT_X:S,UNIT_Y:_,ZEROS:l,clone:t,create:n,createView:u,fromArray:o,fromValues:r,ones:i,unitX:f,unitY:a,zeros:c},Symbol.toStringTag,{value:"Module"}));e.ONES=s,e.UNIT_X=S,e.UNIT_Y=_,e.ZEROS=l,e.clone=t,e.create=n,e.createView=u,e.fromArray=o,e.fromValues=r,e.ones=i,e.unitX=f,e.unitY=a,e.vec2f64=m,e.zeros=c,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
