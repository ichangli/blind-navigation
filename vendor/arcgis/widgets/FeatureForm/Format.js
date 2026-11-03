/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/JSONSupport","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/enumeration","../../core/accessorSupport/decorators/subclass","../../intl/date"],(function(r,e,o,t,a,s,c,p,d){"use strict";let i=class extends e.JSONSupport{constructor(r){super(r),this.dateFormat=null,this.digitSeparator=!1,this.places=null}};r.__decorate([c.enumeration(d.dateFormatJSONMap)],i.prototype,"dateFormat",void 0),r.__decorate([o.property()],i.prototype,"digitSeparator",void 0),r.__decorate([o.property()],i.prototype,"places",void 0),i=r.__decorate([p.subclass("esri.widgets.FeatureForm.Format")],i);return i}));
