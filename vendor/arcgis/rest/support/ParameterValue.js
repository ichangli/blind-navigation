/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/JSONSupport","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/enumeration","../../core/accessorSupport/decorators/subclass","./parameterValueUtils"],(function(e,r,o,t,a,s,p,c,u){"use strict";let n=class extends r.JSONSupport{constructor(e){super(e),this.dataType=null,this.paramName=null,this.value=null}};e.__decorate([p.enumeration(u.dataTypeJsonMap,{ignoreUnknown:!1})],n.prototype,"dataType",void 0),e.__decorate([o.property()],n.prototype,"paramName",void 0),e.__decorate([o.property()],n.prototype,"value",void 0),n=e.__decorate([c.subclass("esri.rest.support.ParameterValue")],n);return n}));
