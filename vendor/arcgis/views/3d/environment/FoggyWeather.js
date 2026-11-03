/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../../chunks/tslib.es6","../../../core/JSONSupport","../../../core/accessorSupport/decorators/property","../../../core/has","../../../core/Logger","../../../core/RandomLCG","../../../core/accessorSupport/decorators/enumeration","../../../core/accessorSupport/decorators/subclass"],(function(e,r,o,t,s,c,n,p){"use strict";var a;let g=a=class extends r.JSONSupport{constructor(e){super(e),this.type="foggy",this.fogStrength=.5}clone(){return new a({fogStrength:this.fogStrength})}};e.__decorate([n.enumeration({foggy:"foggy"})],g.prototype,"type",void 0),e.__decorate([o.property({type:Number,nonNullable:!0,range:{min:0,max:1},json:{write:!0}})],g.prototype,"fogStrength",void 0),g=a=e.__decorate([p.subclass("esri.views.3d.environment.FoggyWeather")],g);return g}));
