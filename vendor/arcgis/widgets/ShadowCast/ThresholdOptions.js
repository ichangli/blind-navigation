/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../Color","../../core/Accessor","../../core/timeUtils","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass"],(function(e,o,r,t,s,c,i,p,a){"use strict";let l=class extends r{constructor(){super(...arguments),this.color=new o([255,0,0,.7]),this.value=t.convertTime(4,"hours","milliseconds"),this.minValue=0,this.maxValue=t.convertTime(8,"hours","milliseconds")}};e.__decorate([s.property({type:o})],l.prototype,"color",void 0),e.__decorate([s.property()],l.prototype,"value",void 0),e.__decorate([s.property()],l.prototype,"minValue",void 0),e.__decorate([s.property()],l.prototype,"maxValue",void 0),l=e.__decorate([a.subclass("esri.widgets.ShadowCast.ThresholdOptions")],l);return l}));
