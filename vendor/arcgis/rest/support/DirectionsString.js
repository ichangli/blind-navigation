/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/JSONSupport","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/enumeration","../../core/accessorSupport/decorators/subclass","./networkEnums"],(function(r,e,o,t,s,c,p,n,a){"use strict";let u=class extends e.JSONSupport{constructor(r){super(r)}};r.__decorate([o.property({json:{read:{source:"string"}}})],u.prototype,"text",void 0),r.__decorate([p.enumeration(a.directionsStringTypeJsonMap,{name:"stringType"})],u.prototype,"type",void 0),u=r.__decorate([n.subclass("esri.rest.support.DirectionsString")],u);return u}));
