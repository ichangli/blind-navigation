/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../../chunks/tslib.es6","../../../core/accessorSupport/decorators/property","../../../core/has","../../../core/Logger","../../../core/RandomLCG","../../../core/accessorSupport/decorators/subclass","./Input"],(function(e,t,o,r,s,c,p){"use strict";var n;let u=n=class extends p{constructor(e){super(e),this.offValue=null,this.onValue=null,this.type="switch"}clone(){return new n({offValue:this.offValue,onValue:this.onValue})}};e.__decorate([t.property({type:[String,Number],json:{write:!0}})],u.prototype,"offValue",void 0),e.__decorate([t.property({type:[String,Number],json:{write:!0}})],u.prototype,"onValue",void 0),e.__decorate([t.property({type:["switch"],json:{read:!1,write:!0}})],u.prototype,"type",void 0),u=n=e.__decorate([c.subclass("esri.form.elements.inputs.SwitchInput")],u);return u}));
