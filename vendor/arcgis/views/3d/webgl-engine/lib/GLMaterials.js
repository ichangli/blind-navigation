/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./basicInterfaces"],(function(e,t){"use strict";class s{constructor(e,t){this._material=e,this._repository=t,this._map=new Map}dispose(){this._map.forEach(((e,t)=>{null!=e&&this._repository.release(this._material,t)}))}load(e,s,r){const i=this._material.produces.get(s);if(!i?.(r))return null;this._map.has(r)||this._map.set(r,this._repository.acquire(this._material,s,r));const a=this._map.get(r);if(null!=a){if(a.ensureResources(e)===t.ResourceState.LOADED)return a;this._repository.requestRender()}return null}}e.GLMaterials=s,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
