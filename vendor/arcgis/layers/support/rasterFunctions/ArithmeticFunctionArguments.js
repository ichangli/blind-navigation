/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../../chunks/tslib.es6","../../../core/accessorSupport/decorators/property","../../../core/has","../../../core/Logger","../../../core/RandomLCG","../../../core/accessorSupport/decorators/subclass","./BaseFunctionArguments"],(function(r,e,t,s,o,a,c){"use strict";var n;let i=n=class extends c{constructor(){super(...arguments),this.raster2=void 0}get rasters(){return[this.raster,this.raster2]}clone(){return new n({raster:this.raster,raster2:this.raster2,operation:this.operation})}};r.__decorate([e.property({json:{write:!0}})],i.prototype,"operation",void 0),r.__decorate([e.property({json:{write:!0}})],i.prototype,"raster2",void 0),r.__decorate([e.property({readOnly:!0})],i.prototype,"rasters",null),i=n=r.__decorate([a.subclass("esri.layers.support.rasterFunctions.ArithmeticFunctionArguments")],i);return i}));
