/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./enums"],(function(e,a){"use strict";function t(e){switch(e){case a.DataType.BYTE:case a.DataType.UNSIGNED_BYTE:return 1;case a.DataType.SHORT:case a.DataType.UNSIGNED_SHORT:case a.DataType.HALF_FLOAT:return 2;case a.DataType.FLOAT:case a.DataType.INT:case a.DataType.UNSIGNED_INT:return 4}}e.getDataTypeBytes=t,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
