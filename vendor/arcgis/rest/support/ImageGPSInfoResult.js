/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/JSONSupport","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass","./CameraInfo","./ImageGPSInfo"],(function(e,r,o,s,t,c,p,a,u){"use strict";let n=class extends r.JSONSupport{constructor(){super(...arguments),this.images=null,this.cameras=null}};e.__decorate([o.property({type:[u],json:{write:!0}})],n.prototype,"images",void 0),e.__decorate([o.property({type:[a],json:{write:!0}})],n.prototype,"cameras",void 0),n=e.__decorate([p.subclass("esri.rest.support.ImageGPSInfoResult")],n);return n}));
