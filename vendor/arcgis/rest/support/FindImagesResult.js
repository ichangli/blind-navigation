/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/JSONSupport","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass","./ImageInspectionInfo"],(function(e,r,s,o,t,c,p,a){"use strict";let u=class extends r.JSONSupport{constructor(){super(...arguments),this.images=null}};e.__decorate([s.property({type:[a],json:{write:!0}})],u.prototype,"images",void 0),u=e.__decorate([p.subclass("esri.rest.support.FindImagesResult")],u);return u}));
