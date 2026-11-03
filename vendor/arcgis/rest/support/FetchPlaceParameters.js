/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass","./PlacesParameters"],(function(e,r,s,t,o,c,a){"use strict";let p=class extends a{constructor(e){super(e),this.placeId=null,this.requestedFields=null}};e.__decorate([r.property()],p.prototype,"placeId",void 0),e.__decorate([r.property()],p.prototype,"requestedFields",void 0),p=e.__decorate([c.subclass("esri.rest.support.FetchPlaceParameters")],p);return p}));
