/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(t){"use strict";class e{constructor(t){this._store=t}destroy(){this._store.destroy()}get(t){return this._store.get(t)}put(t,e){this._store.put(t,e,e.values.byteLength+256)}}t.ElevationQueryTileCache=e,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
