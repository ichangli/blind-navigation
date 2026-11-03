/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../../chunks/tslib.es6","../../../core/Logger","../../../core/has","../../../core/RandomLCG","../../../core/Error","../../../core/accessorSupport/decorators/enumeration","../../../core/accessorSupport/decorators/subclass","./BaseRasterTransform"],(function(r,e,s,t,o,c,n,a){"use strict";var i;let u=i=class extends a{constructor(){super(...arguments),this.type="identity"}clone(){return new i}};r.__decorate([c.enumeration({IdentityXform:"identity"})],u.prototype,"type",void 0),u=i=r.__decorate([n.subclass("esri.layers.support.rasterTransforms.IdentityTransform")],u);return u}));
