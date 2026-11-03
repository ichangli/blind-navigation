/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(t){"use strict";class e{constructor(t,e,i){this._editGeometry=t,this._vertex=e,this._pos=i}apply(){const t=null==this._originalPosition;t&&(this._originalPosition=this._vertex.pos),this._apply(t?"apply":"redo")}undo(){this._vertex.pos=this._originalPosition,this._editGeometry.notifyChanges({operation:"undo",updatedVertices:[this._vertex]})}accumulate(t){return t instanceof e&&t._vertex===this._vertex&&(this._pos=t._pos,this._apply("apply"),!0)}_apply(t){this._vertex.pos=this._pos,this._editGeometry.components.forEach((t=>t.unnormalizeVertexPositions())),this._editGeometry.notifyChanges({operation:t,updatedVertices:[this._vertex]})}}t.SetVertexPosition=e,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
