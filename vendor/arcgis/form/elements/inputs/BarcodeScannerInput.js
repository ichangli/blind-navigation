/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../../chunks/tslib.es6","../../../core/accessorSupport/decorators/property","../../../core/has","../../../core/Logger","../../../core/RandomLCG","../../../core/accessorSupport/decorators/subclass","./TextInput"],(function(e,r,t,s,o,c,n){"use strict";var a;let p=a=class extends n{constructor(e){super(e),this.type="barcode-scanner"}clone(){return new a({maxLength:this.maxLength,minLength:this.minLength})}};e.__decorate([r.property({type:["barcode-scanner"],json:{read:!1,write:!0}})],p.prototype,"type",void 0),p=a=e.__decorate([c.subclass("esri.form.elements.inputs.BarcodeScannerInput")],p);return p}));
