/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../chunks/vec32","../SnappingDomain","./SnappingHint"],(function(n,t,i,e){"use strict";class o extends e.SnappingHint{constructor(n,t,e=i.SnappingDomain.ALL){super(t,e),this.intersectionPoint=n}equals(n){return n instanceof o&&t.exactEquals(this.intersectionPoint,n.intersectionPoint)}}n.IntersectionSnappingHint=o,Object.defineProperty(n,Symbol.toStringTag,{value:"Module"})}));
