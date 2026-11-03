/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../chunks/tslib.es6","./accessorSupport/decorators/subclass"],(function(e,t,i){"use strict";let s=0;const r=e=>{let r=class extends e{constructor(...e){super(...e),Object.defineProperty(this,"uid",{writable:!1,configurable:!1,value:Date.now().toString(16)+"-object-"+s++})}};return r=t.__decorate([i.subclass("esri.core.Identifiable")],r),r},c=e=>{let r=class extends e{constructor(...e){super(...e),Object.defineProperty(this,"uid",{writable:!1,configurable:!1,value:s++})}};return r=t.__decorate([i.subclass("esri.core.Identifiable.NumericIdentifiable")],r),r};e.Identifiable=class extends(r(class{})){},e.Identifiable=t.__decorate([i.subclass("esri.core.Identifiable")],e.Identifiable),e.IdentifiableMixin=r,e.NumericIdentifiableMixin=c,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
