/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../chunks/tslib.es6","../core/Accessor","../core/accessorSupport/decorators/property","../core/has","../core/Logger","../core/RandomLCG","../core/accessorSupport/decorators/subclass"],(function(r,e,o,t,s,c,a){"use strict";let p=class extends e{constructor(r){super(r),this.nextQueryParams=null,this.queryParams=null,this.results=null,this.total=null}};r.__decorate([o.property()],p.prototype,"nextQueryParams",void 0),r.__decorate([o.property()],p.prototype,"queryParams",void 0),r.__decorate([o.property()],p.prototype,"results",void 0),r.__decorate([o.property()],p.prototype,"total",void 0),p=r.__decorate([a.subclass("esri.portal.PortalQueryResult")],p);return p}));
