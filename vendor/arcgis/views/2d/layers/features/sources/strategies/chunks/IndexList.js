/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(e){"use strict";class t{constructor(){this._counter=1,this._freeList=[]}create(){return this._freeList.length?this._freeList.pop():++this._counter}release(e){this._freeList.push(e)}}e.IndexList=t,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
