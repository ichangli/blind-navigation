/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./wkid"],(function(e,t){"use strict";function i(e){return t.horizontalWkidHeightUnitFeet.includes(e)?"feet":"meters"}function n(e,n){return"number"==typeof e?t.verticalWkidHeightUnitFeet.includes(e)?"feet":"meters":i(n)}function r(e,i){return e&&t.ellipsoidalWkid.includes(e)||4326===i?"ellipsoidal":"gravity-related-height"}e.getHeightModel=r,e.getHorizontalUnit=i,e.getVerticalUnit=n,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
