/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(t){"use strict";class e{static local(){return null===e.instance&&(e.instance=new e),e.instance}execute(t,e,s,o,i){return new n(t,e,s)}}e.instance=null;class n{constructor(t,e,n){this._inputGeometries=t,this._offsetX=void 0!==e.offsetX?e.offsetX*n:0,this._offsetY=void 0!==e.offsetY?e.offsetY*n:0}next(){let t=this._inputGeometries.next();for(;t;){if(t.totalSize>0)return this._move(t.clone(),this._offsetX,this._offsetY);t=this._inputGeometries.next()}return null}_move(t,e,n){for(;t.nextPath();)for(;t.nextPoint();)t.x=t.x+e,t.y=t.y+n;return t.reset(),t}}t.EffectMove=e,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
