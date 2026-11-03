/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../chunks/tslib.es6","../../core/JSONSupport","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass","./materialUtils"],(function(o,r,e,t,l,s,c,a,p){"use strict";var n;o.Symbol3DMaterial=n=class extends e.JSONSupport{constructor(o){super(o),this.color=null}clone(){const o={color:null!=this.color?this.color.clone():null};return new n(o)}},r.__decorate([t.property(p.colorAndTransparencyProperty)],o.Symbol3DMaterial.prototype,"color",void 0),o.Symbol3DMaterial=n=r.__decorate([a.subclass("esri.symbols.support.Symbol3DMaterial")],o.Symbol3DMaterial),Object.defineProperty(o,Symbol.toStringTag,{value:"Module"})}));
