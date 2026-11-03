/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(t){"use strict";class e{constructor(t,e,i,s){this._editGeometry=t,this.dx=e,this.dy=i,this.dz=s,this._firstTime=!0}apply(){const t=this._firstTime?"apply":"redo";this._firstTime=!1,this._apply(t,this.dx,this.dy,this.dz)}undo(){this._apply("undo",-this.dx,-this.dy,-this.dz)}accumulate(t){const i=this._editGeometry.geometry;return t instanceof e&&t._editGeometry.geometry===i&&(this._apply("apply",t.dx,t.dy,t.dz),this.dx+=t.dx,this.dy+=t.dy,this.dz+=t.dz,!0)}_apply(t,e,i,s){const o=this._editGeometry.geometry;o.offset(e,i,s);const d=this._editGeometry.components[0].getFirstVertex();if(!d)return;const r=this._editGeometry.coordinateHelper;d.pos=r.pointToVector(o.anchor),this._editGeometry.notifyChanges({operation:t,updatedVertices:[d]})}}t.MoveMesh=e,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
