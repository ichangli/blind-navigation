/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./MemoryBuffer"],(function(e,r){"use strict";class s extends r{constructor(){super(12)}add(e,r,s){const t=this.array;t.push(e),t.push(r),t.push(s)}}class t extends r{constructor(){super(4)}add(e){this.array.push(e)}}e.PointElementMemoryBuffer=t,e.TriangleIndexBuffer=s,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
