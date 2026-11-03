/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass","./FeatureReduction"],(function(e,r,t,o,s,c,u){"use strict";var n;let a=n=class extends u.FeatureReduction{constructor(e){super(e),this.type="selection"}clone(){return new n}};e.__decorate([r.property({type:["selection"]})],a.prototype,"type",void 0),a=n=e.__decorate([c.subclass("esri.layers.support.FeatureReductionSelection")],a);return a}));
