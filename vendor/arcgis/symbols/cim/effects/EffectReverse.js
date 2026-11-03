/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(e){"use strict";class t{static local(){return null===t.instance&&(t.instance=new t),t.instance}execute(e,t,r,s,i){return new n(e,t,r)}}t.instance=null;class n{constructor(e,t,n){this._inputGeometries=e,this._reverse=void 0===t.reverse||t.reverse}next(){let e=this._inputGeometries.next();for(;e;){if(!this._reverse)return e;if("esriGeometryPolyline"===e.geometryType)return r(e.clone());e=this._inputGeometries.next()}return null}}function r(e){for(;e.nextPath();)for(let t=0;t<e.pathSize/2;t++){e.seekInPath(t);const n=e.x,r=e.y;e.seekInPath(e.pathSize-t-1);const s=e.x,i=e.y;e.x=n,e.y=r,e.seekInPath(t),e.x=s,e.y=i}return e.reset(),e}e.EffectReverse=t,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
