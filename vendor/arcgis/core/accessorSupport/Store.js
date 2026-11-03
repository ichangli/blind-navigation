/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../lang","./PropertyOrigin"],(function(e,t,s){"use strict";class r{constructor(){this._values=new Map,this.multipleOriginsSupported=!1}clone(e){const s=new r;return this._values.forEach(((r,i)=>{e&&e.has(i)||s.set(i,t.clone(r))})),s}get(e){return this._values.get(e)}originOf(){return s.OriginId.USER}keys(){return[...this._values.keys()]}set(e,t){this._values.set(e,t)}delete(e){this._values.delete(e)}has(e){return this._values.has(e)}forEach(e){this._values.forEach(e)}}e.Store=r,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
