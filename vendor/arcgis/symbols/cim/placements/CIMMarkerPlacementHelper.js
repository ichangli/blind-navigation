/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../CIMOperators"],(function(e,t){"use strict";class r{static getPlacement(e,r,n,a,c,l){const o=t.getPlacementOperator(n);if(!o)return null;-1===r&&e.invertY();return o.execute(e,n,a,c,l)}}e.CIMMarkerPlacementHelper=r,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
