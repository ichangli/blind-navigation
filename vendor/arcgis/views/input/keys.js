/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../core/has"],(function(e,t){"use strict";const r=t("mac")?"Meta":"Control",o=new Set(["Alt","Control","Meta","Shift","Ctrl","Primary"]),i=e=>o.has(e);e.isSystemModifier=i,e.primaryKey=r,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
