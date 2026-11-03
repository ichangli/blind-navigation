/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../Color","../../core/Accessor","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass","./DurationMode"],(function(o,e,r,t,s,c,a,p,d){"use strict";let i=class extends r{constructor(){super(...arguments),this.color=new e([0,0,255,.7]),this.mode=d.DurationMode.Continuous}};o.__decorate([t.property({type:e})],i.prototype,"color",void 0),o.__decorate([t.property()],i.prototype,"mode",void 0),i=o.__decorate([p.subclass("esri.widgets.ShadowCast.DurationOptions")],i);return i}));
