/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(t){"use strict";async function e(t,e){if("2d"===t.type)return t.hitTest(e);const i=await t.hitTest(e);if(0===i.results.length)return i;const r=i.results[0],s=(r.distance??0)*(1+n),u=i.results.findIndex((t=>(t.distance??0)>s));return-1!==u&&(i.results=i.results.slice(0,u)),r&&i.ground.distance>s&&(i.ground.mapPoint=null),i}const n=.05;function i(t){return"graphic"===t?.type}function r(t){return t.find(i)??null}function s(t){return t.filter(i)}t.filterGraphicHits=s,t.findFirstGraphicHit=r,t.hitTestSelectSimilarDistance=e,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
