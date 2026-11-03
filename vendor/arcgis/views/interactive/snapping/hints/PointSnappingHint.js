/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../chunks/vec32","./SnappingHint"],(function(n,t,e){"use strict";class i extends e.SnappingHint{constructor(n,t,e){super(t,e),this.point=n}equals(n){return n instanceof i&&t.exactEquals(this.point,n.point)}}n.PointSnappingHint=i,Object.defineProperty(n,Symbol.toStringTag,{value:"Module"})}));
