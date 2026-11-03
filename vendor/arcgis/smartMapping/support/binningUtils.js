/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../core/Error"],(function(e,i){"use strict";const r="aggregateCount";function n(e,r){if(!e.view)throw new i(`${r}:missing-parameters`,"'view' parameter is required for binning");if(e.sqlExpression)throw new i(`${r}:invalid-parameters`,"'sqlExpression' parameter is not supported for binning");if("3d"===e.view.type)throw new i(`${r}:invalid-parameters`,"3d view is not supported for binning")}e.aggregateCountField=r,e.verifyBinningParams=n,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
