/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../../core/sql"],(function(e,t){"use strict";function i(e,i,n,o){const r=null!=e.subtypeCode?`${e.subtypeField} = ${e.subtypeCode}`:null,s=t.sqlAnd(e.definitionExpression,r),a=e.customParameters??{};return o&&(a.token=o),{type:"feature",mutable:{sourceRefreshVersion:n,availableFields:i.availableFields,dataFilter:{queryScaleRanges:e.queryScaleRanges??[],definitionExpression:s,gdbVersion:e.gdbVersion,historicMoment:e.historicMoment?.getTime(),timeExtent:e.timeExtent?.toJSON(),customParameters:a}}}}e.createFeatureSourceSchema=i,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
