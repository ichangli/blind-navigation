/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass"],(function(e,r,s,o,a,t){"use strict";return s=>{let o=class extends s{get availableFields(){return this.layer.fieldsIndex.fields.map((e=>e.name))}};return e.__decorate([r.property()],o.prototype,"layer",void 0),e.__decorate([r.property({readOnly:!0})],o.prototype,"availableFields",null),o=e.__decorate([t.subclass("esri.views.layers.OGCFeatureLayerView")],o),o}}));
