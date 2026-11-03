/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["./ObjectPool"],(function(e){"use strict";function r(e){e.length=0}class t{constructor(t=50,n=50){this._pool=new e(Array,void 0,r,n,t)}acquire(){return this._pool.acquire()}release(e){this._pool.release(e)}prune(){this._pool.prune(0)}static acquire(){return n.acquire()}static release(e){return n.release(e)}static prune(){n.prune()}}const n=new t(100);return t}));
