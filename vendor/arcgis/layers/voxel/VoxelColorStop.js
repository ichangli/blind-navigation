/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../Color","../../core/Clonable","../../core/JSONSupport","../../core/accessorSupport/decorators/property","../../core/accessorSupport/ensureType","../../core/RandomLCG","../../core/has","../../core/accessorSupport/decorators/subclass"],(function(e,o,r,t,s,c,p,i,l){"use strict";let n=class extends(r.ClonableMixin(t.JSONSupport)){constructor(){super(...arguments),this.color=null,this.position=0}};e.__decorate([s.property({type:o,json:{type:[c.Integer],write:{enabled:!0,isRequired:!0}}})],n.prototype,"color",void 0),e.__decorate([s.property({type:Number,json:{write:{enabled:!0,isRequired:!0}}})],n.prototype,"position",void 0),n=e.__decorate([l.subclass("esri.layers.voxel.VoxelColorStop")],n);return n}));
