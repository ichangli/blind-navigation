/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../core/arrayUtils","../../../../core/libs/gl-matrix-2/math/vec2","./UpdateVertices"],(function(t,e,a,i){"use strict";class n{constructor(t,e,a=i.AccumulationType.CUMULATIVE){this.origin=t,this.angle=e,this._accumulationType=a}_rotate(t,e){a.rotate(t.pos,t.pos,this.origin,e)}apply(t){this._rotate(t,this.angle)}undo(t){this._rotate(t,-this.angle)}canAccumulate(t){return t instanceof n&&e.equals(this.origin,t.origin)}accumulate(t,e){const a=e._accumulationType===i.AccumulationType.REPLACE;this._rotate(t,a?e.angle-this.angle:e.angle)}accumulateParams(t){const e=t._accumulationType===i.AccumulationType.REPLACE;this.angle=e?t.angle:this.angle+t.angle}}t.RotateVertex=n,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
