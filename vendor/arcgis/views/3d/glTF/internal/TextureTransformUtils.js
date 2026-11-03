/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../core/libs/gl-matrix-2/factories/mat3f64","../../../../core/libs/gl-matrix-2/factories/vec2f32","../../../../core/libs/gl-matrix-2/math/mat3"],(function(t,e,l,r){"use strict";function o(t){if(null==t)return null;const o=null!=t.offset?t.offset:l.ZEROS,a=null!=t.rotation?t.rotation:0,i=null!=t.scale?t.scale:l.ONES,s=e.fromValues(1,0,0,0,1,0,o[0],o[1],1),n=e.fromValues(Math.cos(a),-Math.sin(a),0,Math.sin(a),Math.cos(a),0,0,0,1),f=e.fromValues(i[0],0,0,0,i[1],0,0,0,1),u=e.create();return r.multiply(u,n,f),r.multiply(u,s,u),u}t.getTransformMatrix=o,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
