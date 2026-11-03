/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/JSONSupport","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass"],(function(e,r,o,s,c,t,n){"use strict";let a=class extends r.JSONSupport{constructor(e){super(e)}clone(){throw new Error("Subclasses of Background should implement their own clone method.")}};e.__decorate([o.property({readOnly:!0,json:{read:!1}})],a.prototype,"type",void 0),a=e.__decorate([n.subclass("esri.webscene.background.Background")],a);return a}));
