/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../../../../chunks/tslib.es6","../../GraphShaderModule","../../graph/glsl"],(function(e,t,s,i){"use strict";class a extends s.UniformGroup{getSizeForViewScale(e){return i.cond([i.lessThanEqual(e,this.values.first()),this.sizes.first()],[i.greaterThanEqual(e,this.values.last()),this.sizes.last()],[!0,()=>{const t=this.values.findIndex((t=>i.greaterThan(t,e))),s=this.values.get(t),a=t.subtract(1),r=this.values.get(a),o=e.subtract(r).divide(s.subtract(r));return i.mix(this.sizes.get(a),this.sizes.get(t),o)}])}}t.__decorate([s.uniform(i.FixedArray.ofType(i.Float,8))],a.prototype,"sizes",void 0),t.__decorate([s.uniform(i.FixedArray.ofType(i.Float,8))],a.prototype,"values",void 0),e.VisualVariableSizeScaleStops=a,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
