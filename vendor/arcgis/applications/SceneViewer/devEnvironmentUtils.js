/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../core/devEnvironmentUtils"],(function(n,t){"use strict";function e(n){return t.isDevEnvironment(n)}function o(n){n=n||globalThis.location.hostname;return[/^zrh-.+?\.esri\.com$/].concat(t.devHostnames).some((t=>null!=n?.match(t)))}function i(n,e){return t.adjustStaticAGOUrl(n,e)}n.adjustStaticAGOUrl=i,n.isDevEnvironment=e,n.isTelemetryDevEnvironment=o,Object.defineProperty(n,Symbol.toStringTag,{value:"Module"})}));
