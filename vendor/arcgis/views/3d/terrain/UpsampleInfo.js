/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../core/libs/gl-matrix-2/factories/vec2f64"],(function(t,s){"use strict";class e{constructor(){this.offset=s.create(),this.scale=0,this.tile=null}init(t,s,e,i){this.tile=t,this.offset[0]=s,this.offset[1]=e,this.scale=i}dispose(){this.tile=null,this.offset[0]=0,this.offset[1]=0,this.scale=0}}t.UpsampleInfo=e,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
