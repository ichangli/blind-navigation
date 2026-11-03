/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../symbols","../../core/Error","../cim/CIMSymbolHelper","../CIMSymbol"],(function(o,e,t,n,r){"use strict";function l(o){const e=n.symbolToCIM(o);if(!e)throw new t("cimConversionUtils.convertToCIMSymbol","Unable to convert this symbol to CIM");return new r({data:e})}o.convertToCIMSymbol=l,Object.defineProperty(o,Symbol.toStringTag,{value:"Module"})}));
