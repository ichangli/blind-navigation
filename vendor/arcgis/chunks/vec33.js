/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(e){"use strict";function t(e,t){f(e.typedBuffer,t.typedBuffer,e.typedBufferStride,t.typedBufferStride)}function f(e,t,f=3,o=f){const n=t.length/o;let r=0,c=0;for(let u=0;u<n;++u)e[r]=t[c],e[r+1]=t[c+1],e[r+2]=t[c+2],r+=f,c+=o}function o(e,t,f,o,n){const r=e.typedBuffer,c=e.typedBufferStride,u=n?.count??e.count;let i=(n?.dstIndex??0)*c;for(let d=0;d<u;++d)r[i]=t,r[i+1]=f,r[i+2]=o,i+=c}const n=Object.freeze(Object.defineProperty({__proto__:null,copy:f,copyView:t,fill:o},Symbol.toStringTag,{value:"Module"}));e.copy=f,e.copyView=t,e.fill=o,e.vec3=n}));
