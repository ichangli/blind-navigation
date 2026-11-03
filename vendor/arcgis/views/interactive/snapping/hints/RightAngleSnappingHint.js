/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../core/has","../../../../core/Logger","../../../../chunks/vec32","../SnappingDomain","./SnappingHint"],(function(e,t,n,r,i,s){"use strict";class a extends s.SnappingHint{constructor(e,t,n,r,s=i.SnappingDomain.ALL){super(r,s),this.previousVertex=e,this.centerVertex=t,this.nextVertex=n}equals(e){return e instanceof a&&(r.exactEquals(this.previousVertex,e.previousVertex)&&r.exactEquals(this.centerVertex,e.centerVertex)&&r.exactEquals(this.nextVertex,e.nextVertex))}}e.RightAngleSnappingHint=a,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
