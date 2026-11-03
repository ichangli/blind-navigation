/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(s){"use strict";const e=s=>s.includes("Brush");class r{constructor(){this._names=new Map}begin(s){this._names.has(s)||(this._names.set(s,!1),e(s)&&this.record("Esri.FirstDraw"),performance.mark(`Esri.${s}.Start`))}end(s){this._names.has(s)&&!this._names.get(s)&&(this._names.set(s,!0),performance.mark(`Esri.${s}.End`))}record(s){this._names.has(s)||(this._names.set(s,!0),performance.mark(`Esri.${s}`))}}s.Timeline=r,Object.defineProperty(s,Symbol.toStringTag,{value:"Module"})}));
