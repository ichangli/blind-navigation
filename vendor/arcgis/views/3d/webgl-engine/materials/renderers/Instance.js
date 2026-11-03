/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./BufferRange"],(function(e,t){"use strict";class s extends t.BufferRange{constructor(e,t,s){super(t,s),this.geometry=e}get isVisible(){return this.geometry.visible}get hasHighlights(){return null!=this.geometry.highlights&&this.isVisible}get hasOccludees(){return null!=this.geometry.occludees}}e.Instance=s,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
