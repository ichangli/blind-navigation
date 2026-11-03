/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(e){"use strict";function t(e,t){const n=e.featureReduction;return n&&"selection"!==n.type&&(!("maxScale"in n)||!n.maxScale||n.maxScale<t.scale)?n:null}e.getEffectiveFeatureReduction=t,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
