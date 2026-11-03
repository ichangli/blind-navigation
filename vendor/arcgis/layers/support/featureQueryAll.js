/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../rest/support/Query"],(function(e,t){"use strict";async function r(e,t,r){t=t.clone(),e.capabilities.query.supportsMaxRecordCountFactor&&(t.maxRecordCountFactor=o(e));const a=u(e),n=e.capabilities.query.supportsPagination;t.start=0,t.num=a;let i=null;for(;;){const u=await e.source.queryFeaturesJSON(t,r);if(null==i?i=u:i.features=i.features.concat(u.features),i.exceededTransferLimit=u.exceededTransferLimit,!n||!u.exceededTransferLimit)break;t.start+=a}return i}function u(e){return o(e)*a(e)}function a(e){return e.capabilities.query.maxRecordCount||2e3}function o(e){return e.capabilities.query.supportsMaxRecordCountFactor?t.MAX_MAX_RECORD_COUNT_FACTOR:1}e.getMaxRecordCountFactor=o,e.getMaximumQuerySize=u,e.getMaximumRecordCount=a,e.queryAllJSON=r,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
