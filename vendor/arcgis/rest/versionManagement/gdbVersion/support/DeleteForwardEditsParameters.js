/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../../../chunks/tslib.es6","../../../../core/JSONSupport","../../../../core/accessorSupport/decorators/property","../../../../core/accessorSupport/ensureType","../../../../core/RandomLCG","../../../../core/has","../../../../core/accessorSupport/decorators/subclass"],(function(e,r,t,o,s,p,c){"use strict";var n;let a=n=class extends r.JSONSupport{static from(e){return o.ensureClass(n,e)}constructor(e){super(e),this.sessionId=void 0,this.moment=null}};e.__decorate([t.property({type:String,json:{write:!0}})],a.prototype,"sessionId",void 0),e.__decorate([t.property({type:Date,json:{type:Number,write:{writer:(e,r)=>{r.moment=e?e.getTime():null}}}})],a.prototype,"moment",void 0),a=n=e.__decorate([c.subclass("esri.rest.versionManagement.gdbVersion.support.DeleteForwardEditsParameters")],a);return a}));
