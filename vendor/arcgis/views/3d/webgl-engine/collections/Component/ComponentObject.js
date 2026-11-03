/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../../core/maybe"],(function(e,t){"use strict";class s{constructor(e,t,s,o,i,r){this.transform=e,this.toMapSpace=t,this.obb=s,this.components=o,this.renderable=i,this.intersectionGeometry=r,this.visible=!1,this.offsetObb=null}destroy(){this.intersectionGeometry=t.destroyMaybe(this.intersectionGeometry),this.renderable=t.destroyMaybe(this.renderable),this.components=t.destroyMaybe(this.components)}}e.ComponentObject=s,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
