/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../webgl-engine/lib/Object3DStateSet"],(function(t,e){"use strict";class i{constructor(t,i){this.stateType=t,this.objectIdField=i,this.objectStateSet=new e.Object3DStateSet,this.ids=new Set,this.paused=!1}hasGraphic(t){if(this.objectIdField){const e=t.graphic.attributes[this.objectIdField];return this.ids.has(e)}return this.ids.has(t.graphic.uid)}}t.Graphics3DObjectStateSet=i,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
