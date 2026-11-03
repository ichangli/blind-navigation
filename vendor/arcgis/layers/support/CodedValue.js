/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../chunks/tslib.es6","../../core/JSONSupport","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass"],(function(e,o,r,t,s,c,d,a){"use strict";var p;e.CodedValue=p=class extends r.JSONSupport{constructor(e){super(e),this.name=null,this.code=null}clone(){return new p({name:this.name,code:this.code})}},o.__decorate([t.property({type:String,json:{write:!0}})],e.CodedValue.prototype,"name",void 0),o.__decorate([t.property({type:[String,Number],json:{write:!0}})],e.CodedValue.prototype,"code",void 0),e.CodedValue=p=o.__decorate([a.subclass("esri.layers.support.CodedValue")],e.CodedValue),Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
