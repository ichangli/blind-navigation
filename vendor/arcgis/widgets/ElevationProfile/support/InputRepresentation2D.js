/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../core/asyncUtils","../../../core/maybe","../../../core/promiseUtils","../../../views/support/layerViewUtils"],(function(t,e,i,h,s){"use strict";class l{constructor(t){this._params=t,this._highlightTask=null,this._highlightHandle=null}destroy(){this.remove()}remove(){this._highlightTask=i.abortMaybe(this._highlightTask),this._highlightHandle=i.removeMaybe(this._highlightHandle)}update(t){if(this.remove(),null==t||!r(t))return;const i=t.layer;this._highlightTask=e.createTask((async e=>{const l=await this._params.view.whenLayerView(i);h.throwIfAborted(e);const r=s.highlightsSupported(l)?l:null;r&&(this._highlightHandle=r.highlight(t))}))}}function r(t){return null!=t.geometry&&"polyline"===t.geometry.type}t.InputRepresentation2D=l,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
