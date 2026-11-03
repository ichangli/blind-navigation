/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./lang","./accessorSupport/tracking","./accessorSupport/tracking/SimpleObservable"],(function(e,t,s,a){"use strict";class i{constructor(e,t){this._observable=new a.SimpleObservable,this._value=e,this._equalityFunction=t}get value(){return s.trackAccess(this._observable),this._value}set value(e){this._equalityFunction(e,this._value)||(this._value=e,this._observable.notify())}mutate(e){e(this._value),this._observable.notify()}}function l(e,s=t.equalsShallow){return new i(e,s)}e.signal=l,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
