/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(t){"use strict";class e{constructor(t,e,s,d){this._helper=t,this.dx=e,this.dy=s,this.dz=d}_move(t,e,s,d){this._helper.addDelta(t.pos,e,s,d)}apply(t){this._move(t,this.dx,this.dy,this.dz)}undo(t){this._move(t,-this.dx,-this.dy,-this.dz)}canAccumulate(t){return t instanceof e}accumulate(t,e){this._move(t,e.dx,e.dy,e.dz)}accumulateParams(t){this.dx+=t.dx,this.dy+=t.dy,this.dz+=t.dz}}t.MoveVertex=e,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
