/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../../../../chunks/tslib.es6","../../GraphShaderModule","../../graph/glsl","./utils"],(function(e,t,i,a,n){"use strict";class l extends i.UniformGroup{getSize(e,t){const i=this.minMaxValueAndSize.xy,l=this.minMaxValueAndSize.zw;return a.ifElse(n.isNan(e),t,(()=>{const t=e.subtract(i.x).divide(i.y.subtract(i.x)),n=a.clamp(t,new a.Float(0),new a.Float(1));return l.x.add(n.multiply(l.y.subtract(l.x)))}))}}t.__decorate([i.uniform(a.Vec4)],l.prototype,"minMaxValueAndSize",void 0),e.VisualVariableSizeMinMaxValue=l,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
