/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../../chunks/tslib.es6","../../../core/Accessor","../../../core/Identifiable","../../../core/accessorSupport/decorators/property","../../../core/has","../../../core/Logger","../../../core/RandomLCG","../../../core/accessorSupport/decorators/subclass"],(function(e,t,o,r,n,s,a,i){"use strict";var c;let d=c=class extends(o.NumericIdentifiableMixin(t)){constructor(){super(...arguments),this.enabled=!0,this.rotationEnabled=!0}constrain(e,t){return this.enabled&&t?(this.rotationEnabled||(e.rotation=t.rotation),e):e}clone(){return new c({enabled:this.enabled,rotationEnabled:this.rotationEnabled})}};e.__decorate([r.property()],d.prototype,"enabled",void 0),e.__decorate([r.property()],d.prototype,"rotationEnabled",void 0),d=c=e.__decorate([i.subclass("esri.views.2d.constraints.RotationConstraint")],d);return d}));
