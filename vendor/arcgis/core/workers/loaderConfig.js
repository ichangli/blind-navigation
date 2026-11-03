/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../config","../../request","../Error","../Logger","../urlUtils","../has"],(function(e,a,s,r,t,l,n){"use strict";let o=null;const c={};function u(e){const a={async:e.async,isDebug:e.isDebug,locale:e.locale,baseUrl:e.baseUrl,has:{...e.has},map:{...e.map},packages:e.packages?.concat()||[],paths:{...c.paths,...e.paths}};return e.hasOwnProperty("async")||(a.async=!0),e.hasOwnProperty("isDebug")||(a.isDebug=!1),e.baseUrl||(a.baseUrl=c.baseUrl),a}e.defaultLoaderUrl=o,e.loaderConfig=u,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
