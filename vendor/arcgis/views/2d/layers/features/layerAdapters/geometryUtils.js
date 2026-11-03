/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(e){"use strict";function t(e){switch(e.geometryType){case"point":return"esriGeometryPoint";case"polyline":return"esriGeometryPolyline";case"polygon":case"multipatch":return"esriGeometryPolygon";case"multipoint":return"esriGeometryMultipoint";default:return null}}e.getEffectiveGeometryType=t,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
