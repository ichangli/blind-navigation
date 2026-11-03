/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/JSONSupport","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass"],(function(r,e,t,o,s,c,p){"use strict";let i=class extends e.JSONSupport{constructor(r){super(r),this.itemId=null,this.url=null}};r.__decorate([t.property({type:String,json:{read:{source:"itemID"},write:{target:"itemID"}}})],i.prototype,"itemId",void 0),r.__decorate([t.property({type:String,json:{write:!0}})],i.prototype,"url",void 0),i=r.__decorate([p.subclass("esri.rest.support.DataFile")],i);return i}));
