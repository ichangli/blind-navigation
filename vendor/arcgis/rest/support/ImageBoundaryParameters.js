/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/Clonable","../../core/JSONSupport","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass","../../geometry/SpatialReference"],(function(e,r,o,t,s,c,a,p,n){"use strict";let u=class extends(r.ClonableMixin(o.JSONSupport)){constructor(){super(...arguments),this.outSpatialReference=null}};e.__decorate([t.property({type:n,json:{name:"outSR",write:!0}})],u.prototype,"outSpatialReference",void 0),u=e.__decorate([p.subclass("esri.rest.support.ImageBoundaryParameters")],u);return u}));
