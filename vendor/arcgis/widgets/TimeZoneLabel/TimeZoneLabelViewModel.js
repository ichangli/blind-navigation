/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/Accessor","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass","../../time/timeZoneUtils"],(function(e,t,o,r,s,n,i,c){"use strict";let a=class extends t{constructor(e){super(e),this.view=null}get state(){return this.view?.ready?"ready":"disabled"}get timeZoneComponents(){return this.view?c.getTimeZoneComponents(this.view.timeZone):null}};e.__decorate([o.property({readOnly:!0})],a.prototype,"state",null),e.__decorate([o.property({readOnly:!0})],a.prototype,"timeZoneComponents",null),e.__decorate([o.property()],a.prototype,"view",void 0),a=e.__decorate([i.subclass("esri.widgets.TimeZoneLabel.TimeZoneLabelViewModel")],a);return a}));
