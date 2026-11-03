/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(t){"use strict";class e{constructor(t,e,i){this._scale=t,this._shift=e,this._levelShift=i}getLevelRowColumn(t){const e=this.getLevelShift(t[0]),i=this._shift+e;return i?[t[0]-e,t[1]>>i,t[2]>>i]:t}getLevelShift(t){return Math.min(t,this._levelShift)}getOffset(t,e){let i=0,s=0;const h=this._shift+this.getLevelShift(t[0]);if(h){const l=(1<<h)-1,f=e/(this._scale*(1<<h-1));i=(t[2]&l)*f,s=(t[1]&l)*f}return[i,s]}getScale(t){return this._scale*(1<<this._shift+this.getLevelShift(t))}}t.SchemaHelper=e,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
