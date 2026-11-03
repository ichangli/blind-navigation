/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/Clonable","../../core/JSONSupport","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/enumeration","../../core/accessorSupport/decorators/subclass"],(function(e,r,o,t,c,s,n,p,a){"use strict";let u=class extends(r.ClonableMixin(o.JSONSupport)){constructor(e){super(e),this.type="georeferenced",this.origin=null}};e.__decorate([p.enumeration({georeferenced:"georeferenced"},{readOnly:!0})],u.prototype,"type",void 0),e.__decorate([t.property({type:[Number],nonNullable:!1,json:{write:!0}})],u.prototype,"origin",void 0),u=e.__decorate([a.subclass("esri.geometry.support.MeshGeoreferencedVertexSpace")],u);return u}));
