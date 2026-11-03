/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../../../request","../../../../core/maybe","../../../../core/promiseUtils","../../tiling/TileKey"],(function(e,t,i,r){"use strict";class l{constructor(e,t){this._tilemap=e,this._tileIndexUrl=t}destroy(){this._tilemap=t.destroyMaybe(this._tilemap),this._tileIndexPromise=null}async fetchTileIndex(t){return this._tileIndexPromise||(this._tileIndexPromise=e(this._tileIndexUrl,{query:{...t?.query}}).then((e=>e.data.index))),this._tileIndexPromise}dataKey(e,t){const{level:l,row:s,col:n}=e,o=new r(e);return this._tilemap.fetchAvailabilityUpsample(l,s,n,o,t).then((()=>(o.world=e.world,o))).catch((e=>{if(i.isAbortError(e))throw e;return null}))}}return l}));
