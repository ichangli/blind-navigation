/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass","./BuildingFilterMode"],(function(e,r,o,s,t,c,a){"use strict";var p;let n=p=class extends a{constructor(){super(...arguments),this.type="x-ray"}clone(){return new p}};e.__decorate([r.property({type:["x-ray"],readOnly:!0,json:{write:!0}})],n.prototype,"type",void 0),n=p=e.__decorate([c.subclass("esri.layers.support.BuildingFilterModeXRay")],n);return n}));
