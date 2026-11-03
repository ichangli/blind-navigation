/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./number"],(function(t,r){"use strict";function n(t,r=0,n=!1){const e=t[r+3];return t[r]*=e,t[r+1]*=e,t[r+2]*=e,n||(t[r+3]*=255),t}function e(t){if(!t)return 0;const{r:n,g:e,b:i,a:o}=t,u=n*o,l=e*o,c=i*o,p=255*o;return r.i8888to32(u,l,c,p)}function i(t){if(!t)return 0;const[n,e,i,o]=t,u=n*(o/255),l=e*(o/255),c=i*(o/255),p=o;return r.i8888to32(u,l,c,p)}function o(t,r,n=0){if(null==r)return t[n]=0,t[n+1]=0,t[n+2]=0,void(t[n+3]=0);const{r:e,g:i,b:o,a:u}=r;t[n]=e*u/255,t[n+1]=i*u/255,t[n+2]=o*u/255,t[n+3]=u}t.premultiplyAlpha=n,t.premultiplyAlphaRGBA=e,t.premultiplyAlphaRGBAArray=i,t.writeColor=o,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
