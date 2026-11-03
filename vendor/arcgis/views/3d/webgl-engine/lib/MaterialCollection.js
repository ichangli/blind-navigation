/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(t){"use strict";class e{constructor(t){this._stage=t,this._materials=new Map}get(t){return this._materials.get(t)}add(t,e){this._materials.set(t,e),this._stage.add(e)}dispose(){this._stage.removeMany(Array.from(this._materials.values())),this._materials.clear()}}t.MaterialCollection=e,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
