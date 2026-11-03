/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../layers/support/arcgisLayerUrl","./FeatureService"],(function(e,r,t){"use strict";const s=(e,u)=>{for(const o of e)if("feature"===o.type||"subtype-group"===o.type){if(!o.url)continue;const e=r.parse(o.url).url.path,s=u.get(e);if(s)s.layers.push(o);else{const r=new t({url:e}),s=[o];u.set(e,{featureService:r,layers:s})}}else"group"===o.type&&s(o.layers,u)};function u(e){const r=new Map;return s(e,r),r}e.createFeatureServices=u,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
