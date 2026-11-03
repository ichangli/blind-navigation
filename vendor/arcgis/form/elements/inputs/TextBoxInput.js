/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../../chunks/tslib.es6","../../../core/accessorSupport/decorators/property","../../../core/has","../../../core/Logger","../../../core/RandomLCG","../../../core/accessorSupport/decorators/subclass","./TextInput"],(function(e,t,r,o,s,c,n){"use strict";var p;let a=p=class extends n{constructor(e){super(e),this.type="text-box"}clone(){return new p({maxLength:this.maxLength,minLength:this.minLength})}};e.__decorate([t.property({type:["text-box"],json:{read:!1,write:!0}})],a.prototype,"type",void 0),a=p=e.__decorate([c.subclass("esri.form.elements.inputs.TextBoxInput")],a);return a}));
