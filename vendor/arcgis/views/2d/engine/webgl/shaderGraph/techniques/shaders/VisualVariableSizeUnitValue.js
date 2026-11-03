/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../../../../chunks/tslib.es6","../../GraphShaderModule","../../graph/glsl","./utils"],(function(e,i,t,l,o){"use strict";class a extends t.UniformGroup{getSize(e,i){return l.ifElse(o.isNan(e),i,e.multiply(this.unitValueToPixelsRatio))}}i.__decorate([t.uniform(l.Float)],a.prototype,"unitValueToPixelsRatio",void 0),e.VisualVariableSizeUnitValue=a,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
