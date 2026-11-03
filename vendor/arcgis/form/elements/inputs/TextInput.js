/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../../chunks/tslib.es6","../../../core/accessorSupport/decorators/property","../../../core/has","../../../core/Logger","../../../core/RandomLCG","../../../core/accessorSupport/decorators/subclass","./Input"],(function(e,t,r,o,s,c,n){"use strict";let p=class extends n{constructor(e){super(e),this.maxLength=null,this.minLength=0}};e.__decorate([t.property({type:Number,json:{write:!0}})],p.prototype,"maxLength",void 0),e.__decorate([t.property({type:Number,json:{write:!0}})],p.prototype,"minLength",void 0),p=e.__decorate([c.subclass("esri.form.elements.inputs.TextInput")],p);return p}));
