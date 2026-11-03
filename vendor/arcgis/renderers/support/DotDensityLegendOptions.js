/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/JSONSupport","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass"],(function(r,e,t,o,s,c,n){"use strict";var p;let u=p=class extends e.JSONSupport{constructor(){super(...arguments),this.unit=null}clone(){return new p({unit:this.unit})}};r.__decorate([t.property({type:String,json:{write:!0}})],u.prototype,"unit",void 0),u=p=r.__decorate([n.subclass("esri.renderers.support.DotDensityLegendOptions")],u);return u}));
