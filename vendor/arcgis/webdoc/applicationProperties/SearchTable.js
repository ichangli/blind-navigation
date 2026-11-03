/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/JSONSupport","../../core/lang","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/accessorSupport/decorators/subclass","./SearchTableField"],(function(e,r,o,t,s,i,c,p){"use strict";var d;let l=d=class extends r.JSONSupport{constructor(e){super(e),this.field=null,this.id=null}clone(){return new d(o.clone({field:this.field,id:this.id}))}};e.__decorate([t.property({type:p,json:{write:{isRequired:!0}}})],l.prototype,"field",void 0),e.__decorate([t.property({type:String,json:{write:{isRequired:!0}}})],l.prototype,"id",void 0),l=d=e.__decorate([c.subclass("esri.webdoc.applicationProperties.SearchTable")],l);return l}));
