/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/JSONSupport","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass"],(function(e,r,o,t,s,c,i){"use strict";let n=class extends r.JSONSupport{constructor(e){super(e),this.classificationDefinition=null,this.where=null}};e.__decorate([o.property({json:{name:"classificationDef",write:!0}})],n.prototype,"classificationDefinition",void 0),e.__decorate([o.property({type:String,json:{write:!0}})],n.prototype,"where",void 0),n=e.__decorate([i.subclass("esri.rest.support.GenerateRendererParameters")],n);return n}));
