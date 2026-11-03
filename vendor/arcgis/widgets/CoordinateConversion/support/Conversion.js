/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../../chunks/tslib.es6","../../../core/Accessor","../../../core/accessorSupport/decorators/property","../../../core/has","../../../core/Logger","../../../core/RandomLCG","../../../core/accessorSupport/decorators/subclass"],(function(o,r,e,t,s,i,c){"use strict";let n=class extends r{constructor(o){super(o),this.format=null,this.position={coordinate:null,location:null}}get displayCoordinate(){return this.format?.getDisplayCoordinate(this.position?.coordinate)}};o.__decorate([e.property({readOnly:!0})],n.prototype,"displayCoordinate",null),o.__decorate([e.property()],n.prototype,"format",void 0),o.__decorate([e.property()],n.prototype,"position",void 0),n=o.__decorate([c.subclass("esri.widgets.CoordinateConversion.support.Conversion")],n);return n}));
