/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(e){"use strict";class t{constructor(){this._store=new Map,this._byteSize=0}set(e,t){this.delete(e),this._store.set(e,t),this._byteSize+=t.byteSize}delete(e){const t=this._store.get(e);return!!this._store.delete(e)&&(null!=t&&(this._byteSize-=t.byteSize),!0)}get(e){return this._used(e),this._store.get(e)}has(e){return this._used(e),this._store.has(e)}clear(){this._store.clear()}applyByteSizeLimit(e,t){for(const[s,i]of this._store){if(this._byteSize<=e)break;this.delete(s),t(i)}}values(){return this._store.values()}[Symbol.iterator](){return this._store[Symbol.iterator]()}_used(e){const t=this._store.get(e);t&&(this._store.delete(e),this._store.set(e,t))}}e.FeatureServiceTileCache=t,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
