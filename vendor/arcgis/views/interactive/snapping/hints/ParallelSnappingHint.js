/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../core/has","../../../../core/Logger","../../../../chunks/vec32","../SnappingDomain","./SnappingHint"],(function(n,e,t,i,a,s){"use strict";class r extends s.SnappingHint{constructor(n,e,t,i=a.SnappingDomain.ALL){super(t,i),this.lineStart=n,this.lineEnd=e}equals(n){return n instanceof r&&(i.exactEquals(this.lineStart,n.lineStart)&&i.exactEquals(this.lineEnd,n.lineEnd))}}n.ParallelSnappingHint=r,Object.defineProperty(n,Symbol.toStringTag,{value:"Module"})}));
