/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/JSONSupport","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass"],(function(r,e,o,s,t,c,p){"use strict";let u=class extends e.JSONSupport{constructor(){super(...arguments),this.url=null}};r.__decorate([o.property({json:{name:"imageURL",write:!0}})],u.prototype,"url",void 0),u=r.__decorate([p.subclass("esri.rest.support.ImageUrlResult")],u);return u}));
