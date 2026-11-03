/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../../chunks/tslib.es6","../../../core/JSONSupport","../../../core/accessorSupport/decorators/property","../../../core/has","../../../core/Logger","../../../core/RandomLCG","../../../core/accessorSupport/decorators/enumeration","../../../core/accessorSupport/decorators/subclass"],(function(e,r,o,t,s,c,n,u){"use strict";var p;let a=p=class extends r.JSONSupport{constructor(e){super(e),this.type="sunny",this.cloudCover=.5}clone(){return new p({cloudCover:this.cloudCover})}};e.__decorate([n.enumeration({sunny:"sunny"})],a.prototype,"type",void 0),e.__decorate([o.property({type:Number,nonNullable:!0,range:{min:0,max:1},json:{write:!0}})],a.prototype,"cloudCover",void 0),a=p=e.__decorate([u.subclass("esri.views.3d.environment.SunnyWeather")],a);return a}));
