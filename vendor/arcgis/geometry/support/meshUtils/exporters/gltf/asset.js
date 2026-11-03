/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../../core/arrayUtils"],(function(e,s){"use strict";class t{constructor(){this.copyright="",this.defaultScene=0,this.generator="",this._scenes=[]}addScene(e){if(this._scenes.includes(e))throw new Error("Scene already added");this._scenes.push(e)}removeScene(e){s.remove(this._scenes,e)}forEachScene(e){this._scenes.forEach(e)}}e.Asset=t,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
