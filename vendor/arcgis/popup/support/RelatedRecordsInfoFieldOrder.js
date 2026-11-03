/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/JSONSupport","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass"],(function(e,r,o,t,s,c,p){"use strict";var d;let i=d=class extends r.JSONSupport{constructor(e){super(e),this.field=null,this.order=null}clone(){return new d({field:this.field,order:this.order})}};e.__decorate([o.property({type:String,json:{write:!0}})],i.prototype,"field",void 0),e.__decorate([o.property({type:["asc","desc"],json:{write:!0}})],i.prototype,"order",void 0),i=d=e.__decorate([p.subclass("esri.popup.support.RelatedRecordsInfoFieldOrder")],i);return i}));
