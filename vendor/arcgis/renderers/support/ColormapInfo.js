/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../Color","../../core/JSONSupport","../../core/accessorSupport/decorators/property","../../core/accessorSupport/ensureType","../../core/RandomLCG","../../core/has","../../core/accessorSupport/decorators/subclass"],(function(e,r,o,t,s,p,c,l){"use strict";let u=class extends o.JSONSupport{constructor(){super(...arguments),this.value=null,this.label=null,this.color=null}};e.__decorate([t.property({type:Number,json:{write:!0}})],u.prototype,"value",void 0),e.__decorate([t.property({type:String,json:{write:!0}})],u.prototype,"label",void 0),e.__decorate([t.property({type:r,json:{type:[s.Integer],write:!0}})],u.prototype,"color",void 0),u=e.__decorate([l.subclass("esri.renderers.support.ColormapInfo")],u);return u}));
