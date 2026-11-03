/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass"],(function(e,r,t,o,s,p){"use strict";return t=>{let o=class extends t{constructor(...e){super(...e)}get updateSuspended(){const e=this.parent?.dynamicGroupLayerView;return this.suspended&&(!e||!0===e.suspended)}};return e.__decorate([r.property()],o.prototype,"layer",void 0),e.__decorate([r.property()],o.prototype,"parent",void 0),e.__decorate([r.property()],o.prototype,"updateSuspended",null),o=e.__decorate([p.subclass("esri.views.layers.CatalogFootprintLayerView")],o),o}}));
