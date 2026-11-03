/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./lineObjectVisualElementUtils","./manipulatedObjectUtils","./originGeometryVisualElementUtils"],(function(e,t,l,n){"use strict";function i(e){switch(l.manipulatedObjectGeometry(e.object)?.type){case"point":case"mesh":return n.createVisualElements(e);case"polygon":case"polyline":return t.createVisualElements(e);default:return null}}e.createVisualElements=i,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
