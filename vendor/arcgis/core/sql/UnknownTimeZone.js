/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../chunks/datetime"],(function(n,e){"use strict";class o{}function t(n){return n instanceof e.Zone?n===o.instance:"unknown"===n?.toString().toLowerCase()}function i(n){return t(n)?o.instance:n}function c(n,o){return e.DateTime.fromObject({day:n.day,year:n.year,month:n.month,hour:n.hour,minute:n.minute,second:n.second,millisecond:n.millisecond},{zone:o})}o.instance=new e.IANAZone("Etc/UTC"),n.UnknownTimeZone=o,n.adoptTimeZone=c,n.isUnknownTimeZone=t,n.substituteUnknownTimezone=i,Object.defineProperty(n,Symbol.toStringTag,{value:"Module"})}));
