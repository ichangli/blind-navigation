/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../../core/maybe","../../../../../core/promiseUtils"],(function(e,t,s){"use strict";class i{constructor(e,i){this._textures=e,this.loadPromise=null,this._disposed=!1;const r=this._textures.acquire(i);s.isPromiseLike(r)?(r.then((e=>{this._disposed?t.releaseMaybe(e):this._textureRef=e})),this.loadPromise=r):this._textureRef=r}dispose(){this._textureRef=t.releaseMaybe(this._textureRef),this._disposed=!0}get glTexture(){return null!=this._textureRef?this._textureRef.glTexture:null}}e.RenderTexture=i,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
