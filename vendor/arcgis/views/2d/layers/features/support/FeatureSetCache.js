/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./StaticBitSet"],(function(t,e){"use strict";class a{constructor(t){this._valid=e.StaticBitSet.create(t),this._data=new Array(t)}has(t){return this._valid.has(t)}set(t,e){this._valid.set(t),this._data[t]=e}get(t){return this._data[t]}}t.FeatureSetCache=a,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
