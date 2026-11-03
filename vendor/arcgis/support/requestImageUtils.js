/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../request"],(function(e,t){"use strict";async function n(e,n){const{data:r}=await t(e,{responseType:"image",...n});return r}e.requestImage=n,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
