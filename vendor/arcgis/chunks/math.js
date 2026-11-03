/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(t){"use strict";
/*!
     * All material copyright ESRI, All Rights Reserved, unless otherwise specified.
     * See https://github.com/Esri/calcite-design-system/blob/main/LICENSE.md for details.
     * v2.8.5
     */const e=(t,e,n)=>Math.max(e,Math.min(t,n)),n=new RegExp(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/),a=t=>{const e=(""+t).match(n);return e&&0!==parseInt(e[1])?Math.max(0,(e[1]?e[1].length:0)-(e[2]?+e[2]:0)):0};function r(t){return a(t)>0&&t>0?parseFloat(`0.${t.toString().split(".")[1]}`):t}function c(t,e,n,a,r){return(t-e)*(r-a)/(n-e)+a}function i(t,e,n){return t<n?-1:t>e-n?1:0}t.clamp=e,t.closeToRangeEdge=i,t.decimalPlaces=a,t.getDecimals=r,t.remap=c}));
