/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/Accessor","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass"],(function(e,r,s,o,c,t,p){"use strict";let a=class extends r{constructor(e){super(e),this.apiKey=null,this.icon=null,this.url="https://places-api.arcgis.com/arcgis/rest/services/places-service/v1"}};e.__decorate([s.property()],a.prototype,"apiKey",void 0),e.__decorate([s.property()],a.prototype,"icon",void 0),e.__decorate([s.property()],a.prototype,"url",void 0),a=e.__decorate([p.subclass("esri.rest.support.PlacesParameters")],a);return a}));
