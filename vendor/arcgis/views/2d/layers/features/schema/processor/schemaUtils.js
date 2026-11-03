/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(t){"use strict";function e(t,e){const n=t.slice(0,e),o=e-n.length;for(let r=0;r<o;r++){const t=n[n.length-1];n.push(t)}return n}function n(t){if(!t)return[0,0,0,0];const{r:e,g:n,b:o,a:r}=t;return[e*(r/255),n*(r/255),o*(r/255),r]}t.padStops=e,t.premultiplyColor=n,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
