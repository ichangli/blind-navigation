/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../request"],(function(e,t){"use strict";async function n(e,n){const{data:r}=await t(e,{responseType:"json",query:{f:"json",...n?.customParameters,token:n?.apiKey}});return r}e.fetchArcGISServiceJSON=n,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
