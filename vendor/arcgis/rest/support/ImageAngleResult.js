/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../geometry","../../core/JSONSupport","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass","../../geometry/SpatialReference"],(function(e,r,t,o,s,p,c,u,a){"use strict";let n=class extends t.JSONSupport{constructor(e){super(e),this.north=null,this.up=null,this.spatialReference=null}};e.__decorate([o.property({type:Number,json:{write:!0}})],n.prototype,"north",void 0),e.__decorate([o.property({type:Number,json:{write:!0}})],n.prototype,"up",void 0),e.__decorate([o.property({type:a,json:{write:!0}})],n.prototype,"spatialReference",void 0),n=e.__decorate([u.subclass("esri.rest.support.ImageAngleResult")],n);return n}));
