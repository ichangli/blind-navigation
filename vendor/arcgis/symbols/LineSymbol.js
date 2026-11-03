/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../chunks/tslib.es6","../core/screenUtils","../core/accessorSupport/decorators/property","../core/has","../core/Logger","../core/RandomLCG","../core/accessorSupport/decorators/enumeration","../core/accessorSupport/decorators/subclass","./Symbol"],(function(e,r,t,o,s,c,i,p,a){"use strict";let n=class extends a{constructor(e){super(e),this.type="simple-line",this.width=.75}hash(){return`${this.type}.${this.width}`}};e.__decorate([i.enumeration({esriSLS:"simple-line"},{readOnly:!0})],n.prototype,"type",void 0),e.__decorate([t.property({type:Number,cast:r.toPt,json:{write:!0}})],n.prototype,"width",void 0),n=e.__decorate([p.subclass("esri.symbols.LineSymbol")],n);return n}));
