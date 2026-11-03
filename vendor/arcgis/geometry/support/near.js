/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../geometry","../../core/libs/gl-matrix-2/math/vec2","./coordsUtils","../Point"],(function(e,t,n,i,o){"use strict";function r(e,t){const{spatialReference:r}=t,a=[t.x,t.y];let c=Number.POSITIVE_INFINITY,s=0,m=0;const x=[0,0],l="extent"===e.type?[[[e.xmin,e.ymin],[e.xmin,e.ymax],[e.xmax,e.ymax],[e.xmax,e.ymin],[e.xmin,e.ymin]]]:e.rings;for(const o of l)for(let e=0;e<o.length-1;e++){i.projectPointOnLine(x,a,o,e);const t=n.distance(a,x);t<c&&(c=t,s=x[0],m=x[1])}return{coordinate:new o({x:s,y:m,spatialReference:r}),distance:c}}e.nearestCoordinate=r,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
