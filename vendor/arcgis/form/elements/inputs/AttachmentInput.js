/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../../chunks/tslib.es6","../../../core/JSONSupport","../../../core/accessorSupport/decorators/property","../../../core/has","../../../core/Logger","../../../core/RandomLCG","../../../core/accessorSupport/decorators/subclass"],(function(e,t,r,o,s,c,p){"use strict";var n;let u=n=class extends t.JSONSupport{constructor(e){super(e),this.type=null}clone(){return new n({type:this.type})}};e.__decorate([r.property({type:["attachment","audio","document","image","signature","video"],json:{write:!0}})],u.prototype,"type",void 0),u=n=e.__decorate([p.subclass("esri.form.elements.inputs.AttachmentInput")],u);return u}));
