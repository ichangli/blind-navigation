/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../../chunks/tslib.es6","../../../core/lang","../../../core/accessorSupport/decorators/property","../../../core/has","../../../core/Logger","../../../core/accessorSupport/decorators/enumeration","../../../core/accessorSupport/decorators/subclass","./bandIndexUtils","./BaseFunctionArguments"],(function(e,r,t,o,s,n,c,a,d){"use strict";var i;let u=i=class extends d{constructor(){super(...arguments),this.method="custom"}clone(){return new i({method:this.method,bandIndexes:this.bandIndexes,raster:r.clone(this.raster)})}};e.__decorate([t.property({json:{type:String,write:!0}})],u.prototype,"bandIndexes",void 0),e.__decorate([n.enumeration(a.bandIndexMethodMap)],u.prototype,"method",void 0),u=i=e.__decorate([c.subclass("esri.layers.support.rasterFunctions.BandArithmeticFunctionArguments")],u);return u}));
