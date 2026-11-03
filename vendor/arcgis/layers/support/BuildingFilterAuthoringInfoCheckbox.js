/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/Collection","../../core/lang","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/accessorSupport/decorators/subclass","./BuildingFilterAuthoringInfo","./BuildingFilterAuthoringInfoBlock"],(function(e,o,r,t,c,s,i,l,n){"use strict";var p;const u=o.ofType(n);let a=p=class extends l{constructor(){super(...arguments),this.type="checkbox"}clone(){return new p({filterBlocks:r.clone(this.filterBlocks)})}};e.__decorate([t.property({type:["checkbox"]})],a.prototype,"type",void 0),e.__decorate([t.property({type:u,json:{write:!0}})],a.prototype,"filterBlocks",void 0),a=p=e.__decorate([i.subclass("esri.layers.support.BuildingFilterAuthoringInfoCheckbox")],a);return a}));
