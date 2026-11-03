/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../../chunks/Jpg","../../../chunks/Zlib"],(function(e,t){"use strict";class n{static decode(n,r=!1){const s=new Uint8Array(n),i=new e.JpegImage;i.parse(s);const{width:a,height:o,numComponents:c,eof:h}=i,f=i.getData(a,o,!0),l=a*o;let u,g=null,w=0,y=0,p=0;if(!r&&h<s.length-1)try{const e=new t.Zlib(s.subarray(h)).getBytes();g=new Uint8Array(l);let n=0;for(w=0;w<e.length;w++)for(p=7;p>=0;p--)g[n++]=e[w]>>p&1}catch{}if(1===c&&f.length===a*o){const e=new Uint8Array(f.buffer);u=[e,e,e]}else{for(u=[],w=0;w<3;w++)u.push(new Uint8Array(l));for(p=0,y=0;y<l;y++)for(w=0;w<3;w++)u[w][y]=f[p++]}return{width:a,height:o,pixels:u,mask:g}}}return n}));
