/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../core/quantityUtils","./automaticLengthMeasurementUtils"],(function(t,e,n){"use strict";function o({topLeft:t,topRight:o,bottomRight:i,bottomLeft:a,spatialReference:u}){const l=e.max(n.autoDistance2D(a,i,u),n.autoDistance2D(t,o,u));if(null==l)return null;const c=e.max(n.autoDistance2D(i,o,u),n.autoDistance2D(a,t,u));return null==c?null:{xSize:l,ySize:c}}t.autoSize2D=o,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
