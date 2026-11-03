/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../core/has","../../core/NestedMap","./Program"],(function(e,t,r,s){"use strict";class o{constructor(e){this._rctx=e,this._store=new r.NestedMap}dispose(){this._store.forEach((e=>e.forEach((e=>e.dispose())))),this._store.clear()}acquire(e,t,r,o){const c=this._store.get(e,t);if(null!=c)return c.ref(),c;const i=new s.Program(this._rctx,e,t,r,o);return i.ref(),this._store.set(e,t,i),i}get test(){}}e.ProgramCache=o,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
