/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./MemCache"],(function(t,e){"use strict";class s{constructor(t,s){this._storage=new e.MemCacheStorage,this.id="",this.name="",this.size=0,this._storage.maxSize=t,this._storage.register(this),s&&this._storage.registerRemoveFunc("",s)}destroy(){this._storage.deregister(this),this._storage.destroy()}put(t,e,s=1){this._storage.put(this,t,e,s,1)}pop(t){return this._storage.pop(this,t)}get(t){return this._storage.get(this,t)}clear(){this._storage.clearAll()}get maxSize(){return this._storage.maxSize}set maxSize(t){this._storage.maxSize=t}resetHitRate(){}}t.LRUCache=s,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
