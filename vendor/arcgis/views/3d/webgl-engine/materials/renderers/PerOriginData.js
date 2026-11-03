/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(e){"use strict";class s{constructor(e){this.origin=e,this.buffers=new Array}dispose(){this.buffers.forEach((e=>e.vao.dispose())),this.buffers.length=0}findBuffer(e){return this.buffers.find((s=>s.instances.has(e)))}}e.PerOriginData=s,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
