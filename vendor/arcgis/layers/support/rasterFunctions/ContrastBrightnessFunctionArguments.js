/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../../chunks/tslib.es6","../../../core/accessorSupport/decorators/property","../../../core/has","../../../core/Logger","../../../core/RandomLCG","../../../core/accessorSupport/decorators/subclass","./BaseFunctionArguments"],(function(s,t,r,e,o,n,c){"use strict";var a;let i=a=class extends c{constructor(){super(...arguments),this.contrastOffset=0,this.brightnessOffset=0}clone(){return new a({contrastOffset:this.contrastOffset,brightnessOffset:this.brightnessOffset,raster:this.raster})}};s.__decorate([t.property({json:{write:!0}})],i.prototype,"contrastOffset",void 0),s.__decorate([t.property({json:{write:!0}})],i.prototype,"brightnessOffset",void 0),i=a=s.__decorate([n.subclass("esri.layers.support.rasterFunctions.ContrastBrightnessFunctionArguments")],i);return i}));
