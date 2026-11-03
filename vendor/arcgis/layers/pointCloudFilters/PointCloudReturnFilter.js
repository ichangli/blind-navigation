/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/lang","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/accessorSupport/decorators/enumeration","../../core/accessorSupport/decorators/subclass","./PointCloudFilter"],(function(e,r,t,o,s,n,c,i){"use strict";var u;let l=u=class extends i{constructor(e){super(e),this.includedReturns=[],this.type="return"}clone(){return new u({field:this.field,includedReturns:r.clone(this.includedReturns)})}};e.__decorate([t.property({type:[["firstOfMany","last","lastOfMany","single"]],json:{write:{enabled:!0,isRequired:!0}}})],l.prototype,"includedReturns",void 0),e.__decorate([n.enumeration({pointCloudReturnFilter:"return"})],l.prototype,"type",void 0),l=u=e.__decorate([c.subclass("esri.layers.pointCloudFilters.PointCloudReturnFilter")],l);return l}));
