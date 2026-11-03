/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/Logger","../../core/has","../../core/RandomLCG","../../core/Error","../../core/accessorSupport/decorators/enumeration","../../core/accessorSupport/decorators/subclass","./Domain"],(function(e,r,o,t,s,c,n,i){"use strict";var a;let u=a=class extends i{constructor(e){super(e),this.type="inherited"}clone(){return new a}};e.__decorate([c.enumeration({inherited:"inherited"})],u.prototype,"type",void 0),u=a=e.__decorate([n.subclass("esri.layers.support.InheritedDomain")],u);return u}));
