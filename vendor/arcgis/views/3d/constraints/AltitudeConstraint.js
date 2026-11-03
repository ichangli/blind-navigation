/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../chunks/tslib.es6","../../../core/Clonable","../../../core/accessorSupport/decorators/property","../../../core/has","../../../core/Logger","../../../core/RandomLCG","../../../core/accessorSupport/decorators/subclass","../state/Constraints"],(function(t,e,r,o,s,n,i,a,c){"use strict";t.AltitudeConstraint=class extends r.Clonable{constructor(){super(...arguments),this.min=c.earthAltitudeConstraint.min,this.max=c.earthAltitudeConstraint.max}},e.__decorate([o.property({type:Number})],t.AltitudeConstraint.prototype,"min",void 0),e.__decorate([o.property({type:Number})],t.AltitudeConstraint.prototype,"max",void 0),t.AltitudeConstraint=e.__decorate([a.subclass("esri.views.3d.constraints.AltitudeConstraint")],t.AltitudeConstraint),Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
