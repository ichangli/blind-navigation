/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/lang","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/accessorSupport/decorators/enumeration","../../core/accessorSupport/decorators/subclass","./BuildingFilterMode","../../symbols/edges/utils"],(function(e,r,o,s,t,c,i,a,d){"use strict";var p;let n=p=class extends a{constructor(){super(...arguments),this.type="wire-frame",this.edges=null}clone(){return new p({edges:r.clone(this.edges)})}};e.__decorate([c.enumeration({wireFrame:"wire-frame"})],n.prototype,"type",void 0),e.__decorate([o.property(d.symbol3dEdgesProperty)],n.prototype,"edges",void 0),n=p=e.__decorate([i.subclass("esri.layers.support.BuildingFilterModeWireFrame")],n);return n}));
