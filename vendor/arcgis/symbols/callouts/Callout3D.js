/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/JSONSupport","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass"],(function(e,o,r,t,s,c,l){"use strict";let p=class extends o.JSONSupport{constructor(e){super(e),this.visible=!0}clone(){throw new Error("Subclasses of Callout3D should implement their own clone method.")}};e.__decorate([r.property({type:["line"],constructOnly:!0,json:{read:!1,write:{ignoreOrigin:!0}}})],p.prototype,"type",void 0),e.__decorate([r.property({readOnly:!0})],p.prototype,"visible",void 0),p=e.__decorate([l.subclass("esri.symbols.callouts.Callout3D")],p);return p}));
