/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(e){"use strict";const t="randomUUID"in crypto;function r(){if(t)return crypto.randomUUID();const e=crypto.getRandomValues(new Uint16Array(8));e[3]=4095&e[3]|16384,e[4]=16383&e[4]|32768;const r=t=>e[t].toString(16).padStart(4,"0");return r(0)+r(1)+"-"+r(2)+"-"+r(3)+"-"+r(4)+"-"+r(5)+r(6)+r(7)}function n(){return`{${r().toUpperCase()}}`}function o(){return`{${r()}}`}e.generateBracedUUID=n,e.generateLowercaseBracedUUID=o,e.generateUUID=r,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
