/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../../chunks/tslib.es6","../../../core/JSONSupport","../../../core/accessorSupport/decorators/property","../../../core/has","../../../core/Logger","../../../core/RandomLCG","../../../core/accessorSupport/decorators/subclass","../../../networks/support/NamedTraceConfiguration"],(function(r,e,o,t,s,a,c,n){"use strict";let u=class extends e.JSONSupport{constructor(r){super(r),this.namedTraceConfigurations=[]}};r.__decorate([o.property({type:[n],json:{read:{source:"traceConfigurations"},write:{target:"traceConfigurations"}}})],u.prototype,"namedTraceConfigurations",void 0),u=r.__decorate([c.subclass("esri.rest.networks.support.QueryNamedTraceConfigurationsResult")],u);return u}));
