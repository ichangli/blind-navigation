/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../core/unitUtils","../../../geometry/support/spatialReferenceUtils"],(function(e,t,n){"use strict";function i(e,t,n){if(null==e.hasM||e.hasZ)for(const i of t)for(const e of i)e.length>2&&(e[2]*=n)}function s(e,n,i){if(!e&&!n||!i)return;const s=t.getMetersPerVerticalUnitForSR(i);o(e,i,s),o(n,i,s)}function o(e,t,n){if(e)for(const i of e)r(i.geometry,t,n)}function r(e,s,o){if(!e?.spatialReference||n.equals(e.spatialReference,s))return;const r=t.getMetersPerVerticalUnitForSR(e.spatialReference)/o;if(1!==r)if("x"in e)null!=e.z&&(e.z*=r);else if("rings"in e)i(e,e.rings,r);else if("paths"in e)i(e,e.paths,r);else if("points"in e&&(null==e.hasM||e.hasZ))for(const t of e.points)t.length>2&&(t[2]*=r)}e.unapplyEditsZUnitScaling=s,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
