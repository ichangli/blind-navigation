/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../input/DragEventSeparator","../../../input/InputHandler","../../../input/handlers/support"],(function(t,e,a,n){"use strict";class i extends a.InputHandler{constructor(t,a,i){super(!0),this._view=t,this.pointerAction=a;const r=this._view.mapViewNavigation;this._dragEventSeparator=new e.DragEventSeparator({start:(t,e)=>{r.rotate.begin(this._view,e.data),e.stopPropagation()},update:(t,e)=>{r.rotate.update(this._view,e.data),e.stopPropagation()},end:(t,e)=>{r.rotate.end(),e.stopPropagation()},condition:(t,e)=>1===t&&n.eventMatchesPointerAction(e.data,this.pointerAction)}),this.registerIncoming("drag",i,(t=>this._dragEventSeparator.handle(t)))}}t.DragRotate=i,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
