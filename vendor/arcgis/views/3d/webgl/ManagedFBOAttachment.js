/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./ManagedFBObject"],(function(e,t){"use strict";class s extends t.ManagedFBObject{constructor(e,t,s){super(e,s),this.attachment=t,this.name=""}dispose(){this.attachment.dispose()}get usedMemory(){return this.attachment.usedMemory}}e.ManagedFBOAttachment=s,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
