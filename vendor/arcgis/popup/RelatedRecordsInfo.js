/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../chunks/tslib.es6","../core/JSONSupport","../core/lang","../core/accessorSupport/decorators/property","../core/has","../core/Logger","../core/accessorSupport/decorators/subclass","./support/RelatedRecordsInfoFieldOrder"],(function(e,r,o,s,t,d,c,l){"use strict";var p;let a=p=class extends r.JSONSupport{constructor(e){super(e),this.showRelatedRecords=null,this.orderByFields=null}clone(){return new p({showRelatedRecords:this.showRelatedRecords,orderByFields:this.orderByFields?o.clone(this.orderByFields):null})}};e.__decorate([s.property({type:Boolean,json:{write:!0}})],a.prototype,"showRelatedRecords",void 0),e.__decorate([s.property({type:[l],json:{write:!0}})],a.prototype,"orderByFields",void 0),a=p=e.__decorate([c.subclass("esri.popup.RelatedRecordsInfo")],a);return a}));
