/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(c){"use strict";function t(c){return c=c||globalThis.location.hostname,n.some((t=>null!=c?.match(t)))}function a(c,t){return c&&(t=t||globalThis.location.hostname)?null!=t.match(e)||null!=t.match(s)?c.replace("static.arcgis.com","staticdev.arcgis.com"):null!=t.match(o)||null!=t.match(i)?c.replace("static.arcgis.com","staticqa.arcgis.com"):c:c}const e=/^devext\.arcgis\.com$/,o=/^qaext\.arcgis\.com$/,s=/^[\w-]*\.mapsdevext\.arcgis\.com$/,i=/^[\w-]*\.mapsqa\.arcgis\.com$/,n=[/^([\w-]*\.)?[\w-]*\.zrh-dev-local\.esri\.com$/,e,o,/^jsapps\.esri\.com$/,s,i];c.adjustStaticAGOUrl=a,c.devHostnames=n,c.isDevEnvironment=t,Object.defineProperty(c,Symbol.toStringTag,{value:"Module"})}));
