/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../../chunks/tslib.es6","../../../core/accessorSupport/decorators/property","../../../core/has","../../../core/Logger","../../../core/RandomLCG","../../../core/accessorSupport/decorators/enumeration","../../../core/accessorSupport/decorators/subclass","./PointSizeAlgorithm"],(function(e,o,r,t,s,c,a,p){"use strict";var l;let n=l=class extends p{constructor(){super(...arguments),this.type="splat",this.scaleFactor=1}clone(){return new l({scaleFactor:this.scaleFactor})}};e.__decorate([c.enumeration({pointCloudSplatAlgorithm:"splat"})],n.prototype,"type",void 0),e.__decorate([o.property({type:Number,value:1,nonNullable:!0,json:{write:!0}})],n.prototype,"scaleFactor",void 0),n=l=e.__decorate([a.subclass("esri.renderers.support.pointCloud.PointSizeSplatAlgorithm")],n);return n}));
