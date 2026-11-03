/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./TextHelperCanvas"],(function(t,e){"use strict";function n(t){const{size:n}=t.definition,i=t.fontString(n);let a=s.get(i);if(!a){const u=e.getTextHelperCanvas(r,0,0).getContext("2d");t.setFontProperties(u,n);const l=u.measureText(c);a=new o(l.actualBoundingBoxAscent,l.actualBoundingBoxDescent),s.set(i,a)}return a}const s=new Map;class o{get maxHeight(){return this.maxAscent+this.maxDescent}constructor(t,e){this.maxAscent=t,this.maxDescent=e}}const r={canvas:null},c=(()=>{let t="";for(let e=32;e<127;e++)t+=String.fromCharCode(e);return t})();t.getFontMetrics=n,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
