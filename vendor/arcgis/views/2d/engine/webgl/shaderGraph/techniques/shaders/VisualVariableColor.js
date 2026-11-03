/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../../../../chunks/tslib.es6","../../GraphShaderModule","../../graph/glsl","./utils"],(function(e,t,s,r,o){"use strict";class a extends s.UniformGroup{getColor(e,t,s){return r.cond([r.or(o.isNan(e),s),t],[r.lessThanEqual(e,this.values.first()),this.colors.first()],[r.greaterThanEqual(e,this.values.last()),this.colors.last()],[!0,()=>{const t=this.values.findIndex((t=>r.greaterThan(t,e))),s=this.values.get(t),o=t.subtract(1),a=this.values.get(o),i=e.subtract(a).divide(s.subtract(a));return r.mix(this.colors.get(o),this.colors.get(t),i)}])}}t.__decorate([s.uniform(r.FixedArray.ofType(r.Vec4,8))],a.prototype,"colors",void 0),t.__decorate([s.uniform(r.FixedArray.ofType(r.Float,8))],a.prototype,"values",void 0),e.VisualVariableColor=a,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
