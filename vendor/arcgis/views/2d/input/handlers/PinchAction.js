/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../input/DragEventSeparator","../../../input/InputHandler"],(function(t,i,n){"use strict";class a extends n.InputHandler{constructor(t){super(!0),this.view=t,this.registerIncoming("drag",(t=>this._handleDrag(t))),this.registerIncoming("pointer-down",(()=>this._stopMomentumNavigation()));const n=this.view.mapViewNavigation;this._dragEventSeparator=new i.DragEventSeparator({start:(t,i)=>{n.pinch.begin(this.view,i.data),i.stopPropagation()},update:(t,i)=>{n.pinch.update(this.view,i.data),i.stopPropagation()},end:(t,i)=>{n.pinch.end(this.view),i.stopPropagation()},condition:t=>t>=2})}_handleDrag(t){this._dragEventSeparator.handle(t)}_stopMomentumNavigation(){this.view.mapViewNavigation.pinch.stopMomentumNavigation()}}t.PinchRotateAndZoom=a,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
