/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(t){"use strict";class e{constructor(t){this._data=t,this._offset4=0,this._dataUint32=new Uint32Array(this._data,0,Math.floor(this._data.byteLength/4))}readUint32(){const t=this._offset4;return this._offset4+=1,this._dataUint32[t]}readUint8Array(t){const e=4*this._offset4;return this._offset4+=t/4,new Uint8Array(this._data,e,t)}remainingBytes(){return this._data.byteLength-4*this._offset4}}t.BinaryStreamReader=e,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
