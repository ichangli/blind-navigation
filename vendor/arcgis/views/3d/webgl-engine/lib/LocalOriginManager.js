/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../core/libs/gl-matrix-2/math/mat4","../../../../core/libs/gl-matrix-2/factories/mat4f64","./localOriginHelper"],(function(i,t,r,e){"use strict";class a{constructor(i){this._factory=i,this._originData=new Map}acquire(i){return this.register(this._factory.getOrigin(i))}register(i){const t=this._originData.get(i.id)||new o(i);return t.refCount++,this._originData.has(t.origin.id)||this._originData.set(t.origin.id,t),t}release(i){i&&(i.refCount--,0===i.refCount&&this._originData.delete(i.origin.id))}updateViewMatrices(i){this._originData.forEach((r=>{t.copy(r.viewMatrix,i),e.applyToViewMatrix(r.origin.vec3,r.viewMatrix)}))}}class o{constructor(i){this.origin=i,this.refCount=0,this.viewMatrix=r.create()}}i.LocalOriginManager=a,i.OriginData=o,Object.defineProperty(i,Symbol.toStringTag,{value:"Module"})}));
