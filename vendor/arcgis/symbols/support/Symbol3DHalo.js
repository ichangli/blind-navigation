/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../chunks/tslib.es6","../../Color","../../core/JSONSupport","../../core/lang","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/accessorSupport/decorators/subclass","./materialUtils"],(function(o,r,e,s,t,c,l,p,a,i){"use strict";var n;o.Symbol3DHalo=n=class extends s.JSONSupport{constructor(){super(...arguments),this.color=new e([0,0,0,1]),this.size=0}clone(){const o={color:t.clone(this.color),size:this.size};return new n(o)}},r.__decorate([c.property(i.colorAndTransparencyProperty)],o.Symbol3DHalo.prototype,"color",void 0),r.__decorate([c.property(i.screenSizeProperty)],o.Symbol3DHalo.prototype,"size",void 0),o.Symbol3DHalo=n=r.__decorate([a.subclass("esri.symbols.support.Symbol3DHalo")],o.Symbol3DHalo),Object.defineProperty(o,Symbol.toStringTag,{value:"Module"})}));
