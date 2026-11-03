/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../../../chunks/tslib.es6","../../../../core/JSONSupport","../../../../core/accessorSupport/decorators/property","../../../../core/accessorSupport/ensureType","../../../../core/RandomLCG","../../../../core/has","../../../../core/accessorSupport/decorators/subclass"],(function(r,e,s,o,t,c,p){"use strict";var a;let n=a=class extends e.JSONSupport{static from(r){return o.ensureClass(a,r)}constructor(r){super(r),this.sessionId=void 0,this.rows=void 0}};r.__decorate([s.property({type:String,json:{write:!0}})],n.prototype,"sessionId",void 0),r.__decorate([s.property({type:[Object],json:{write:!0}})],n.prototype,"rows",void 0),n=a=r.__decorate([p.subclass("esri.rest.versionManagement.gdbVersion.support.PostParameters")],n);return n}));
