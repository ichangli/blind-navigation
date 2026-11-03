/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../../core/has"],(function(e,t){"use strict";function n(e,n){const i=e.extent,o=n?.clone().intersection(i),r=null!=o?o.width*o.height:0,s=n?n.width*n.height:0,a=0===s?0:r/s,c=t("featurelayer-snapshot-point-coverage");return!isNaN(a)&&a>=c}e.exceedsMinimumSnapshotCoverage=n,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
