/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/JSONSupport","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass","./ImageSample"],(function(e,r,s,o,t,c,p,a){"use strict";let u=class extends r.JSONSupport{constructor(){super(...arguments),this.samples=null}};e.__decorate([s.property({type:[a],json:{write:!0}})],u.prototype,"samples",void 0),u=e.__decorate([p.subclass("esri.rest.support.ImageSampleResult")],u);return u}));
