/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../../../request","../../../../core/promiseUtils","../../tiling/TileKey"],(function(e,t,l){"use strict";class r{constructor(e){this.url=e}destroy(){this._tileIndexPromise=null}async fetchTileIndex(){return this._tileIndexPromise||(this._tileIndexPromise=e(this.url).then((e=>e.data.index))),this._tileIndexPromise}async dataKey(e,l){const r=await this.fetchTileIndex();return t.throwIfAborted(l),this._getIndexedDataKey(r,e)}_getIndexedDataKey(e,t){const r=[t];if(t.level<0||t.row<0||t.col<0||t.row>>t.level>0||t.col>>t.level>0)return null;let i=t;for(;0!==i.level;)i=new l(i.level-1,i.row>>1,i.col>>1,i.world),r.push(i);let n,o,s=e,d=r.pop();if(1===s)return d;for(;r.length;)if(n=r.pop(),o=(1&n.col)+((1&n.row)<<1),s){if(0===s[o]){d=null;break}if(1===s[o]){d=n;break}d=n,s=s[o]}return d}}return r}));
