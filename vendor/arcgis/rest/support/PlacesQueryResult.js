/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/Accessor","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass","./PlaceResult"],(function(e,r,s,o,t,c,u,p){"use strict";let a=class extends r{constructor(e){super(e),this.nextQueryParams=null,this.previousQueryParams=null,this.results=null}};e.__decorate([s.property()],a.prototype,"nextQueryParams",void 0),e.__decorate([s.property()],a.prototype,"previousQueryParams",void 0),e.__decorate([s.property({type:[p]})],a.prototype,"results",void 0),a=e.__decorate([u.subclass("esri.rest.support.PlacesQueryResult")],a);return a}));
