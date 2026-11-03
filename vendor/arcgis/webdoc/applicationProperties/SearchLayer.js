/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/JSONSupport","../../core/lang","../../core/accessorSupport/decorators/property","../../core/accessorSupport/ensureType","../../core/accessorSupport/decorators/subclass","./SearchLayerField"],(function(e,r,t,o,s,i,p){"use strict";var c;let a=c=class extends r.JSONSupport{constructor(e){super(e),this.field=null,this.id=null,this.subLayer=null}clone(){return new c(t.clone({field:this.field,id:this.id,subLayer:this.subLayer}))}};e.__decorate([o.property({type:p,json:{write:{isRequired:!0}}})],a.prototype,"field",void 0),e.__decorate([o.property({type:String,json:{write:{isRequired:!0}}})],a.prototype,"id",void 0),e.__decorate([o.property({type:s.Integer,json:{write:!0}})],a.prototype,"subLayer",void 0),a=c=e.__decorate([i.subclass("esri.webdoc.applicationProperties.SearchLayer")],a);return a}));
