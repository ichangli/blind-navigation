/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../chunks/tslib.es6","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass"],(function(e,r,t,i,s,o,a){"use strict";function c(e){return"portalItem"in e}const p=e=>{let i=class extends e{get apiKey(){return this._isOverridden("apiKey")?this._get("apiKey"):c(this)?this.portalItem?.apiKey:null}set apiKey(e){null!=e?this._override("apiKey",e):(this._clearOverride("apiKey"),this.clear("apiKey","user"))}};return r.__decorate([t.property({type:String})],i.prototype,"apiKey",null),i=r.__decorate([a.subclass("esri.layers.mixins.APIKeyMixin")],i),i};e.APIKeyMixin=p,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
