/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/JSONSupport","../../core/lang","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/accessorSupport/decorators/subclass"],(function(e,r,t,o,s,p,i){"use strict";var l;let c=l=class extends r.JSONSupport{constructor(){super(...arguments),this.filterType=null,this.filterValues=null}clone(){return new l({filterType:this.filterType,filterValues:t.clone(this.filterValues)})}};e.__decorate([o.property({type:String,json:{write:!0}})],c.prototype,"filterType",void 0),e.__decorate([o.property({type:[String],json:{write:!0}})],c.prototype,"filterValues",void 0),c=l=e.__decorate([i.subclass("esri.layers.support.BuildingFilterAuthoringInfoType")],c);return c}));
