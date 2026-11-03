/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../utils","./operations/queryTopFeatures","../support/FeatureSet","../support/TopFeaturesQuery"],(function(e,t,r,u,o){"use strict";async function a(e,a,s,p){const n=t.parseUrl(e),i={...p},{data:c}=await r.executeTopFeaturesQuery(n,o.from(a),s,i);return u.fromJSON(c)}e.executeTopFeaturesQuery=a,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
