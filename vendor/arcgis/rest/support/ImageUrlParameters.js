/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/Clonable","../../core/JSONSupport","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass"],(function(r,e,o,t,s,c,p,a){"use strict";let n=class extends(e.ClonableMixin(o.JSONSupport)){constructor(){super(...arguments),this.referenceUri=null,this.rasterId=null}};r.__decorate([t.property({type:String,json:{name:"uri",write:!0}})],n.prototype,"referenceUri",void 0),r.__decorate([t.property({type:Number,json:{write:!0}})],n.prototype,"rasterId",void 0),n=r.__decorate([a.subclass("esri.rest.support.ImageUrlParameters")],n);return n}));
