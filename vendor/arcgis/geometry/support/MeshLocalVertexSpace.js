/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/Clonable","../../core/JSONSupport","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/enumeration","../../core/accessorSupport/decorators/subclass","../../core/libs/gl-matrix-2/factories/vec3f64"],(function(e,o,r,t,c,s,a,p,l,i){"use strict";let n=class extends(o.ClonableMixin(r.JSONSupport)){constructor(e){super(e),this.type="local",this.origin=i.create()}};e.__decorate([p.enumeration({local:"local"},{readOnly:!0})],n.prototype,"type",void 0),e.__decorate([t.property({type:[Number],nonNullable:!0,json:{write:!0}})],n.prototype,"origin",void 0),n=e.__decorate([l.subclass("esri.geometry.support.MeshLocalVertexSpace")],n);return n}));
