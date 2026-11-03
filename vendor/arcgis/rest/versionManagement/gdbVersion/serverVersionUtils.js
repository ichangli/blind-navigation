/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../request"],(function(e,r){"use strict";async function t(e,t){let n=null;const a="string"==typeof t?t:t.path;if(!e.has(a)){const s=await r(a.replace(/\/VersionManagementServer/i,"/FeatureServer"),{query:{f:"json"}});n={serverVersion:Number(s.data.currentVersion),featureServerUrl:a.replace(/\/VersionManagementServer/i,"/FeatureServer")},e.set(t,n)}}e.addServerVersion=t,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
