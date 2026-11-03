/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/JSONSupport","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/enumeration","../../core/accessorSupport/decorators/subclass","./networkEnums"],(function(r,e,o,t,s,c,a,p,n){"use strict";let u=class extends e.JSONSupport{constructor(r){super(r),this.area=0,this.units=null}};r.__decorate([o.property({json:{write:!0}})],u.prototype,"area",void 0),r.__decorate([a.enumeration(n.areaUnitJsonMap)],u.prototype,"units",void 0),u=r.__decorate([p.subclass("esri.rest.support.ArealUnit")],u);return u}));
