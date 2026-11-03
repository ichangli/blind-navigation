/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/JSONSupport","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass"],(function(e,r,o,s,t,c,p){"use strict";let u=class extends r.JSONSupport{constructor(){super(...arguments),this.geometries=null}};e.__decorate([o.property({json:{write:!0}})],u.prototype,"geometries",void 0),u=e.__decorate([p.subclass("esri.rest.support.ImagePixelLocationResult")],u);return u}));
