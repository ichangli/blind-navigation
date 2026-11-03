/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/Clonable","../../core/JSONSupport","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass"],(function(e,o,r,t,s,p,c,i){"use strict";let a=class extends(o.ClonableMixin(r.JSONSupport)){constructor(){super(...arguments),this.opacity=1,this.position=0}};e.__decorate([t.property({type:Number,json:{name:"alpha",write:{enabled:!0,isRequired:!0}}})],a.prototype,"opacity",void 0),e.__decorate([t.property({type:Number,json:{write:{enabled:!0,isRequired:!0}}})],a.prototype,"position",void 0),a=e.__decorate([i.subclass("esri.layers.voxel.VoxelOpacityStop")],a);return a}));
