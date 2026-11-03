/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/JSONSupport","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass"],(function(e,r,o,t,s,c,a){"use strict";let p=class extends r.JSONSupport{constructor(){super(...arguments),this.diffuseFactor=.5,this.specularFactor=.5}};e.__decorate([o.property({type:Number,range:{min:0,max:1},json:{default:.5,write:!0}})],p.prototype,"diffuseFactor",void 0),e.__decorate([o.property({type:Number,range:{min:0,max:1},json:{default:.5,write:!0}})],p.prototype,"specularFactor",void 0),p=e.__decorate([a.subclass("esri.layers.voxel.VoxelSimpleShading")],p);return p}));
