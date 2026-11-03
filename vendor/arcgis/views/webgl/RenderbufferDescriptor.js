/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./Util"],(function(t,e){"use strict";class i{constructor(t,e,i=e){this.internalFormat=t,this.width=e,this.height=i,this.multisampled=!1,this.samples=1}}function r(t){return t.width<=0||t.height<=0||null==t.internalFormat?0:t.width*t.height*e.getBytesPerElementFormat(t.internalFormat)}t.RenderbufferDescriptor=i,t.estimateMemory=r,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
