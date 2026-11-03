/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../chunks/tslib.es6","../core/lang","../core/accessorSupport/decorators/property","../core/has","../core/Logger","../core/accessorSupport/decorators/enumeration","../core/accessorSupport/decorators/subclass","./PointCloudRenderer"],(function(e,r,o,t,s,c,n,i){"use strict";var d;let p=d=class extends i{constructor(e){super(e),this.type="point-cloud-rgb",this.field=null}clone(){return new d({...this.cloneProperties(),field:r.clone(this.field)})}};e.__decorate([c.enumeration({pointCloudRGBRenderer:"point-cloud-rgb"})],p.prototype,"type",void 0),e.__decorate([o.property({type:String,json:{write:!0}})],p.prototype,"field",void 0),p=d=e.__decorate([n.subclass("esri.renderers.PointCloudRGBRenderer")],p);return p}));
