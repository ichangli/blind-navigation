/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(e){"use strict";function r(e){const r=atob(e),t=new Uint8Array(r.length);for(let n=0;n<r.length;n++)t[n]=r.charCodeAt(n);return t.buffer}function t(e){const r=new Uint8Array(e);let t="";for(let n=0;n<r.length;n++)t+=String.fromCharCode(r[n]);return btoa(t)}e.arrayBufferToBase64=t,e.base64ToArrayBuffer=r,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
