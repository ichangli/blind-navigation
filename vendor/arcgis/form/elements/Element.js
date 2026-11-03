/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/JSONSupport","../../core/accessorSupport/decorators/property","../../core/accessorSupport/decorators/subclass"],(function(e,t,r,o){"use strict";let s=class extends t.JSONSupport{constructor(e){super(e),this.description=null,this.label=null,this.type=null,this.visibilityExpression=null}};e.__decorate([r.property({type:String,json:{write:!0}})],s.prototype,"description",void 0),e.__decorate([r.property({type:String,json:{write:!0}})],s.prototype,"label",void 0),e.__decorate([r.property()],s.prototype,"type",void 0),e.__decorate([r.property({type:String,json:{write:!0}})],s.prototype,"visibilityExpression",void 0),s=e.__decorate([o.subclass("esri.form.elements.Element")],s);return s}));
