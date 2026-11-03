/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../core/handleUtils"],(function(e,i){"use strict";function t(e){const t=()=>e("visible"===document.visibilityState);return document.addEventListener("visibilitychange",t),i.makeHandle((()=>document.removeEventListener("visibilitychange",t)))}e.onVisibilityChange=t,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
