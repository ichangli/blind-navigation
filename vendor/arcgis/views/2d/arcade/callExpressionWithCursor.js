/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../core/has","../../../core/Logger"],(function(e,r,t){"use strict";function n(e,r,n){if(null==e)return null;const u=r.readArcadeFeature();r.contextTimeZone=n.$view?.timeZone;try{return e.evaluate({...n,$feature:u},e.services)}catch(a){return t.getLogger("esri.views.2d.support.arcadeOnDemand").warn("Feature arcade evaluation failed:",a),null}}function u(e){return null==e||e===1/0||e===-1/0||"number"==typeof e&&isNaN(e)}function a(e,r,t,n){if(null==e)return null!=n?n:null;const a=r.readArcadeFeature();r.contextTimeZone=t.$view?.timeZone;const l=e.evaluate({...t,$feature:a},e.services);return u(l)?null!=n?n:null:l}e.callExpressionWithCursor=n,e.callExpressionWithCursorWithDefault=a,e.isBadArcadeResult=u,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
