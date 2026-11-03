/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../layers/graphics/dehydratedFeatureUtils"],(function(e,t){"use strict";class r{constructor(e,t=null,r=0){this.array=e,this.spatialReference=t,this.offset=r}}function a(e){return"array"in e}function i(e,r,i="ground"){if(t.isDehydratedPoint(r))return e.getElevation(r.x,r.y,r.z||0,r.spatialReference,i);if(a(r)){let t=r.offset;return e.getElevation(r.array[t++],r.array[t++],r.array[t]||0,r.spatialReference??e.spatialReference,i)}return e.getElevation(r[0],r[1],r[2]||0,e.spatialReference,i)}e.SamplePosition=r,e.getElevationAtPoint=i,e.isSamplePosition=a,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
