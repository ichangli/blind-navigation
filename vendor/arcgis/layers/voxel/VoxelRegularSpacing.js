/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/JSONSupport","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass"],(function(e,r,o,s,t,c,p){"use strict";let a=class extends r.JSONSupport{constructor(){super(...arguments),this.scale=1,this.offset=0}};e.__decorate([o.property({type:Number,json:{write:!0}})],a.prototype,"scale",void 0),e.__decorate([o.property({type:Number,json:{write:!0}})],a.prototype,"offset",void 0),a=e.__decorate([p.subclass("esri.layers.voxel.VoxelRegularSpacing")],a);return a}));
