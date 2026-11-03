/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/JSONSupport","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass"],(function(r,e,t,o,s,c,p){"use strict";let a=class extends e.JSONSupport{constructor(r){super(r),this.format=null,this.itemId=null,this.url=null}};r.__decorate([t.property()],a.prototype,"format",void 0),r.__decorate([t.property({json:{read:{source:"itemID"},write:{target:"itemID"}}})],a.prototype,"itemId",void 0),r.__decorate([t.property()],a.prototype,"url",void 0),a=r.__decorate([p.subclass("esri.rest.support.RasterData")],a);return a}));
