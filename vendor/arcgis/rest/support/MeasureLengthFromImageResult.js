/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../geometry","../../core/JSONSupport","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass","../../geometry/support/jsonUtils"],(function(e,r,o,t,s,p,c,n,a){"use strict";let u=class extends o.JSONSupport{constructor(){super(...arguments),this.geometry=null,this.length=null}};e.__decorate([t.property({types:r.geometryTypes,json:{name:"Shape",read:a.fromJSON,write:!0}})],u.prototype,"geometry",void 0),e.__decorate([t.property({json:{name:"Length",write:!0}})],u.prototype,"length",void 0),u=e.__decorate([n.subclass("esri.rest.support.MeasureLengthFromImageResult")],u);return u}));
