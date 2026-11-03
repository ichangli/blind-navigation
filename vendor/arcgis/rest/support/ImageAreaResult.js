/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass","./BaseImageMeasureResult"],(function(e,r,s,t,a,o,u){"use strict";let c=class extends u.BaseImageMeasureResult{constructor(){super(...arguments),this.area=null,this.perimeter=null}};e.__decorate([r.property({type:u.ImageMeasureResultAreaValue,json:{read:!0,write:!0}})],c.prototype,"area",void 0),e.__decorate([r.property({type:u.ImageMeasureResultLengthValue,json:{read:!0,write:!0}})],c.prototype,"perimeter",void 0),c=e.__decorate([o.subclass("esri.rest.support.ImageAreaResult")],c);return c}));
