/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/Clonable","../../core/JSONSupport","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass"],(function(e,o,r,t,s,p,c,a){"use strict";let n=class extends(o.ClonableMixin(r.JSONSupport)){constructor(e){super(e),this.offset=[0,0],this.rotation=0,this.scale=[1,1]}};e.__decorate([t.property({type:[Number],nonNullable:!0,json:{write:!0}})],n.prototype,"offset",void 0),e.__decorate([t.property({type:Number,nonNullable:!0,json:{write:!0}})],n.prototype,"rotation",void 0),e.__decorate([t.property({type:[Number],nonNullable:!0,json:{write:!0}})],n.prototype,"scale",void 0),n=e.__decorate([a.subclass("esri.geometry.support.MeshTextureTransform")],n);return n}));
