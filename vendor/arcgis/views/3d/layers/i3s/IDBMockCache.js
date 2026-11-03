/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(t){"use strict";const e=new WeakMap;class s{constructor(t,s){switch(this._miss=0,this._hit=0,this.initialized=!0,s){case"layer":this._data=new Map;break;case"view":{const s=e.get(t);if(s){this._data=s;break}const i=new Map;this._data=i,e.set(t,i)}}}init(){return Promise.resolve()}async get(t,e){if(this._data.has(t))return this._hit++,this._data.get(t)??void 0;this._miss++}destroy(){}put(t,e){return this._data.set(t,e),Promise.resolve()}remove(t){return this._data.delete(t),Promise.resolve()}getHitRate(){return this._hit/(this._hit+this._miss)}}t.IDBMockCache=s,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
