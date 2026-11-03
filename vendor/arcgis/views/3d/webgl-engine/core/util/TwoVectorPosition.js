/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../../chunks/vec32","../../../../../core/libs/gl-matrix-2/factories/vec3f32","../../../../../core/libs/gl-matrix-2/factories/vec3f64"],(function(t,e,i,o){"use strict";class s{constructor(t){this._low=o.create(),this._high=o.create(),t&&this.set(t)}get low(){return this._low}get high(){return this._high}set(t){e.copy(this._low,e.copy(c,t));const i=e.sub(c,t,this._low);e.copy(this._high,i)}get(t){return e.add(t,this._low,this._high)}getLowScaled(t){return e.scale(t,this._low,1)}}const c=i.create();t.TwoVectorPosition=s,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
