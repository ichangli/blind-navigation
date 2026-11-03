/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../../chunks/tslib.es6","../../../core/lang","../../../core/accessorSupport/decorators/property","../../../core/has","../../../core/Logger","../../../core/accessorSupport/decorators/subclass","../../../core/accessorSupport/decorators/writer","./BaseFunctionArguments"],(function(r,e,s,t,o,c,a,n){"use strict";var p;let u=p=class extends n{constructor(){super(...arguments),this.rasters=[]}writeRasters(r,e){e.rasters=r.map((r=>"number"==typeof r||"string"==typeof r?r:r.toJSON()))}clone(){return new p({rasters:e.clone(this.rasters)})}};r.__decorate([s.property({json:{write:!0}})],u.prototype,"rasters",void 0),r.__decorate([a.writer("rasters")],u.prototype,"writeRasters",null),u=p=r.__decorate([c.subclass("esri.layers.support.rasterFunctions.CompositeBandFunctionArguments")],u);return u}));
