/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../config","../kernel","../core/lang","../core/urlUtils","../support/apiKeyUtils"],(function(e,n,t,i,r,o){"use strict";function s(e,n){return n?{...n,query:{...e??{},...n.query}}:{query:e}}function u(e){return"string"==typeof e?r.urlToObject(e):i.clone(e)}function l(e,n,t){const i={};for(const r in e){if("declaredClass"===r)continue;const o=e[r];if(null!=o&&"function"!=typeof o)if(Array.isArray(o))i[r]=o.map((e=>l(e)));else if("object"==typeof o)if(o.toJSON){const e=o.toJSON(t?.[r]);i[r]=n?e:JSON.stringify(e)}else i[r]=n?o:JSON.stringify(o);else i[r]=o}return i}function c(e,i){return e?o.supportsApiKey(e)&&(i||n.apiKey)?i||n.apiKey:t.id?.findCredential(e)?.token:null}e.asValidOptions=s,e.encode=l,e.getToken=c,e.parseUrl=u,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
