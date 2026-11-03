/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["./ImmutableArray","./ImmutablePointArray"],(function(t,s){"use strict";class h extends t{constructor(t,s,h,e,i){super(t),this._lazyPath=[],this._hasZ=!1,this._hasM=!1,this._hasZ=h,this._hasM=e,this._spRef=s,this._cacheId=i}get(t){if(void 0===this._lazyPath[t]){const h=this._elements[t];if(void 0===h)return;this._lazyPath[t]=new s(h,this._spRef,this._hasZ,this._hasM,this._cacheId,t)}return this._lazyPath[t]}equalityTest(t){return t===this||null!==t&&(t instanceof h!=!1&&t.getUniqueHash()===this.getUniqueHash())}getUniqueHash(){return this._cacheId.toString()}}return h}));
