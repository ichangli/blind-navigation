/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/JSONSupport","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass"],(function(e,r,o,t,s,l,c){"use strict";let n=class extends r.JSONSupport{constructor(e){super(e),this.field=null,this.type=null}clone(){return console.warn(".clone() is not implemented for "+this.declaredClass),null}};e.__decorate([o.property({type:String,json:{write:{enabled:!0,isRequired:!0}}})],n.prototype,"field",void 0),e.__decorate([o.property({readOnly:!0,nonNullable:!0,json:{read:!1}})],n.prototype,"type",void 0),n=e.__decorate([c.subclass("esri.layers.pointCloudFilters.PointCloudFilter")],n);return n}));
