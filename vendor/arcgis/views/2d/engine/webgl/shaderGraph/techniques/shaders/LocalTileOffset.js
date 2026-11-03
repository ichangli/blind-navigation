/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../../../../chunks/tslib.es6","../../GraphShaderModule","../../graph/glsl","./constants"],(function(t,e,i,l,o){"use strict";class r extends i.UniformGroup{getPatternOffsetAtTileOrigin(t,e=new l.Float(0),i=new l.Float(1)){const r=new l.Vec2(o.maxRepresentableInt).divide(t);let n=t.multiply(l.fract(this.maxIntsToLocalOrigin.multiply(r))).add(this.tileOffsetFromLocalOrigin).subtract(new l.Float(.5).multiply(t));return n=new l.Vec2(n.x.multiply(i).subtract(n.y.multiply(e)),n.x.multiply(e).add(n.y.multiply(i))),l.mod(n,t)}}e.__decorate([i.uniform(l.Vec2)],r.prototype,"tileOffsetFromLocalOrigin",void 0),e.__decorate([i.uniform(l.Vec2)],r.prototype,"maxIntsToLocalOrigin",void 0),t.LocalTileOffset=r,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
