/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../../chunks/tslib.es6","../../../core/accessorSupport/decorators/property","../../../core/has","../../../core/Logger","../../../core/RandomLCG","../../../core/accessorSupport/decorators/subclass","./BaseFunctionArguments"],(function(r,e,s,o,t,c,a){"use strict";var n;let u=n=class extends a{clone(){return new n({conversionParameters:[...this.conversionParameters],raster:this.raster})}};r.__decorate([e.property({type:[Number],json:{write:!0}})],u.prototype,"conversionParameters",void 0),u=n=r.__decorate([c.subclass("esri.layers.support.rasterFunctions.GrayscaleFunctionArguments")],u);return u}));
