/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../../chunks/tslib.es6","../../../core/JSONSupport","../../../core/accessorSupport/decorators/property","../../../core/has","../../../core/Logger","../../../core/RandomLCG","../../../core/accessorSupport/decorators/subclass"],(function(r,e,o,s,t,a,c){"use strict";let p=class extends e.JSONSupport{get affectsPixelSize(){return!1}forwardTransform(r){return r}inverseTransform(r){return r}};r.__decorate([o.property()],p.prototype,"affectsPixelSize",null),r.__decorate([o.property({json:{write:!0}})],p.prototype,"spatialReference",void 0),p=r.__decorate([c.subclass("esri.layers.support.rasterTransforms.BaseRasterTransform")],p);return p}));
