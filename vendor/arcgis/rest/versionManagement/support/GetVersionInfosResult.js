/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../../chunks/tslib.es6","../../../core/JSONSupport","../../../core/accessorSupport/decorators/property","../../../core/has","../../../core/Logger","../../../core/RandomLCG","../../../core/accessorSupport/decorators/subclass"],(function(e,r,s,o,t,c,p){"use strict";let n=class extends r.JSONSupport{constructor(e){super(e),this.versions=[]}};e.__decorate([s.property({json:{write:!0}})],n.prototype,"versions",void 0),n=e.__decorate([p.subclass("esri.rest.versionManagement.support.GetVersionInfosResult")],n);return n}));
