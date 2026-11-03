/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(e){"use strict";class t{constructor(e,t){this._worldSpaceRadius=e,this._minScreenSpaceRadii=t}selectLevel(e,t,i){const c=i.computeScreenPixelSizeAt(e),r=this._worldSpaceRadius*t/c;let n=0;for(let s=1;s<this._minScreenSpaceRadii.length;++s)r>=this._minScreenSpaceRadii[s]&&(n=s);return n}}e.LevelSelector=t,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
