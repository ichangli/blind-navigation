/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../core/has","../../../../core/Logger","../../../../chunks/vec32","../SnappingDomain","./SnappingHint"],(function(t,e,n,i,a,s){"use strict";class r extends s.SnappingHint{constructor(t,e,n,i,s=a.SnappingDomain.ALL,r=!0,h=!0){super(i,s),this.type=t,this.lineStart=e,this.lineEnd=n,this.fadeLeft=r,this.fadeRight=h}equals(t){return t instanceof r&&(this.type===t.type&&i.exactEquals(this.lineStart,t.lineStart)&&i.exactEquals(this.lineEnd,t.lineEnd)&&this.fadeLeft===t.fadeLeft&&this.fadeRight===t.fadeRight)}get length(){return i.distance(this.lineStart,this.lineEnd)}}t.LineSnappingHint=r,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
