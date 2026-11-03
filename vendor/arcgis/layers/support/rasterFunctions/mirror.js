/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(o){"use strict";function t(o,t,e,r,f){const n=Math.floor(r/2);for(let c=0;c<n;c++)for(let r=0;r<t;r++)o[c*t+r]=o[(f-1-c)*t+r],o[(e-1-c)*t+r]=o[(e-f+c)*t+r];const l=Math.floor(f/2);for(let c=0;c<e;c++){const e=c*t;for(let r=0;r<l;r++)o[e+r]=o[e+f-1-r],o[e+t-r-1]=o[e+t+r-f]}}o.mirror=t,Object.defineProperty(o,Symbol.toStringTag,{value:"Module"})}));
