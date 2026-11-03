/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/JSONSupport","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass","./CameraInfoMixin"],(function(r,e,o,s,t,c,a,p){"use strict";let n=class extends(p.CameraInfoMixin(e.JSONSupport)){constructor(){super(...arguments),this.id=null}};r.__decorate([o.property({json:{write:!0}})],n.prototype,"id",void 0),n=r.__decorate([a.subclass("esri.rest.support.CameraInfo")],n);return n}));
