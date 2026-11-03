/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../InputHandler"],(function(t,e){"use strict";class s extends e.InputHandler{constructor(t){super(!0),this._onChange=t,this._value="mouse",this._x=null,this._y=null,this.registerIncoming("pointer-move",(t=>{this._update(t.data)}))}_update(t){const e="touch"===t.native.pointerType?"touch":"mouse",{x:s,y:i}=t;e===this._value&&this._x===s&&this._y===i||(this._value=e,this._x=s,this._y=i,this._onChange(e,s,i))}}t.LatestPointer=s,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
