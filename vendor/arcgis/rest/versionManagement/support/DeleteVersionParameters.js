/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../../chunks/tslib.es6","../../../core/JSONSupport","../../../core/accessorSupport/decorators/property","../../../core/has","../../../core/Logger","../../../core/RandomLCG","../../../core/accessorSupport/decorators/subclass"],(function(e,r,o,s,t,c,p){"use strict";let i=class extends r.JSONSupport{constructor(e){super(e),this.versionName=void 0,this.sessionId=void 0}};e.__decorate([o.property({type:String,json:{write:!0}})],i.prototype,"versionName",void 0),e.__decorate([o.property({type:String,json:{write:!0}})],i.prototype,"sessionId",void 0),i=e.__decorate([p.subclass("esri.rest.versionManagement.support.DeleteVersionParameters")],i);return i}));
