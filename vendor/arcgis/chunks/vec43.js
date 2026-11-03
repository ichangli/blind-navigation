/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(e){"use strict";function t(e,t){f(e.typedBuffer,t,e.typedBufferStride)}function f(e,t,f=4){const o=t.typedBuffer,n=t.typedBufferStride,c=t.count;let r=0,u=0;for(let i=0;i<c;++i)e[r]=o[u],e[r+1]=o[u+1],e[r+2]=o[u+2],e[r+3]=o[u+3],r+=f,u+=n}function o(e,t,f,o,n,c){const r=e.typedBuffer,u=e.typedBufferStride,i=c?.count??e.count;let d=(c?.dstIndex??0)*u;for(let l=0;l<i;++l)r[d]=t,r[d+1]=f,r[d+2]=o,r[d+3]=n,d+=u}const n=Object.freeze(Object.defineProperty({__proto__:null,copy:f,copyView:t,fill:o},Symbol.toStringTag,{value:"Module"}));e.copy=f,e.copyView=t,e.fill=o,e.vec4=n}));
