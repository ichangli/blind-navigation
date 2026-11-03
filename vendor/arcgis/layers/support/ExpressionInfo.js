/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/Clonable","../../core/JSONSupport","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass"],(function(e,r,o,t,s,p,n,c){"use strict";let i=class extends(r.ClonableMixin(o.JSONSupport)){constructor(e){super(e),this.expression=null,this.title=null,this.returnType=null}};e.__decorate([t.property({type:String,json:{write:!0}})],i.prototype,"expression",void 0),e.__decorate([t.property({type:String,json:{write:!0}})],i.prototype,"title",void 0),e.__decorate([t.property({type:String,json:{write:!0}})],i.prototype,"returnType",void 0),i=e.__decorate([c.subclass("esri.layers.support.ExpressionInfo")],i);return i}));
