/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../TimeExtent","../../core/Error","../../core/accessorSupport/ensureType"],(function(e,t,r,n){"use strict";const o={type:t,json:{read:{source:"timeExtent",reader:e=>e?Array.isArray(e)?t.fromArray(e):t.fromJSON(e):null},write:{writer:(e,t,n,o)=>{e&&(e.isEmpty?o?.messages&&o.messages.push(new r("invalid-timeExtent","TimeExtent cannot be empty")):t[n]=e.toArray())},target:{timeExtent:{type:[[n.Integer,n.Null]]}}}}};e.timeExtent=o,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
