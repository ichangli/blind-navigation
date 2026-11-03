/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../Ground","../../../core/arrayUtils","../../../core/unitUtils"],(function(n,e,t,l){"use strict";function r(n){if(null==n)return null;if(n instanceof e)return u(n);const r=n.tileInfo;if(null==r)return null;const i=t.last(r.lods);return null==i?null:i.resolution*l.getMetersPerUnitForSR(r.spatialReference)}function u(n){if(null==n)return null;const e=n.layers.items.map(i).filter(t.isSome);return t.min(e)??null}function i(n){return n&&"tileInfo"in n?r(n):null}n.getGroundMinDemResolution=u,n.getQuerySourceMinDemResolution=r,Object.defineProperty(n,Symbol.toStringTag,{value:"Module"})}));
