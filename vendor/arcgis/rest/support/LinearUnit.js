/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/JSONSupport","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/enumeration","../../core/accessorSupport/decorators/subclass","./networkEnums"],(function(r,e,o,t,s,c,n,p,a){"use strict";let i=class extends e.JSONSupport{constructor(r){super(r),this.distance=0,this.units=null}};r.__decorate([o.property({json:{write:!0}})],i.prototype,"distance",void 0),r.__decorate([n.enumeration(a.linearUnitJsonMap)],i.prototype,"units",void 0),i=r.__decorate([p.subclass("esri.rest.support.LinearUnit")],i);return i}));
