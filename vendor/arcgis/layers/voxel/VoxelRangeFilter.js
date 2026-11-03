/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/Clonable","../../core/JSONSupport","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass"],(function(e,r,o,t,s,c,a,p){"use strict";let n=class extends(r.ClonableMixin(o.JSONSupport)){constructor(){super(...arguments),this.enabled=!1,this.range=null}};e.__decorate([t.property({type:Boolean,json:{default:!1,write:!0}})],n.prototype,"enabled",void 0),e.__decorate([t.property({type:[Number],json:{write:!0}})],n.prototype,"range",void 0),n=e.__decorate([p.subclass("esri.layers.voxel.VoxelRangeFilter")],n);return n}));
