/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../input/InputHandler"],(function(e,t){"use strict";const o=.6;class n extends t.InputHandler{constructor(e,t){super(!0),this._view=e,this._canZoom=!0,this.registerIncoming("mouse-wheel",t,(e=>this._handleMouseWheel(e)))}_handleMouseWheel(e){if(!this._view.navigation.mouseWheelZoomEnabled)return;if(e.preventDefault(),e.stopPropagation(),!this._canZoom)return;const t=this._view.mapViewNavigation,{x:n,y:i,deltaY:s}=e.data,a=1/o**(1/60*s),h=t.zoom(a,[n,i]);h&&(this._canZoom=!1,h.catch((()=>{})).then((()=>{this._canZoom=!0,t.end()})))}}e.MouseWheelZoom=n,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
