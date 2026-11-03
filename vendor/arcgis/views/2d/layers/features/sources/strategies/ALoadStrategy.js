/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(r){"use strict";class t{constructor(r){this._store=r,this._controller=new AbortController}destroy(){this._controller.abort()}get _options(){return{signal:this._controller.signal}}unsafeSetQueryHistoricMoment(r){throw new Error("InternalError: LoadStrategy does not support query info")}async queryOverride(r){throw new Error("InternalError: LoadStrategy does not support fetching")}async queryByObjectId(r){throw new Error("InternalError: LoadStrategy does not support fetching")}}r.ALoadStrategy=t,Object.defineProperty(r,Symbol.toStringTag,{value:"Module"})}));
