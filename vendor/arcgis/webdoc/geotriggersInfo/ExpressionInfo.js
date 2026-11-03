/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/Clonable","../../core/JSONSupport","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass"],(function(e,r,o,t,s,p,i,n){"use strict";let c=class extends(r.ClonableMixin(o.JSONSupport)){constructor(e){super(e),this.expression=null,this.returnType="string",this.title=null}};e.__decorate([t.property({type:String,json:{write:{isRequired:!0}}})],c.prototype,"expression",void 0),e.__decorate([t.property({type:["number","string"],json:{write:!0}})],c.prototype,"returnType",void 0),e.__decorate([t.property({type:String,json:{write:!0}})],c.prototype,"title",void 0),c=e.__decorate([n.subclass("esri.webdoc.geotriggersInfo.ExpressionInfo")],c);return c}));
