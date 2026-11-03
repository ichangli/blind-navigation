/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../LRUCache","./WhereClause"],(function(e,t,c){"use strict";class r{constructor(e,c){this._cache=new t.LRUCache(e),this._invalidCache=new t.LRUCache(c)}get(e,t){const r=`${t.uid}:${e}`,i=this._cache.get(r);if(i)return i;if(null!=this._invalidCache.get(r))return null;try{const i=c.WhereClause.create(e,t);return this._cache.put(r,i),i}catch(n){return this._invalidCache.put(r,n),null}}getError(e,t){const c=`${t.uid}:${e}`;return this._invalidCache.get(c)??null}}e.WhereClauseCache=r,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
