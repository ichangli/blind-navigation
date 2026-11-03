/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../chunks/tslib.es6","./Accessor","./accessorSupport/decorators/property","./accessorSupport/decorators/subclass"],(function(e,s,t,c,n){"use strict";e.AsyncSequence=class extends t{constructor(){super(...arguments),this.updating=!1,this._pending=[]}push(e,s){this._pending.push({promise:e,callback:s}),1===this._pending.length&&this._process()}_process(){if(!this._pending.length)return void(this.updating=!1);this.updating=!0;const e=this._pending[0];e.promise.then((s=>e.callback(s))).catch((()=>{})).then((()=>{this._pending.shift(),this._process()}))}},s.__decorate([c.property()],e.AsyncSequence.prototype,"updating",void 0),e.AsyncSequence=s.__decorate([n.subclass("esri.core.AsyncSequence")],e.AsyncSequence),Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
