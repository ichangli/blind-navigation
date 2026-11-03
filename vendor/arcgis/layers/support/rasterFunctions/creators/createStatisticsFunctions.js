/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../focalStatUtils","./utils"],(function(t,s,i){"use strict";function e(t){const{rows:e,cols:a,fillNoDataOnly:o=!1,raster:c,outputPixelType:l}=t,r={rows:e,cols:a,fillNoDataOnly:o,statisticsType:s.statisticsTypeMap.toJSON(t.statisticsType),raster:c};return i.createRasterFunction("Statistics",r,l)}t.statistics=e,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
