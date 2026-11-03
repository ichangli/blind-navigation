/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass","./BaseImageMeasureResult"],(function(e,s,r,t,o,a,c){"use strict";let u=class extends c.BaseImageMeasureResult{constructor(){super(...arguments),this.height=null}};e.__decorate([s.property({type:c.ImageMeasureResultLengthValue,json:{read:!0,write:!0}})],u.prototype,"height",void 0),u=e.__decorate([a.subclass("esri.rest.support.ImageHeightResult")],u);return u}));
