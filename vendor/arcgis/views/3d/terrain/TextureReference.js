/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../core/libs/gl-matrix-2/factories/vec3f64","../../../core/libs/gl-matrix-2/factories/vec4f64"],(function(e,t,s){"use strict";class r{constructor(e,r,i,o,c,f){this.texture=e,this.type=r,e.retain(),this.offsetAndScale=s.fromValues(i.offset[0],i.offset[1],i.scale,i.scale),this.opacities=t.fromValues(o,c,f)}destroy(){this.texture.release()}}e.TextureReference=r,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
