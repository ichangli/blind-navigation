/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../geometry","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass","./BaseImageMeasureResult","../../geometry/Point"],(function(e,r,s,o,t,a,c,u,p){"use strict";let n=class extends u.BaseImageMeasureResult{constructor(){super(...arguments),this.point=null}};e.__decorate([s.property({type:p,json:{name:"point.value",read:!0,write:!0}})],n.prototype,"point",void 0),n=e.__decorate([c.subclass("esri.rest.support.ImagePointResult")],n);return n}));
