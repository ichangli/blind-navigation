/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../kernel","../../request"],(function(e,n,r){"use strict";async function t(e,t,s){const u=n.id?.findCredential(e.restUrl);if(!u)return null;if("loaded"===e.loadStatus&&""===t&&e.user?.sourceJSON&&!1===s)return e.user.sourceJSON;const o={responseType:"json",query:{f:"json"}};if(s&&(o.query.returnUserLicenseTypeExtensions=!0),""===t){const n=await r(e.restUrl+"/community/self",o);if(n.data){const e=n.data;if(e?.username)return e}return null}const i=await r(e.restUrl+"/community/users/"+t,o);if(i.data){const e=i.data;return e.error?null:e}return null}async function s(e,n,r){const s=await t(e,n,!0);return s?.userLicenseTypeExtensions?.includes(r)??!1}e.hasUserTypeExtension=s,e.lookupUser=t,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
