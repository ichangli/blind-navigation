/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../input/InputHandler","../../../input/handlers/support"],(function(t,e,i){"use strict";class a extends e.InputHandler{constructor(t,e){super(!0),this._view=t,this.registerIncoming("double-click",e,(t=>this._handleDoubleClick(t,e)))}_handleDoubleClick(t,e){i.eventMatchesPointerAction(t.data,"primary")&&(t.stopPropagation(),e?this._view.mapViewNavigation.zoomOut([t.data.x,t.data.y]):this._view.mapViewNavigation.zoomIn([t.data.x,t.data.y]))}}t.DoubleClickZoom=a,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
