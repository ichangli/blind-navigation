/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../../chunks/tslib.es6","../../../core/JSONSupport","../../../core/accessorSupport/decorators/property","../../../core/accessorSupport/ensureType","../../../core/RandomLCG","../../../core/has","../../../core/accessorSupport/decorators/subclass"],(function(e,r,o,t,s,c,n){"use strict";var p;let a=p=class extends r.JSONSupport{static from(e){return t.ensureClass(p,e)}constructor(e){super(e),this.ownerFilter=null,this.includeHidden=!1}};e.__decorate([o.property({type:String,json:{write:!0}})],a.prototype,"ownerFilter",void 0),e.__decorate([o.property({type:Boolean,json:{write:!0}})],a.prototype,"includeHidden",void 0),a=p=e.__decorate([n.subclass("esri.rest.versionManagement.support.GetVersionInfosParameters")],a);return a}));
