/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(e){"use strict";function n(e,n){switch(e){case"point":case"multipoint":return t();case"polyline":return o(n);case"polygon":return r(n);default:return}}function t(e){return"point"}function o(e){return(null!=e&&"polyline"===e.type&&e.paths.length?e.paths[0].length:0)<2?"polylineZeroVertices":"polylineOneVertex"}function r(e){const n=null!=e&&"polygon"===e.type&&e.rings.length?e.rings[0].length:0;return n<3?"polylineZeroVertices":n<4?"polygonOneVertex":"polygonTwoVertices"}e.getDrawHelpMessage=n,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
