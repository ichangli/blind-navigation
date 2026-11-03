/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../chunks/tslib.es6","../../core/Logger","../../core/has","../../core/RandomLCG","../../core/Error","../../core/accessorSupport/decorators/enumeration","../../core/accessorSupport/decorators/subclass","./Symbol3DMaterial"],(function(o,e,l,r,t,c,i,s,a){"use strict";var n;o.Symbol3DFillMaterial=n=class extends a.Symbol3DMaterial{constructor(o){super(o),this.colorMixMode=null}clone(){const o={color:null!=this.color?this.color.clone():null,colorMixMode:this.colorMixMode};return new n(o)}},e.__decorate([i.enumeration({multiply:"multiply",replace:"replace",tint:"tint"})],o.Symbol3DFillMaterial.prototype,"colorMixMode",void 0),o.Symbol3DFillMaterial=n=e.__decorate([s.subclass("esri.symbols.support.Symbol3DFillMaterial")],o.Symbol3DFillMaterial),Object.defineProperty(o,Symbol.toStringTag,{value:"Module"})}));
