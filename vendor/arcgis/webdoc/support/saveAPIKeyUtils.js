/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../config","../../core/Error","../../support/apiKeyUtils"],(function(e,t,i,o){"use strict";function p(e){if(t.apiKey&&o.supportsApiKey(e.portal.url))throw new i("save-api-key-utils:api-key-not-supported",`Saving is not supported on ${e.portal.url} when using an api key`)}e.validateSaveAPIKey=p,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
