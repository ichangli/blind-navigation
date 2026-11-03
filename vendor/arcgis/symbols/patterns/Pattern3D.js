/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/JSONSupport","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass"],(function(e,r,o,t,s,c,n){"use strict";let p=class extends r.JSONSupport{constructor(e){super(e),this.type="style"}clone(){throw new Error("Subclasses of Pattern3D should implement their own clone method.")}};e.__decorate([o.property({type:["style"],readOnly:!0,json:{read:!0,write:{ignoreOrigin:!0}}})],p.prototype,"type",void 0),p=e.__decorate([n.subclass("esri.symbols.patterns.Pattern3D")],p);return p}));
