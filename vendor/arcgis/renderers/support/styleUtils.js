/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../core/asyncUtils","../../core/promiseUtils","../../core/Warning"],(function(e,r,t,n){"use strict";async function o(e,o,i){const s=e&&e.getAtOrigin&&e.getAtOrigin("renderer",o.origin);if(s&&"unique-value"===s.type&&s.styleOrigin){const a=await r.result(s.populateFromStyle());if(t.throwIfAborted(i),!1===a.ok){const r=a.error;o?.messages&&o.messages.push(new n("renderer:style-reference",`Failed to create unique value renderer from style reference: ${r.message}`,{error:r,context:o})),e.clear("renderer",o?.origin)}}}e.loadStyleRenderer=o,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
