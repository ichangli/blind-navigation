/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../input/InputHandler"],(function(e,t){"use strict";class n extends t.InputHandler{constructor(e,t){super(!0),this.key=e,this.registerIncoming("key-down",t,(e=>this._handleKeyDown(e)))}_handleKeyDown(e){e.data.key===this.key&&(this.activate(),e.stopPropagation())}}e.SingleKey=n,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
